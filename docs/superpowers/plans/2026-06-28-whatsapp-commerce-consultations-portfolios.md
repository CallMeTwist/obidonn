# WhatsApp Commerce, Consultations, Contact & Portfolios — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add WhatsApp handoff to the store checkout and consultation forms, real contact details + map + Instagram, admin order tracking with 2-day unpaid expiry + paid confirmation + email/bell notifications, and real portfolio imagery on both service pages.

**Architecture:** Frontend (React 18 + TS + Vite) centralizes business contact data in one config module consumed everywhere; checkout still creates the order via the existing API then opens a prefilled WhatsApp chat. Backend (Laravel 12 + Filament 3) gains payment-tracking columns on `orders`, two scheduled artisan commands (expire unpaid + restore stock; remind 24h before expiry), Laravel notifications (mail + Filament database bell) to admin users, and Filament actions to mark orders paid.

**Tech Stack:** React 18, TypeScript (strict), Vite, Vitest, Tailwind, shadcn/ui, lucide-react; Laravel 12, Filament 3, Pest 4, MySQL.

## Global Constraints

- Frontend: TypeScript strict mode — all new code fully typed. Currency rendered as `₦` with `toLocaleString()`. Reuse existing components in `src/components/` before creating new ones.
- WhatsApp business number: `2348186927183` (wa.me / E.164). Displayed phones: `08186927183`, `08033153475`, `08035620015`.
- Business email: `donnsproperties@gmail.com`. Addresses: `Eda Plaza, Jabi, Abuja, Nigeria` and `Abari Shopping Complex, Wuse Zone 5, Abuja, Nigeria`. Map pins Eda Plaza, Jabi.
- Instagram: `https://www.instagram.com/donns_designs?igsh=dHVtNG1zdzRlamh6&utm_source=qr`. External links open in a new tab with `rel="noopener noreferrer"`.
- Backend: use `php artisan make:` for new files with `--no-interaction`; create Form Requests for validation; prefer `Model::query()` over `DB::` raw; run `vendor/bin/pint --dirty --format agent` after any PHP change. Tests are Pest 4 (`php artisan make:test --pest`).
- Payment status (`payment_status`) values: `unpaid`, `paid`, `expired`. Fulfillment `status` enum is unchanged. Expired orders are hidden by default in admin, never deleted. Marking paid bumps fulfillment status to `confirmed` only when it is currently `pending`.
- Frontend commands run in `apps/web/buildsmart-commerce-main/`; backend commands run in `apps/api/obidonn-backend/`.

---

## Task 1: Business config module (frontend)

**Files:**
- Create: `apps/web/buildsmart-commerce-main/src/config/business.ts`
- Test: `apps/web/buildsmart-commerce-main/src/config/business.test.ts`

**Interfaces:**
- Produces: `BUSINESS` (const object: `phones: string[]`, `whatsapp: string`, `email: string`, `addresses: string[]`, `mapAddress: string`, `hours: string`, `socials: { instagram: string }`) and `waLink(text: string): string`.

- [ ] **Step 1: Write the failing test**

```ts
// src/config/business.test.ts
import { describe, it, expect } from "vitest";
import { BUSINESS, waLink } from "./business";

describe("business config", () => {
  it("exposes the WhatsApp number in E.164 form", () => {
    expect(BUSINESS.whatsapp).toBe("2348186927183");
  });

  it("builds an encoded wa.me link", () => {
    expect(waLink("Hi there & welcome")).toBe(
      "https://wa.me/2348186927183?text=Hi%20there%20%26%20welcome",
    );
  });

  it("lists both addresses and the real email", () => {
    expect(BUSINESS.addresses).toHaveLength(2);
    expect(BUSINESS.email).toBe("donnsproperties@gmail.com");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web/buildsmart-commerce-main && npx vitest run src/config/business.test.ts`
Expected: FAIL — cannot resolve `./business`.

- [ ] **Step 3: Write the module**

```ts
// src/config/business.ts
export const BUSINESS = {
  phones: ["08186927183", "08033153475", "08035620015"],
  whatsapp: "2348186927183",
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

export const waLink = (text: string): string =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/config/business.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/config/business.ts apps/web/buildsmart-commerce-main/src/config/business.test.ts
git commit -m "feat(web): add central business config module"
```

---

## Task 2: Contact page — real data, both addresses, map pin, Instagram

**Files:**
- Modify: `apps/web/buildsmart-commerce-main/src/pages/Contact.tsx`

**Interfaces:**
- Consumes: `BUSINESS`, `waLink` from Task 1.

- [ ] **Step 1: Replace the hardcoded constants with the config module**

In `Contact.tsx`, delete lines 7–10 (the four `BUSINESS_*` consts) and update the import block at the top to add:

```tsx
import { Phone, Mail, MapPin, Send, MessageCircle, Instagram } from "lucide-react";
import { BUSINESS, waLink } from "@/config/business";
```

- [ ] **Step 2: Point the WhatsApp + email handlers at the config**

Replace `handleEmail`'s `window.location.href` line with:

```tsx
window.location.href = `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`;
```

Replace the body of `handleWhatsApp` after the validation guard with:

