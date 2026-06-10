# DONNS — Premium Rebuild Design

**Date:** 2026-05-31
**Status:** Approved for planning
**Repo:** OBIDONN monorepo — `apps/web/buildsmart-commerce-main` (React/Vite frontend), `apps/api/obidonn-backend` (Laravel 12 + Filament 3)

## 1. Goal & Vision

Rebuild the existing "BuildMart / Obidonn Hardwares" e-commerce frontend into **DONNS** — a premium, "$10k-feel" brand that sells building/hardware materials **and** offers two design services (Architectural Consultation, Interior Design). The experience should feel cinematic and editorial: black + gold luxury on the landing and service pages, a clean cream "light luxury" shop, high-craft GSAP animation, and the two brand videos used as cinematic centerpieces.

Brand identity is taken from `assets/Donn.jpeg`: black + luxury gold + white, wordmark **DONNS**, tagline **DESIGN. SUPPLY. BUILD.**

### Success criteria
- Cohesive black/gold/cream visual system applied to **every** page, including the e-commerce flow.
- New `Services ▾` nav dropdown → two fully-designed service pages.
- Architectural page: `For architectural.mp4` hero; `arch.jpeg` and `Pin.jpg` as premium imagery; lead-gen booking form.
- Interior page: `decor.mp4` as a **scroll-scrubbed, reversible, muted** cinematic pinned hero, then standard sections; `pin2.jpg` as a showcase image; lead-gen booking form.
- Booking submissions persist to the Laravel backend and are manageable in Filament admin.
- Premium GSAP motion throughout, fully degrading under `prefers-reduced-motion` and on mobile.

## 2. Decisions (locked during brainstorming)

| Topic | Decision |
|---|---|
| Brand name | **DONNS** (logo image from `Donn.jpeg`); tagline "Design. Supply. Build." |
| Theme | **Dark hero / light shop** — dark luxury for landing + services + footer; cream light-luxury for shop/checkout |
| Services purpose | **Lead generation** — portfolio/showcase + "Book a consultation / request a quote" form (no service checkout) |
| Architectural hero | `For architectural.mp4`, autoplay + muted + loop, `arch.jpeg` as poster/fallback |
| Interior hero | **Cinematic pinned scroll-scrub** of `decor.mp4` for the first ~2–3 screens, then release into normal sections (Option B) |
| Typography | Display: **Cormorant Garamond** (600 weight, large sizes, gold italic accents). Body: **Inter** |
| Homepage hero | **Striking still + animated text** (parallax + GSAP split-text), not video |
| Bookings backend | **New Laravel endpoint + DB table + Filament resource** |
| Content | **Premium placeholder copy** + provided images; clearly-marked slots for real content later |
| Animation | **Full premium**: GSAP ScrollTrigger, pinned scenes, parallax, scrub video, magnetic buttons, counters, split-text reveals, Lenis smooth scroll — all respecting reduced-motion |
| Animation stack | **GSAP-first** (GSAP + ScrollTrigger + SplitText + Lenis); keep `framer-motion` for small UI only |

## 3. Visual System

### Color tokens (HSL CSS variables in `src/index.css`, exposed via Tailwind)
- `--ink` `#0B0B0D`, `--charcoal` `#15141A` — dark surfaces
- `--cream` `#F7F3EC`, `--ivory` `#FBF8F1` — light surfaces
- `--gold` `#CBA135`, `--gold-light` `#E7CC7B` — accent + button gradient
- Text: `#ECE6D8` (on dark), `#1A1813` (on light), muted variants
- Gold is an **accent only** — hairline rules, eyebrows, underlines, button gradient, numerals. Never large gold fills.

### Theming mechanism
Two surface modes driven by a wrapper class (`theme-dark` / default light) rather than the existing global `.dark`. Section- and page-level theming so a dark landing and a light shop can coexist. Shared components read semantic tokens (`--surface`, `--surface-foreground`, `--accent`) so they adapt automatically.

