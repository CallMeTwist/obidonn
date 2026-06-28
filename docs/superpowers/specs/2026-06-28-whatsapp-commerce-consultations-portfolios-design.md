# Design: WhatsApp commerce, consultations, contact & portfolios

**Date:** 2026-06-28
**Status:** Approved (pending spec review)

## Overview

Five workstreams across the OBIDONN frontend (`apps/web/buildsmart-commerce-main`) and
Laravel backend (`apps/api/obidonn-backend`):

1. A shared business-info config module (single source of truth for contact details).
2. Consultation booking via WhatsApp on the service pages and Contact page.
3. Social links (Instagram).
4. Real addresses shown, with the primary one pinned on the map.
5. Store checkout that hands off to WhatsApp, lands the order in the admin panel, reserves
   stock, expires unpaid orders after 2 days, and lets the admin mark an order paid.
6. Admin order notifications (email + Filament bell) on new orders and 24h before expiry.
7. Real portfolio imagery on the Architectural page; a new portfolio section on the Interior page.

## Decisions (locked)

- **WhatsApp business number:** `08186927183` (E.164 `2348186927183`) receives both consultation
  and store-order messages. All three numbers remain listed as contact numbers.
- **Stock:** reserved (decremented) at checkout; restored automatically when an order expires
  unpaid or is cancelled.
- **Expiry:** after 2 days unpaid an order becomes `expired` — hidden from the default Orders
  list but viewable via an "Expired" filter (not deleted).
- **Map:** both addresses listed; map pins **Eda Plaza, Jabi, Abuja**.
- **Admin notifications:** Email + Filament in-panel bell, plus a 24h pre-expiry reminder.
  Telegram/SMS/WhatsApp-to-admin intentionally deferred; architecture stays channel-pluggable.
- **Credentials:** integrations read from `.env`; a channel with no credentials is skipped
  cleanly rather than erroring.

## Out of scope

- No online payment gateway — payment is confirmed manually from a WhatsApp receipt.
- No Telegram/SMS/WhatsApp-to-admin channels in this pass (deferred).
- No admin CRUD for portfolio images — they are static Vite assets.

---

## 1. Shared business-info module

Create `apps/web/buildsmart-commerce-main/src/config/business.ts` as the single source of truth:

```ts
export const BUSINESS = {
  phones: ["08186927183", "08033153475", "08035620015"],
  whatsapp: "2348186927183",                 // E.164 for wa.me
  email: "donnsproperties@gmail.com",
  addresses: [
    "Eda Plaza, Jabi, Abuja, Nigeria",
    "Abari Shopping Complex, Wuse Zone 5, Abuja, Nigeria",
  ],
  mapAddress: "Eda Plaza, Jabi, Abuja, Nigeria",
  hours: "Mon–Sat 8am–6pm",
  socials: {
    instagram:
      "https://www.instagram.com/donns_designs?igsh=dHVtNG1zdzRlamh6&utm_source=qr",
  },
} as const;

// Helper for prefilled WhatsApp links
export const waLink = (text: string) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
```

`Contact.tsx`, `Footer.tsx`, `Checkout.tsx`, and `BookingForm.tsx` all import from here. This
replaces every placeholder (`hello@donns.com`, `+234 800 000 0000`, "Lagos, Nigeria", fake
WhatsApp number) in one move.

**Unit/interface:** pure data + one helper; no dependencies; trivially testable.

---

## 2. Consultation booking via WhatsApp

**`BookingForm.tsx`** (used on `/services/architectural` and `/services/interior`):

- Keep the existing "Request a Consultation" button → `POST /api/consultations` (unchanged).
- Add a secondary **"Book on WhatsApp"** button. On click it validates `name` + `message`
  (reusing the existing zod schema fields), then opens `waLink(...)` pre-filled with name, email,
  phone, project type, service type, and message so the conversation continues in WhatsApp.
- Helper text clarifies: form submits to the team; WhatsApp opens the chat directly.

**`Contact.tsx`:** already has a WhatsApp send path — repoint it to `BUSINESS.whatsapp` via the
shared module and align copy. No structural change.

---

## 3. Socials

- Add an Instagram icon-link (`BUSINESS.socials.instagram`, `lucide-react` `Instagram`, opens in
  new tab with `rel="noopener noreferrer"`) to:
  - `Footer.tsx` (a small socials row).
  - `Contact.tsx` (in the contact-info column).
- Structure (`socials` object) supports adding more platforms later; only Instagram is wired now.

---

## 4. Address on the map

**`Contact.tsx`:**
- Info column lists **both** addresses (`BUSINESS.addresses`).
- The existing Google Maps `<iframe>` uses `BUSINESS.mapAddress` (Eda Plaza, Jabi) as the query.

**`Footer.tsx`:** contact block shows the real phone(s), email, and addresses from the module.

---

## 5. Store flow: WhatsApp checkout + admin tracking + 2-day expiry

### 5.1 Frontend — `Checkout.tsx`

On "Place Order":
1. `POST /api/orders` exactly as today (so the order is recorded in the admin panel and stock is
   reserved). On success the response provides `order_number`.
2. Open `waLink(...)` pre-filled with: order number, each line item (product name, size, qty,
   unit price), order total, and the customer's name / phone / delivery address / notes.
3. Clear the cart and show a confirmation screen instructing the customer to **complete payment
   and send the receipt on WhatsApp**, and noting the order is held for 2 days.

The WhatsApp window opens from the user's click (success path) to avoid popup blocking; if it is
blocked, the confirmation screen shows a fallback "Open WhatsApp" link.

### 5.2 Backend — schema