```tsx
window.open(
  waLink(
    `Hello, I'm ${form.name}.\n\n*Subject:* ${form.subject || "General Enquiry"}\n\n${form.message}\n\nReply to: ${form.email}`,
  ),
  "_blank",
  "noopener,noreferrer",
);
```

- [ ] **Step 3: Show real phones, email, both addresses, and the map pin**

In the Phone block replace the single `<p>{BUSINESS_PHONE}</p>` with the three numbers (first one labelled WhatsApp):

```tsx
<h3 className="font-heading text-sm font-semibold text-foreground">Phone / WhatsApp</h3>
{BUSINESS.phones.map((p, i) => (
  <p key={p} className="text-sm text-foreground">
    {p}{i === 0 ? " (WhatsApp)" : ""}
  </p>
))}
<p className="text-xs text-muted-foreground">{BUSINESS.hours}</p>
```

In the Email block use `{BUSINESS.email}`. In the Address block replace the single address `<p>` with:

```tsx
<h3 className="font-heading text-sm font-semibold text-foreground">Address</h3>
{BUSINESS.addresses.map((a) => (
  <p key={a} className="text-sm text-foreground">{a}</p>
))}
<p className="text-xs text-muted-foreground">Visit us in person</p>
```

Change the map iframe `src` to use the pinned address:

```tsx
src={`https://maps.google.com/maps?q=${encodeURIComponent(BUSINESS.mapAddress)}&output=embed`}
```

- [ ] **Step 4: Add an Instagram link under the contact info**

Immediately after the closing `</div>` of the `space-y-6` info block (before the Map `<div className="mt-8 ...">`), add:

```tsx
<a
  href={BUSINESS.socials.instagram}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-6 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-gold"
>
  <span className={iconBox}><Instagram className="h-5 w-5" /></span>
  Follow us on Instagram
</a>
```

- [ ] **Step 5: Verify it compiles and lints**

Run: `cd apps/web/buildsmart-commerce-main && npm run lint && npx tsc --noEmit`
Expected: no errors. (No `BUSINESS_*` references remain.)

- [ ] **Step 6: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/pages/Contact.tsx
git commit -m "feat(web): real contact details, both addresses, map pin, Instagram on Contact page"
```

---

## Task 3: Footer — real contact data + Instagram

**Files:**
- Modify: `apps/web/buildsmart-commerce-main/src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `BUSINESS` from Task 1.

- [ ] **Step 1: Import config and the Instagram icon**

Replace the icon import line and add the config import:

```tsx
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { BUSINESS } from "@/config/business";
```

- [ ] **Step 2: Replace the hardcoded contact block**

Replace the three `<span>` lines inside the Contact column (`+234 800 000 0000`, `hello@donns.com`, `Lagos, Nigeria`) with:

```tsx
<span className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {BUSINESS.phones[0]}</span>
<span className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {BUSINESS.email}</span>
{BUSINESS.addresses.map((a) => (
  <span key={a} className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {a}</span>
))}
<a href={BUSINESS.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-gold">
  <Instagram className="h-4 w-4 text-gold" /> Instagram
</a>
```

- [ ] **Step 3: Verify it compiles and lints**

Run: `cd apps/web/buildsmart-commerce-main && npm run lint && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/layout/Footer.tsx
git commit -m "feat(web): real contact details + Instagram in footer"
```

---

## Task 4: BookingForm — "Book on WhatsApp" option

**Files:**
- Modify: `apps/web/buildsmart-commerce-main/src/components/services/BookingForm.tsx`
- Modify: `apps/web/buildsmart-commerce-main/src/components/services/BookingForm.test.tsx`

**Interfaces:**
- Consumes: `waLink` from Task 1; existing `submitConsultation`, `ServiceType`.

- [ ] **Step 1: Add a failing test for the WhatsApp button**

Append this test inside the existing `describe("BookingForm", ...)` block in `BookingForm.test.tsx`:

```tsx
it("opens a prefilled WhatsApp chat when Book on WhatsApp is clicked", async () => {
  const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
  render(<BookingForm serviceType="architectural" />);

  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Ada Obi" } });
  fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "New build in Abuja." } });
  fireEvent.click(screen.getByRole("button", { name: /book on whatsapp/i }));

  await waitFor(() => expect(openSpy).toHaveBeenCalled());
  const url = openSpy.mock.calls[0][0] as string;
  expect(url).toContain("https://wa.me/2348186927183");
  expect(decodeURIComponent(url)).toContain("Ada Obi");
  openSpy.mockRestore();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/web/buildsmart-commerce-main && npx vitest run src/components/services/BookingForm.test.tsx`
Expected: FAIL — no button named "Book on WhatsApp".

- [ ] **Step 3: Add the WhatsApp handler and button**

In `BookingForm.tsx`, add the import `import { waLink } from "@/config/business";` and pull `getValues` from `useForm`:

```tsx
const { register, handleSubmit, reset, getValues, formState: { errors, isSubmitting } } =
  useForm<FormValues>({ resolver: zodResolver(schema) });
```

Add this handler above the `if (done)` block:

```tsx
const handleWhatsApp = () => {
  const v = getValues();
  if (!v.name || !v.message) {
    toast({ title: "Add your name and a short message first", variant: "destructive" });
    return;
  }
  const text = `Hello, I'd like to book a *${serviceType}* consultation.\n\nName: ${v.name}\nEmail: ${v.email || "—"}\nPhone: ${v.phone || "—"}\nProject: ${v.project_type || "—"}\n\n${v.message}`;
  window.open(waLink(text), "_blank", "noopener,noreferrer");
};
```

Replace the single submit `GoldButton` at the bottom of the form with a row of two buttons:

```tsx
<div className="flex flex-col gap-3 sm:flex-row">
  <GoldButton type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
    {isSubmitting ? "Sending…" : "Request a Consultation"}
  </GoldButton>
  <button
    type="button"
    onClick={handleWhatsApp}
    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-500 px-6 py-3 text-sm font-semibold text-green-500 transition-colors hover:bg-green-500/10 sm:w-auto"
  >
    Book on WhatsApp
  </button>
</div>
<p className="text-xs text-muted-foreground">
  Submit to reach the team by email, or continue the conversation instantly on WhatsApp.
</p>
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/services/BookingForm.test.tsx`
Expected: PASS (all 3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/services/BookingForm.tsx apps/web/buildsmart-commerce-main/src/components/services/BookingForm.test.tsx
git commit -m "feat(web): add Book on WhatsApp option to consultation form"
```