### Typography
- Import Cormorant Garamond (500/600/700, incl. italic) + Inter via Google Fonts.
- `--font-heading: 'Cormorant Garamond'`, `--font-body: 'Inter'`.
- Headings large and airy; gold italic for emphasized words. Eyebrows are Inter, uppercase, wide letter-spacing.

### Shared primitives (new/updated components)
- `GoldButton` (gradient) and `GhostButton` (outline)
- `Eyebrow` label, `Hairline` divider
- `GlassCard` (dark translucent), `StatCounter` (animated number)
- `SectionReveal` wrapper (GSAP scroll-in)
- `Logo` (renders `Donn.jpeg` mark + DONNS wordmark)

## 4. Information Architecture & Routing

Navbar: `Home · Shop · Services ▾ · About · Contact` + cart icon.
- `Services ▾` dropdown (keyboard accessible, Radix `navigation-menu` or `dropdown-menu`): **Architectural Consultation**, **Interior Design**.
- Navbar is transparent over dark heroes and transitions to solid charcoal on scroll; on light pages it is solid from the top.

Routes (`src/routes/AppRouter.tsx`):
- `/` — Home (rebuilt, dark)
- `/products` — Shop (restyled, light) — nav labels it "Shop"
- `/products/:id` — Product details (restyled, light)
- `/cart`, `/checkout` — (restyled, light)
- `/about`, `/contact` — (restyled; About may be dark editorial, Contact light)
- **`/services/architectural`** — new
- **`/services/interior`** — new
- `*` — NotFound (restyled)

## 5. Page Designs

### 5.1 Homepage (dark, immersive)
1. **Hero** — striking still (dome render or logo-lit black), GSAP split-text headline reveal, parallax background, gold eyebrow "Design · Supply · Build", primary CTA "Shop Materials" + secondary "Our Services".
2. **Services teaser** — two large tiles (Architectural / Interior) with hover motion, linking to the service pages.
3. **Shop by category** — category grid (existing data), restyled.
4. **Featured products** — featured grid (existing data), restyled dark cards.
5. **Design · Supply · Build** brand-story band — three pillars with animated `StatCounter`s.
6. **Testimonials** — placeholder quotes, subtle carousel/reveal.
7. **Footer CTA** + footer (dark, gold accents, logo, nav, contact).

All sections use `SectionReveal`.

### 5.2 Architectural Consultation (`/services/architectural`, dark)
Validated mockup. Top-to-bottom:
1. **Video hero** — `For architectural.mp4` (autoplay/muted/loop, `arch.jpeg` poster), gold eyebrow "Architectural Consultation", Cormorant headline, "Book a Consultation" + "View Portfolio".
2. **Stats strip** — animated counters (Years / Projects / Awards).
3. **Split section** — `Pin.jpg` floor-plan render beside "Concept to blueprint" service list. `arch.jpeg` reused as a standalone full-bleed premium image elsewhere on the page.
4. **Process** — 01 Consult / 02 Concept / 03 Construct.
5. **Portfolio grid** — placeholder projects (image tiles).
6. **Booking form** — Name, Email, Project type, Message → `POST /api/consultations` (`service_type: architectural`).

### 5.3 Interior Design (`/services/interior`, dark → sections)
1. **Pinned cinematic scrub hero** — `decor.mp4`, muted, scrubbed by scroll (forward on scroll-down, reverse on scroll-up). Pinned for ~2–3 viewport heights; text captions cross-fade across the scrub. Then unpins.
   - **Desktop:** real `<video>` with `currentTime` driven by GSAP ScrollTrigger `scrub`.
   - **Mobile / reduced-motion:** canvas frame-sequence fallback (pre-extracted JPEG frames from `decor.mp4`); if too heavy, static poster + fade. (Frame extraction is a build step.)
2. **Décor services** — glass cards over a dark section: space planning, custom furniture, lighting, materials, project management.
3. **`pin2.jpg` showcase** — full-bleed featured project with caption.
4. **Booking form** — same component as architectural (`service_type: interior`).