New migration on `orders`:
- `payment_status` enum `('unpaid','paid','expired')` default `unpaid`.
- `paid_at` nullable timestamp.
- `expires_at` timestamp (nullable to allow backfill; set on creation).
- `reminded_at` nullable timestamp (for the 24h reminder, section 6).

The existing fulfillment `status` enum (pending → … → delivered/cancelled) is untouched; payment
status layers on top. Update `Order` model: `casts()` for the new datetimes, a `$paymentStatuses`
map + label accessor, and constants (`PAYMENT_UNPAID`, `PAYMENT_PAID`, `PAYMENT_EXPIRED`).

### 5.3 Backend — lifecycle

- `OrderController@store`: set `expires_at = now()->addDays(2)` and `payment_status = unpaid` on
  create. Stock reservation (decrement) stays as-is inside the existing DB transaction.
- New command `orders:expire-unpaid` (`app/Console/Commands`): inside a transaction, for each
  `unpaid` order with `expires_at <= now()`, restore each line item's stock (to product or
  variant, mirroring how `store` decremented it), then set `payment_status = expired`. Idempotent.
- Scheduled hourly in `routes/console.php`.

### 5.4 Backend — Filament `OrderResource`

- Default table query: `whereNot('payment_status', 'expired')` (hide expired by default).
- Add a `payment_status` badge column (unpaid=warning, paid=success, expired=gray) and a
  `SelectFilter` on `payment_status` including an explicit "Expired" option.
- Add **"Mark as Paid"** as a row action and a bulk action: sets `payment_status = paid`, stamps
  `paid_at = now()`, nulls `expires_at`, and bumps fulfillment `status` to `confirmed`.
- Infolist/view page: surface payment status, `paid_at`, and `expires_at`.

**Scheduler requirement (documented):** the two new commands (`orders:expire-unpaid` and
`orders:remind-unpaid`, section 6) need Laravel's scheduler running — `php artisan schedule:work` in dev, or a cron entry calling `schedule:run` in prod. As a
safety net the admin list hides past-due unpaid orders regardless, but stock is only restored when
the command runs.

---

## 6. Admin order notifications

Laravel Notifications, each fanning out to **mail** + **Filament database** (bell) channels.
Recipient is an on-demand notifiable routed to `config('business.admin_email')` (default
`donnsproperties@gmail.com`) — no extra admin user accounts.

- New config `config/business.php` with `admin_email` (from `env('ADMIN_EMAIL', 'donnsproperties@gmail.com')`).
- `NewOrderNotification`: built in `OrderController@store` after the order is created, wrapped in
  try/catch so a notification failure never breaks checkout. Contains order number, customer,
  items, total; mail links to the order in `/admin`.
- `OrderExpiringSoonNotification`: sent by a new command `orders:remind-unpaid` for `unpaid`
  orders whose `expires_at` is within the next 24h and `reminded_at is null`; sets `reminded_at`
  to avoid duplicates. Scheduled hourly.
- **Mail config:** needs `MAIL_*` in `.env` (Gmail SMTP or a provider). Without it, dev uses the
  `log` mailer and the **Filament bell channel still delivers** (no SMTP needed).

`routes/console.php` schedules two new hourly jobs: `orders:expire-unpaid` and
`orders:remind-unpaid`.

**Tests (Pest):** `Notification::fake()` to assert `NewOrderNotification` is sent on order
creation; a feature test for `orders:expire-unpaid` (expires + restores stock, ignores paid); a
feature test for `orders:remind-unpaid` (sends once, respects `reminded_at`).

---

## 7. Portfolios — real imagery

### 7.1 Assets

Move photos out of `docs/for donn/` into the Vite asset tree with clean slugs:
- `src/assets/brand/portfolio/arch/arch-1.jpeg … arch-4.jpeg` (4 images).
- `src/assets/brand/portfolio/interior/interior-1.jpeg … interior-10.jpeg` (10 images).

(Original `docs/for donn/` folder may be left as-is or removed; not committed as app assets.)

### 7.2 Architectural page (`pages/services/Architectural.tsx`)

- Replace the 6 duplicated placeholder tiles (`portfolioTiles` of `archImage`/`pinImage`) with the
  4 real arch images imported from the new folder.
- Remove the `TODO(content)` comment.

### 7.3 Interior page (`pages/services/Interior.tsx`)

- Add a new `#portfolio` section, mirroring the Architectural portfolio grid style
  (`SectionHeading` + responsive grid + hover-scale `Reveal` tiles), rendering the 10 interior
  images.

---

## Testing summary

- **Frontend:** existing Vitest setup. Add/adjust where sensible (e.g. business module import,
  BookingForm WhatsApp button presence). Keep changes minimal and typed (strict mode).
- **Backend:** Pest feature tests for the expire command, the reminder command, and the new-order
  notification; run `vendor/bin/pint --dirty --format agent` after PHP edits.

## Files touched (anticipated)

**Frontend**
- `src/config/business.ts` (new)
- `src/pages/Contact.tsx`, `src/components/layout/Footer.tsx`
- `src/components/services/BookingForm.tsx`
- `src/pages/Checkout.tsx`
- `src/pages/services/Architectural.tsx`, `src/pages/services/Interior.tsx`
- `src/assets/brand/portfolio/**` (new images)

**Backend**
- `database/migrations/*_add_payment_tracking_to_orders.php` (new)
- `app/Models/Order.php`
- `app/Http/Controllers/Api/OrderController.php`
- `app/Console/Commands/ExpireUnpaidOrders.php`, `RemindUnpaidOrders.php` (new)
- `app/Notifications/NewOrderNotification.php`, `OrderExpiringSoonNotification.php` (new)
- `config/business.php` (new)
- `app/Filament/Resources/OrderResource.php`
- `routes/console.php`
- `tests/Feature/*` (new)