---

## Task 5: Portfolio imagery — move assets + Architectural + Interior

**Files:**
- Create: `apps/web/buildsmart-commerce-main/src/assets/brand/portfolio/arch/arch-1.jpeg` … `arch-4.jpeg`
- Create: `apps/web/buildsmart-commerce-main/src/assets/brand/portfolio/interior/interior-1.jpeg` … `interior-10.jpeg`
- Modify: `apps/web/buildsmart-commerce-main/src/pages/services/Architectural.tsx`
- Modify: `apps/web/buildsmart-commerce-main/src/pages/services/Interior.tsx`

**Interfaces:**
- Consumes: nothing. Pure asset + presentational change.

- [ ] **Step 1: Copy and rename the source images into the Vite asset tree**

Run (Git Bash):

```bash
cd "c:/Users/ADMIN/Documents/OBIDONN"
mkdir -p apps/web/buildsmart-commerce-main/src/assets/brand/portfolio/arch
mkdir -p apps/web/buildsmart-commerce-main/src/assets/brand/portfolio/interior
i=1; for f in "docs/for donn/arch/"*.jpeg; do cp "$f" "apps/web/buildsmart-commerce-main/src/assets/brand/portfolio/arch/arch-$i.jpeg"; i=$((i+1)); done
i=1; for f in "docs/for donn/interior design/"*.jpeg; do cp "$f" "apps/web/buildsmart-commerce-main/src/assets/brand/portfolio/interior/interior-$i.jpeg"; i=$((i+1)); done
ls apps/web/buildsmart-commerce-main/src/assets/brand/portfolio/arch apps/web/buildsmart-commerce-main/src/assets/brand/portfolio/interior
```

Expected: `arch-1.jpeg`…`arch-4.jpeg` (4 files) and `interior-1.jpeg`…`interior-10.jpeg` (10 files).

- [ ] **Step 2: Wire the real arch images into the Architectural portfolio**

In `Architectural.tsx`, replace the three placeholder import lines for `pinImage`/`sketchImage` usage in the portfolio only by adding these imports near the top:

```tsx
import arch1 from "@/assets/brand/portfolio/arch/arch-1.jpeg";
import arch2 from "@/assets/brand/portfolio/arch/arch-2.jpeg";
import arch3 from "@/assets/brand/portfolio/arch/arch-3.jpeg";
import arch4 from "@/assets/brand/portfolio/arch/arch-4.jpeg";
```

Replace the `portfolioTiles` definition (line 25) with:

```tsx
const portfolioTiles = [arch1, arch2, arch3, arch4];
```

Delete the `{/* TODO(content): replace with real project imagery + titles */}` comment line. Leave the rest of the page (hero, stats, sketch sections) untouched.

- [ ] **Step 3: Add a portfolio section to the Interior page**

In `Interior.tsx`, add these imports near the top:

```tsx
import int1 from "@/assets/brand/portfolio/interior/interior-1.jpeg";
import int2 from "@/assets/brand/portfolio/interior/interior-2.jpeg";
import int3 from "@/assets/brand/portfolio/interior/interior-3.jpeg";
import int4 from "@/assets/brand/portfolio/interior/interior-4.jpeg";
import int5 from "@/assets/brand/portfolio/interior/interior-5.jpeg";
import int6 from "@/assets/brand/portfolio/interior/interior-6.jpeg";
import int7 from "@/assets/brand/portfolio/interior/interior-7.jpeg";
import int8 from "@/assets/brand/portfolio/interior/interior-8.jpeg";
import int9 from "@/assets/brand/portfolio/interior/interior-9.jpeg";
import int10 from "@/assets/brand/portfolio/interior/interior-10.jpeg";
```

Add this constant above the `Interior` component definition:

```tsx
const portfolioTiles = [int1, int2, int3, int4, int5, int6, int7, int8, int9, int10];
```

Insert this section immediately before the `{/* Booking */}` section:

```tsx
{/* Portfolio */}
<section id="portfolio" className="container mx-auto px-4 pb-24">
  <SectionHeading eyebrow="Selected work" title="Interiors we've shaped" />
  <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {portfolioTiles.map((img, i) => (
      <Reveal key={i} className="group overflow-hidden rounded-xl border border-border">
        <img
          src={img}
          alt={`Interior project ${i + 1}`}
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Reveal>
    ))}
  </div>
</section>
```

- [ ] **Step 4: Verify the build picks up the assets**

Run: `cd apps/web/buildsmart-commerce-main && npx tsc --noEmit && npm run build`
Expected: build succeeds; no "Unable to resolve" import errors for the portfolio images.

- [ ] **Step 5: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/assets/brand/portfolio apps/web/buildsmart-commerce-main/src/pages/services/Architectural.tsx apps/web/buildsmart-commerce-main/src/pages/services/Interior.tsx
git commit -m "feat(web): real portfolio imagery on Architectural + new Interior portfolio"
```

---

## Task 6: Orders payment-tracking migration

**Files:**
- Create: `apps/api/obidonn-backend/database/migrations/2026_06_28_000001_add_payment_tracking_to_orders.php`

**Interfaces:**
- Produces: `orders.payment_status` (enum `unpaid|paid|expired`, default `unpaid`), `orders.paid_at` (nullable datetime), `orders.expires_at` (nullable datetime), `orders.reminded_at` (nullable datetime).

- [ ] **Step 1: Generate the migration**

Run: `cd apps/api/obidonn-backend && php artisan make:migration add_payment_tracking_to_orders --table=orders --no-interaction`

(Rename the generated file to the dated name above if different, or keep the generated name — either is fine as long as it runs after the create-orders migration.)

- [ ] **Step 2: Write the migration body**

```php
public function up(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->enum('payment_status', ['unpaid', 'paid', 'expired'])
            ->default('unpaid')
            ->after('status');
        $table->timestamp('paid_at')->nullable()->after('payment_status');
        $table->timestamp('expires_at')->nullable()->after('paid_at');
        $table->timestamp('reminded_at')->nullable()->after('expires_at');
    });
}