### 5.4 E-commerce restyle (light luxury)
Re-skin only (no logic/data changes): Shop (`Products`), `ProductDetails`, `Cart`, `Checkout`, `About`, `Contact`, `ProductCard`, `CategoryCard`, `FilterSidebar`, `SearchBar`, `Footer`, `NotFound`. Cream/ivory surfaces, black text, gold accents, Cormorant headings. Cart context, React Query hooks, Axios client, and the `USE_MOCK` toggle remain untouched.

## 6. Animation System

- **Libraries:** `gsap` (+ `ScrollTrigger`, `SplitText`), `lenis` (smooth scroll). `framer-motion` retained for the mobile menu and dropdown only.
- **Patterns:** split-text headline reveals; section fade/slide-in on scroll; parallax on hero media; pinned scroll-scrub video (interior); magnetic primary buttons; animated stat counters; nav background transition on scroll.
- **Structure:** a small `src/lib/animation/` module — `useGsapContext` hook (cleanup-safe), `useScrollScrubVideo` hook (desktop video + mobile canvas-frame strategy), Lenis provider mounted once in `App.tsx`.
- **Reduced motion:** a single guard disables Lenis, scrub, parallax, and split-text → content renders static with simple fades. Honor `matchMedia('(prefers-reduced-motion: reduce)')`.

## 7. Backend — Consultation Bookings

- **Migration:** `consultation_bookings` (`id`, `name`, `email`, `phone?`, `service_type` enum[architectural, interior], `project_type?`, `message`, `status` default `new`, timestamps).
- **Model:** `ConsultationBooking` (fillable, casts).
- **Form Request:** `StoreConsultationBookingRequest` (validation; never inline in controller).
- **Controller + route:** `POST /api/consultations` → stores → returns `201` with resource. CSRF already exempt for `/api/*`.
- **Filament:** `ConsultationBookingResource` (list/view, filter by `service_type`/`status`, mark handled).
- **Tests:** Pest feature test for the endpoint (valid create, validation failure).
- **Conventions:** `php artisan make:` generators; `vendor/bin/pint --dirty` after changes.

## 8. Performance & Accessibility

- Lazy-load videos and below-the-fold imagery; `preload="metadata"` on hero video; font `preconnect`.
- Provide poster images so heroes paint instantly.
- Keyboard-accessible Services dropdown (focus states, Esc to close); alt text on all imagery; sufficient contrast for gold-on-dark text (use gold for accents/large text, not small body copy).
- `prefers-reduced-motion` fully supported.
- Target: desktop Lighthouse performance ≥ 85; no layout shift from font swap (size-adjust / font-display swap).

## 9. Dependencies to add

- Frontend: `gsap`, `lenis`. (SplitText ships with GSAP and is free.)
- No new backend packages (Laravel + Filament already present).

## 10. Out of Scope (YAGNI)

- No CMS/admin for portfolio projects (placeholder content with marked slots).
- No payment/checkout for services.
- No i18n, no blog, no auth changes.
- No changes to product/order data models or the cart/checkout logic.

## 11. Risks & Mitigations

- **Mobile video scrub** is unreliable → canvas frame-sequence fallback; if frame payload is too large, degrade to poster + fade.
- **Cormorant at small sizes** can feel thin → restrict Cormorant to display sizes; Inter for everything ≤ ~18px.
- **Two animation libraries** increase bundle → tree-shake, lazy-load GSAP plugins, keep framer-motion usage minimal; revisit removing it if bundle is a concern.
- **Gold legibility** → enforce accent-only usage via tokens and review contrast.
- **Asset weight** (videos/images) → compress, lazy-load, serve posters.

## 12. Asset inventory

| File | Use |
|---|---|
| `assets/Donn.jpeg` | Logo mark + brand colors |
| `assets/For architectural.mp4` | Architectural page hero video |
| `assets/arch.jpeg` | Architectural hero poster + premium imagery |
| `assets/Pin.jpg` | Architectural floor-plan section image |
| `assets/decor.mp4` | Interior pinned scroll-scrub hero (muted) |
| `assets/pin2.jpg` | Interior featured-project showcase image |

Assets will be moved/copied into the frontend (`src/assets/` or `public/`) as part of implementation; videos likely in `public/` for direct streaming.