public function down(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->dropColumn(['payment_status', 'paid_at', 'expires_at', 'reminded_at']);
    });
}
```

- [ ] **Step 3: Run the migration**

Run: `php artisan migrate`
Expected: migration runs successfully. Confirm with `php artisan db:show --counts` or the `database-schema` tool that `orders` now has the four new columns.

- [ ] **Step 4: Commit**

```bash
git add apps/api/obidonn-backend/database/migrations
git commit -m "feat(api): add payment tracking columns to orders"
```

---

## Task 7: Order model — payment status, casts, helper methods

**Files:**
- Modify: `apps/api/obidonn-backend/app/Models/Order.php`
- Test: `apps/api/obidonn-backend/tests/Feature/OrderModelTest.php`

**Interfaces:**
- Consumes: migration from Task 6.
- Produces: constants `Order::PAYMENT_UNPAID|PAYMENT_PAID|PAYMENT_EXPIRED`; `Order::$paymentStatuses` (array); `getPaymentStatusLabelAttribute(): string`; `markAsPaid(): void`; `restoreStock(): void`; `casts()` with `paid_at`, `expires_at`, `reminded_at` as `datetime`.

- [ ] **Step 1: Write the failing test**

Run: `cd apps/api/obidonn-backend && php artisan make:test --pest OrderModelTest`

```php
// tests/Feature/OrderModelTest.php
use App\Models\Order;
use App\Models\Product;

it('marks an order as paid and confirms a pending order', function () {
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100,
        'status' => Order::STATUS_PENDING, 'payment_status' => Order::PAYMENT_UNPAID,
        'expires_at' => now()->addDays(2),
    ]);

    $order->markAsPaid();

    expect($order->payment_status)->toBe(Order::PAYMENT_PAID)
        ->and($order->status)->toBe(Order::STATUS_CONFIRMED)
        ->and($order->paid_at)->not->toBeNull()
        ->and($order->expires_at)->toBeNull();
});

it('does not rewind a non-pending fulfillment status when paid', function () {
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100,
        'status' => Order::STATUS_OUT_FOR_DELIVERY, 'payment_status' => Order::PAYMENT_UNPAID,
    ]);

    $order->markAsPaid();

    expect($order->status)->toBe(Order::STATUS_OUT_FOR_DELIVERY);
});

it('restores product stock for its items', function () {
    $product = Product::factory()->create(['stock' => 5, 'has_variants' => false]);
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100, 'status' => Order::STATUS_PENDING,
    ]);
    $order->items()->create([
        'product_id' => $product->id, 'variant_id' => null, 'product_name' => $product->name,
        'variant_size' => null, 'quantity' => 3, 'unit_price' => 100, 'subtotal' => 300,
    ]);

    $order->load('items')->restoreStock();

    expect($product->fresh()->stock)->toBe(8);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `php artisan test --compact --filter=OrderModelTest`
Expected: FAIL — `markAsPaid`/`restoreStock`/constants not defined.

- [ ] **Step 3: Extend the Order model**

Add `use App\Models\Product;` and `use App\Models\ProductVariant;` imports. Add constants and the payment-status map alongside the existing ones:

```php
const PAYMENT_UNPAID  = 'unpaid';
const PAYMENT_PAID    = 'paid';
const PAYMENT_EXPIRED = 'expired';

public static array $paymentStatuses = [
    'unpaid'  => 'Unpaid',
    'paid'    => 'Paid',
    'expired' => 'Expired',
];
```

Add `'payment_status'`, `'paid_at'`, `'expires_at'`, `'reminded_at'` to `$fillable`. Replace the `$casts` property with a `casts()` method (Laravel 12 convention):

```php
protected function casts(): array
{
    return [
        'subtotal'    => 'float',
        'total'       => 'float',
        'paid_at'     => 'datetime',
        'expires_at'  => 'datetime',
        'reminded_at' => 'datetime',
    ];
}
```

Add the helper methods:

```php
public function getPaymentStatusLabelAttribute(): string
{
    return self::$paymentStatuses[$this->payment_status] ?? $this->payment_status;
}

public function markAsPaid(): void
{
    $this->payment_status = self::PAYMENT_PAID;
    $this->paid_at = now();
    $this->expires_at = null;
    if ($this->status === self::STATUS_PENDING) {
        $this->status = self::STATUS_CONFIRMED;
    }
    $this->save();
}

public function restoreStock(): void
{
    foreach ($this->items as $item) {
        if ($item->variant_id) {
            ProductVariant::query()->where('id', $item->variant_id)->increment('stock', $item->quantity);
        } else {
            Product::query()->where('id', $item->product_id)->increment('stock', $item->quantity);
        }
    }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `php artisan test --compact --filter=OrderModelTest`
Expected: PASS (3 tests). Then `vendor/bin/pint --dirty --format agent`.

- [ ] **Step 5: Commit**

```bash
git add apps/api/obidonn-backend/app/Models/Order.php apps/api/obidonn-backend/tests/Feature/OrderModelTest.php
git commit -m "feat(api): payment status, casts, markAsPaid and restoreStock on Order"
```

---

## Task 8: Set expiry on order creation + fire new-order notification

**Files:**
- Modify: `apps/api/obidonn-backend/app/Http/Controllers/Api/OrderController.php`
- Create: `apps/api/obidonn-backend/app/Notifications/NewOrderNotification.php`
- Test: `apps/api/obidonn-backend/tests/Feature/OrderCreationTest.php`

**Interfaces:**
- Consumes: `Order` constants/casts from Task 7.
- Produces: orders created with `payment_status = unpaid` and `expires_at = now()+2 days`; `NewOrderNotification` (channels `mail` + `database`) sent to all `User` records.

- [ ] **Step 1: Generate the notification**

Run: `cd apps/api/obidonn-backend && php artisan make:notification NewOrderNotification --no-interaction`

- [ ] **Step 2: Write the failing test**

Run: `php artisan make:test --pest OrderCreationTest`

```php
// tests/Feature/OrderCreationTest.php
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Support\Facades\Notification;

it('creates an unpaid order with a 2-day expiry and notifies admins', function () {
    Notification::fake();
    User::factory()->create();
    $product = Product::factory()->create(['stock' => 10, 'has_variants' => false, 'is_active' => true]);

    $response = $this->postJson('/api/orders', [
        'full_name' => 'Ada Obi', 'phone' => '08010000000', 'delivery_address' => 'Jabi, Abuja',
        'items' => [['product_id' => $product->id, 'variant_id' => null, 'quantity' => 2]],
    ]);

    $response->assertCreated();
    $order = Order::latest('id')->first();
    expect($order->payment_status)->toBe(Order::PAYMENT_UNPAID)
        ->and($order->expires_at)->not->toBeNull()
        ->and($order->expires_at->isAfter(now()->addDay()))->toBeTrue();

    Notification::assertSentTo(User::first(), NewOrderNotification::class);
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `php artisan test --compact --filter=OrderCreationTest`
Expected: FAIL — `expires_at` is null / notification not sent.

- [ ] **Step 4: Set expiry in the controller's `Order::create`**

In `OrderController@store`, add `'payment_status' => Order::PAYMENT_UNPAID,` and `'expires_at' => now()->addDays(2),` to the `Order::create([...])` array (alongside `'status' => Order::STATUS_PENDING`).

- [ ] **Step 5: Send the notification after the transaction**

Add imports at the top of the controller:

```php
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Support\Facades\Notification;
```

After `$order = DB::transaction(...)` returns and before the `return response()->json(...)`, add:

```php
try {
    Notification::send(User::all(), new NewOrderNotification($order));
} catch (\Throwable $e) {
    report($e);
}
```

- [ ] **Step 6: Implement the notification**

```php
// app/Notifications/NewOrderNotification.php
namespace App\Notifications;

use App\Models\Order;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
{
    use Queueable;

    public function __construct(public Order $order) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = rtrim(config('app.url'), '/')."/admin/resources/orders/{$this->order->id}";

        return (new MailMessage)
            ->subject("New order {$this->order->order_number} — payment pending")
            ->greeting('New order received')
            ->line("Order {$this->order->order_number} from {$this->order->full_name} ({$this->order->phone}).")
            ->line("Total: ₦".number_format($this->order->total, 2))
            ->line('Awaiting payment confirmation on WhatsApp. It expires in 2 days if unpaid.')
            ->action('View order', $url);
    }

    /** @return array<string, mixed> */
    public function toDatabase(object $notifiable): array
    {
        return FilamentNotification::make()
            ->title("New order {$this->order->order_number}")
            ->body("{$this->order->full_name} · ₦".number_format($this->order->total, 2).' · awaiting payment')
            ->success()
            ->getDatabaseMessage();
    }
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `php artisan test --compact --filter=OrderCreationTest`
Expected: PASS. Then `vendor/bin/pint --dirty --format agent`.

- [ ] **Step 8: Commit**

```bash
git add apps/api/obidonn-backend/app/Http/Controllers/Api/OrderController.php apps/api/obidonn-backend/app/Notifications/NewOrderNotification.php apps/api/obidonn-backend/tests/Feature/OrderCreationTest.php
git commit -m "feat(api): set 2-day expiry and notify admins on new order"
```

---

## Task 9: Expire-unpaid command (with stock restore)

**Files:**
- Create: `apps/api/obidonn-backend/app/Console/Commands/ExpireUnpaidOrders.php`
- Test: `apps/api/obidonn-backend/tests/Feature/ExpireUnpaidOrdersTest.php`

**Interfaces:**
- Consumes: `Order::restoreStock()`, payment constants from Task 7.
- Produces: artisan command signature `orders:expire-unpaid`.

- [ ] **Step 1: Generate the command**

Run: `cd apps/api/obidonn-backend && php artisan make:command ExpireUnpaidOrders --no-interaction`

- [ ] **Step 2: Write the failing test**

Run: `php artisan make:test --pest ExpireUnpaidOrdersTest`

```php
// tests/Feature/ExpireUnpaidOrdersTest.php
use App\Models\Order;
use App\Models\Product;

it('expires overdue unpaid orders and restores their stock', function () {
    $product = Product::factory()->create(['stock' => 5, 'has_variants' => false]);
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100, 'status' => Order::STATUS_PENDING,
        'payment_status' => Order::PAYMENT_UNPAID, 'expires_at' => now()->subHour(),
    ]);
    $order->items()->create([
        'product_id' => $product->id, 'variant_id' => null, 'product_name' => $product->name,
        'variant_size' => null, 'quantity' => 2, 'unit_price' => 50, 'subtotal' => 100,
    ]);

    $this->artisan('orders:expire-unpaid')->assertSuccessful();

    expect($order->fresh()->payment_status)->toBe(Order::PAYMENT_EXPIRED)
        ->and($product->fresh()->stock)->toBe(7);
});

it('leaves paid and not-yet-due orders alone', function () {
    $paid = Order::create(['full_name' => 'A', 'phone' => '1', 'delivery_address' => 'x', 'subtotal' => 1, 'total' => 1, 'status' => Order::STATUS_CONFIRMED, 'payment_status' => Order::PAYMENT_PAID, 'expires_at' => now()->subDay()]);
    $future = Order::create(['full_name' => 'B', 'phone' => '2', 'delivery_address' => 'y', 'subtotal' => 1, 'total' => 1, 'status' => Order::STATUS_PENDING, 'payment_status' => Order::PAYMENT_UNPAID, 'expires_at' => now()->addDay()]);

    $this->artisan('orders:expire-unpaid')->assertSuccessful();

    expect($paid->fresh()->payment_status)->toBe(Order::PAYMENT_PAID)
        ->and($future->fresh()->payment_status)->toBe(Order::PAYMENT_UNPAID);
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `php artisan test --compact --filter=ExpireUnpaidOrdersTest`
Expected: FAIL — command class is the default stub.

- [ ] **Step 4: Implement the command**

```php
// app/Console/Commands/ExpireUnpaidOrders.php
namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ExpireUnpaidOrders extends Command
{
    protected $signature = 'orders:expire-unpaid';

    protected $description = 'Expire unpaid orders past their hold window and restore reserved stock';

    public function handle(): int
    {
        Order::query()
            ->where('payment_status', Order::PAYMENT_UNPAID)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->with('items')
            ->each(function (Order $order): void {
                DB::transaction(function () use ($order): void {
                    $order->restoreStock();
                    $order->update(['payment_status' => Order::PAYMENT_EXPIRED]);
                });
            });

        return self::SUCCESS;
    }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `php artisan test --compact --filter=ExpireUnpaidOrdersTest`
Expected: PASS (2 tests). Then `vendor/bin/pint --dirty --format agent`.

- [ ] **Step 6: Commit**

```bash
git add apps/api/obidonn-backend/app/Console/Commands/ExpireUnpaidOrders.php apps/api/obidonn-backend/tests/Feature/ExpireUnpaidOrdersTest.php
git commit -m "feat(api): orders:expire-unpaid command restores stock and expires orders"
```

---

## Task 10: Expiry-reminder command + notification

**Files:**
- Create: `apps/api/obidonn-backend/app/Console/Commands/RemindUnpaidOrders.php`
- Create: `apps/api/obidonn-backend/app/Notifications/OrderExpiringSoonNotification.php`
- Test: `apps/api/obidonn-backend/tests/Feature/RemindUnpaidOrdersTest.php`

**Interfaces:**
- Consumes: `Order` payment constants; `reminded_at` column.
- Produces: artisan command `orders:remind-unpaid`; `OrderExpiringSoonNotification` (channels `mail` + `database`).

- [ ] **Step 1: Generate command + notification**

Run:
```bash
cd apps/api/obidonn-backend
php artisan make:command RemindUnpaidOrders --no-interaction
php artisan make:notification OrderExpiringSoonNotification --no-interaction
```

- [ ] **Step 2: Write the failing test**

Run: `php artisan make:test --pest RemindUnpaidOrdersTest`

```php
// tests/Feature/RemindUnpaidOrdersTest.php
use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderExpiringSoonNotification;
use Illuminate\Support\Facades\Notification;

it('reminds once for unpaid orders within 24h of expiry', function () {
    Notification::fake();
    User::factory()->create();
    $order = Order::create([
        'full_name' => 'Ada', 'phone' => '0800', 'delivery_address' => 'Abuja',
        'subtotal' => 100, 'total' => 100, 'status' => Order::STATUS_PENDING,
        'payment_status' => Order::PAYMENT_UNPAID, 'expires_at' => now()->addHours(12),
    ]);

    $this->artisan('orders:remind-unpaid')->assertSuccessful();
    Notification::assertSentTo(User::first(), OrderExpiringSoonNotification::class);
    expect($order->fresh()->reminded_at)->not->toBeNull();

    // second run must not re-send
    Notification::fake();
    $this->artisan('orders:remind-unpaid')->assertSuccessful();
    Notification::assertNothingSent();
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `php artisan test --compact --filter=RemindUnpaidOrdersTest`
Expected: FAIL — default stubs.

- [ ] **Step 4: Implement the notification**

```php
// app/Notifications/OrderExpiringSoonNotification.php
namespace App\Notifications;

use App\Models\Order;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderExpiringSoonNotification extends Notification
{
    use Queueable;

    public function __construct(public Order $order) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = rtrim(config('app.url'), '/')."/admin/resources/orders/{$this->order->id}";

        return (new MailMessage)
            ->subject("Order {$this->order->order_number} expires soon")
            ->greeting('Unpaid order expiring within 24 hours')
            ->line("Order {$this->order->order_number} from {$this->order->full_name} ({$this->order->phone}) is still unpaid.")
            ->line('Confirm payment to keep it, or it will expire and stock will be released.')
            ->action('Review order', $url);
    }

    /** @return array<string, mixed> */
    public function toDatabase(object $notifiable): array
    {
        return FilamentNotification::make()
            ->title("Order {$this->order->order_number} expires soon")
            ->body("{$this->order->full_name} · still unpaid")
            ->warning()
            ->getDatabaseMessage();
    }
}
```

- [ ] **Step 5: Implement the command**

```php
// app/Console/Commands/RemindUnpaidOrders.php
namespace App\Console\Commands;

use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderExpiringSoonNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class RemindUnpaidOrders extends Command
{
    protected $signature = 'orders:remind-unpaid';

    protected $description = 'Remind admins of unpaid orders within 24h of expiry (once each)';

    public function handle(): int
    {
        Order::query()
            ->where('payment_status', Order::PAYMENT_UNPAID)
            ->whereNull('reminded_at')
            ->whereNotNull('expires_at')
            ->where('expires_at', '>', now())
            ->where('expires_at', '<=', now()->addDay())
            ->each(function (Order $order): void {
                try {
                    Notification::send(User::all(), new OrderExpiringSoonNotification($order));
                } catch (\Throwable $e) {
                    report($e);
                }
                $order->update(['reminded_at' => now()]);
            });

        return self::SUCCESS;
    }
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `php artisan test --compact --filter=RemindUnpaidOrdersTest`
Expected: PASS. Then `vendor/bin/pint --dirty --format agent`.

- [ ] **Step 7: Commit**

```bash
git add apps/api/obidonn-backend/app/Console/Commands/RemindUnpaidOrders.php apps/api/obidonn-backend/app/Notifications/OrderExpiringSoonNotification.php apps/api/obidonn-backend/tests/Feature/RemindUnpaidOrdersTest.php
git commit -m "feat(api): orders:remind-unpaid command and expiry reminder notification"
```

---

## Task 11: Schedule the two commands

**Files:**
- Modify: `apps/api/obidonn-backend/routes/console.php`

**Interfaces:**
- Consumes: command signatures from Tasks 9 and 10.

- [ ] **Step 1: Add the schedule entries**

Append to `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('orders:expire-unpaid')->hourly();
Schedule::command('orders:remind-unpaid')->hourly();
```

- [ ] **Step 2: Verify the schedule is registered**

Run: `cd apps/api/obidonn-backend && php artisan schedule:list`
Expected: both `orders:expire-unpaid` and `orders:remind-unpaid` appear, hourly.

- [ ] **Step 3: Commit**

```bash
git add apps/api/obidonn-backend/routes/console.php
git commit -m "feat(api): schedule order expiry and reminder commands hourly"
```

---

## Task 12: Filament OrderResource — payment column, filter, Mark as Paid, hide expired

**Files:**
- Modify: `apps/api/obidonn-backend/app/Filament/Resources/OrderResource.php`

**Interfaces:**
- Consumes: `Order::$paymentStatuses`, `Order::markAsPaid()`, payment constants.

- [ ] **Step 1: Add a payment-status badge column**

In `table()`, add after the `status` SelectColumn:

```php
Tables\Columns\TextColumn::make('payment_status')
    ->label('Payment')
    ->badge()
    ->formatStateUsing(fn (string $state): string => Order::$paymentStatuses[$state] ?? $state)
    ->color(fn (string $state): string => match ($state) {
        'paid' => 'success',
        'unpaid' => 'warning',
        'expired' => 'gray',
        default => 'gray',
    }),
```

- [ ] **Step 2: Replace the status filter with a payment filter that hides expired by default**

Replace the `->filters([...])` array with:

```php
->filters([
    Tables\Filters\SelectFilter::make('status')
        ->options(Order::$statuses),
    Tables\Filters\SelectFilter::make('payment_status')
        ->label('Payment')
        ->options(Order::$paymentStatuses)
        ->placeholder('All (except expired)')
        ->query(function ($query, array $data) {
            if (blank($data['value'])) {
                return $query->where('payment_status', '!=', Order::PAYMENT_EXPIRED);
            }

            return $query->where('payment_status', $data['value']);
        }),
])
```

- [ ] **Step 3: Add the "Mark as Paid" row action**

Replace the `->actions([...])` array with:

```php
->actions([
    Tables\Actions\Action::make('mark_paid')
        ->label('Mark as Paid')
        ->icon('heroicon-o-banknotes')
        ->color('success')
        ->requiresConfirmation()
        ->visible(fn (Order $record): bool => $record->payment_status !== Order::PAYMENT_PAID)
        ->action(fn (Order $record) => $record->markAsPaid()),
    Tables\Actions\ViewAction::make(),
    Tables\Actions\EditAction::make(),
])
```

- [ ] **Step 4: Add a "Mark as Paid" bulk action**

Inside the existing `BulkActionGroup::make([...])` array, add as the first entry:

```php
Tables\Actions\BulkAction::make('mark_paid')
    ->label('Mark as Paid')
    ->icon('heroicon-o-banknotes')
    ->color('success')
    ->action(fn ($records) => $records->each->markAsPaid()),
```

- [ ] **Step 5: Surface payment fields on the view page**

In `infolist()`, add to the `Order Summary` section schema (after `status_label`):

```php
Infolists\Components\TextEntry::make('payment_status_label')->label('Payment')->badge()
    ->color(fn (string $state): string => match ($state) {
        'Paid' => 'success', 'Unpaid' => 'warning', 'Expired' => 'gray', default => 'gray',
    }),
Infolists\Components\TextEntry::make('expires_at')->label('Holds until')->dateTime()->placeholder('—'),
Infolists\Components\TextEntry::make('paid_at')->label('Paid at')->dateTime()->placeholder('—'),
```

Add `use App\Models\Order;` if not already imported (it is, via the existing `protected static ?string $model = Order::class;` import).

- [ ] **Step 6: Verify it loads and run the full backend suite**

Run: `cd apps/api/obidonn-backend && php artisan test --compact`
Expected: all tests pass. Then `vendor/bin/pint --dirty --format agent`.

Manual check: `php artisan serve`, log into `/admin`, open Orders — confirm the Payment column shows, expired orders are hidden until the "Payment → Expired" filter is chosen, and "Mark as Paid" appears on unpaid rows.

- [ ] **Step 7: Commit**

```bash
git add apps/api/obidonn-backend/app/Filament/Resources/OrderResource.php
git commit -m "feat(api): admin payment column, expired-hidden filter, Mark as Paid actions"
```

---

## Task 13: Checkout — WhatsApp handoff + confirmation screen

**Files:**
- Modify: `apps/web/buildsmart-commerce-main/src/pages/Checkout.tsx`
- Test: `apps/web/buildsmart-commerce-main/src/pages/Checkout.test.tsx`

**Interfaces:**
- Consumes: `waLink` from Task 1; existing `submitOrder(form, items)` returning `{ success, orderId? }`; `useCart()`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/Checkout.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Checkout from "./Checkout";

const cartItem = {
  product: { id: 1, name: "Cement", display_price: 5000 },
  variant: null,
  quantity: 2,
  unitPrice: 5000,
};

vi.mock("@/context/CartContext", () => ({
  useCart: () => ({ items: [cartItem], subtotal: 10000, clearCart: vi.fn() }),
}));
vi.mock("@/api/apiClient", () => ({ submitOrder: vi.fn().mockResolvedValue({ success: true, orderId: "ORD-TEST123" }) }));
vi.mock("@/hooks/use-toast", () => ({ toast: vi.fn() }));

describe("Checkout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("opens a prefilled WhatsApp chat with the order details after placing the order", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<MemoryRouter><Checkout /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/john doe/i), { target: { value: "Ada Obi" } });
    fireEvent.change(screen.getByPlaceholderText(/801/i), { target: { value: "08011112222" } });
    fireEvent.change(screen.getByPlaceholderText(/adeola odeku/i), { target: { value: "Jabi, Abuja" } });
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => expect(openSpy).toHaveBeenCalled());
    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain("https://wa.me/2348186927183");
    expect(decodeURIComponent(url)).toContain("ORD-TEST123");
    expect(decodeURIComponent(url)).toContain("Cement");
    openSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/web/buildsmart-commerce-main && npx vitest run src/pages/Checkout.test.tsx`
Expected: FAIL — no `window.open` call.

- [ ] **Step 3: Add WhatsApp handoff + a confirmation screen**

In `Checkout.tsx` add imports:

```tsx
import { waLink, BUSINESS } from "@/config/business";
```

Add `const [placed, setPlaced] = useState<string | null>(null);` next to the other state.

Build the WhatsApp message and open it inside the `if (result.success)` block, replacing the existing `clearCart(); toast(...); navigate("/")` lines with:

```tsx
const lines = items
  .map((it) => `• ${it.product.name}${it.variant ? ` (${it.variant.size})` : ""} ×${it.quantity} — ₦${(it.unitPrice * it.quantity).toLocaleString()}`)
  .join("\n");
const message =
  `Hello DONNS, I'd like to confirm my order *${result.orderId}*.\n\n` +
  `${lines}\n\n*Total:* ₦${subtotal.toLocaleString()}\n\n` +
  `Name: ${form.fullName}\nPhone: ${form.phone}\nAddress: ${form.address}` +
  (form.notes ? `\nNotes: ${form.notes}` : "") +
  `\n\nI'll send my payment receipt here.`;
window.open(waLink(message), "_blank", "noopener,noreferrer");
clearCart();
setPlaced(result.orderId ?? null);
```

Add a confirmation screen near the top of the component's return (before the existing `if (items.length === 0)` early return, so an empty cart after `clearCart()` doesn't bounce to `/cart`):

```tsx
if (placed) {
  return (
    <div className="container mx-auto max-w-xl px-4 py-16 text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-gold" />
      <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">Order received</h1>
      <p className="mt-3 text-muted-foreground">
        Your order <span className="font-semibold text-foreground">{placed}</span> is held for 2 days.
        Finish payment on WhatsApp and send your receipt there — we'll confirm it and your order is locked in.
      </p>
      <a
        href={waLink(`Hello DONNS, this is about my order ${placed}. I'm sending my payment receipt.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
      >
        Open WhatsApp
      </a>
      <button onClick={() => navigate("/")} className="mt-4 block w-full text-sm text-muted-foreground hover:text-gold">
        Back to home
      </button>
    </div>
  );
}
```

(`BUSINESS` import is available for future use; the message uses `waLink`. If lint flags `BUSINESS` as unused, drop it from the import and keep only `waLink`.)

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/pages/Checkout.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verify lint + typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/pages/Checkout.tsx apps/web/buildsmart-commerce-main/src/pages/Checkout.test.tsx
git commit -m "feat(web): WhatsApp order handoff and confirmation screen at checkout"
```

---

## Task 14: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Frontend — lint, typecheck, tests, build**

Run:
```bash
cd apps/web/buildsmart-commerce-main
npm run lint
npx tsc --noEmit
npx vitest run
npm run build
```
Expected: all green; build emits `dist/`.

- [ ] **Step 2: Backend — full Pest suite + formatting**

Run:
```bash
cd apps/api/obidonn-backend
php artisan test --compact
vendor/bin/pint --dirty --format agent
```
Expected: all tests pass; Pint reports clean.

- [ ] **Step 3: Manual smoke (documented for the operator)**

- Start both apps (`npm run dev` at repo root).
- Add a product to the cart → Checkout → Place Order → confirm a WhatsApp tab opens to `2348186927183` prefilled with the order number + items, and the confirmation screen shows.
- In `/admin` → Orders: the new order is `Unpaid`, holds-until is ~2 days out; click **Mark as Paid** → it becomes `Paid` + `Confirmed`.
- Contact page: both addresses listed, map pins Eda Plaza Jabi, Instagram link works, Book/Send via WhatsApp opens the right number.
- Architectural page shows 4 real photos; Interior page shows the new 10-image portfolio.

- [ ] **Step 4: Commit any formatting-only changes**

```bash
git add -A
git commit -m "chore: formatting and verification pass" || echo "nothing to commit"
```

---

## Notes for the operator (post-merge)

- **Scheduler must run** for expiry + reminders: in dev `php artisan schedule:work`; in prod add a cron entry running `php artisan schedule:run` every minute.
- **Email:** add Gmail SMTP `MAIL_*` (App Password) to the backend `.env` as documented in the design spec, and set the admin Filament user's email to `donnsproperties@gmail.com`. Until SMTP is set, the Filament bell still delivers in-panel; mail falls back to the `log` driver in local.
- The notifications are sent to all `User` records (Filament panel admins), which drives both the email recipients and the in-panel bell.
```
