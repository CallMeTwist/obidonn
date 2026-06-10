# DONNS Premium Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the OBIDONN frontend into the premium **DONNS** brand — black/gold dark landing + services, cream "light luxury" shop, two new design-service pages (architectural video hero, interior scroll-scrubbed `decor.mp4`), GSAP motion throughout, and a Laravel bookings backend manageable in Filament.

**Architecture:** Frontend (React 18 + Vite + Tailwind + shadcn) gets a new two-mode design-token system (`.theme-dark` wrapper over a cream default), a small GSAP/Lenis animation layer, shared luxury primitives, a `Services ▾` nav dropdown, and two new routed pages. Backend adds a `consultation_bookings` table + API endpoint + Filament resource. Booking forms POST to that endpoint. Existing product/cart/order logic is untouched — only restyled.

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind 3.4, shadcn/ui, react-hook-form + zod, GSAP + ScrollTrigger, Lenis, framer-motion (retained for small UI), Vitest + Testing Library; Laravel 12, Filament 3, Pest 4.

**Spec:** `docs/superpowers/specs/2026-05-31-donns-premium-rebuild-design.md`

**Conventions:**
- Frontend paths are relative to `apps/web/buildsmart-commerce-main/`. Run frontend commands from that directory.
- Backend paths are relative to `apps/api/obidonn-backend/`. After any PHP change run `vendor/bin/pint --dirty --format agent`.
- Frontend tests: `npm run test`. Backend tests: `php artisan test --compact`.
- This repo is **not** a git repo yet. **Task 1 initializes git.** All later "Commit" steps assume git exists.
- "Build + visual verify" steps: run `npm run dev`, open the page, confirm the described result. Pure-styling tasks use this instead of unit tests.

---

## Phase 0 — Foundation: git, deps, assets, tokens, animation layer

### Task 1: Initialize git & ignore artifacts

**Files:**
- Create: `.gitignore` (repo root)

- [ ] **Step 1: Create root `.gitignore`**

```gitignore
# dependencies
node_modules/
vendor/

# build output
dist/
apps/api/obidonn-backend/public/build/

# env
.env
*.local

# brainstorm companion + os
.superpowers/
.DS_Store
Thumbs.db
```

- [ ] **Step 2: Initialize and make the baseline commit**

```bash
git init
git add .
git commit -m "chore: baseline before DONNS premium rebuild"
```

Expected: repo created, baseline commit succeeds.

---

### Task 2: Move brand assets into the frontend

The source assets live in the repo-root `assets/` folder. Videos go to `public/` (streamable by URL); images go to `src/assets/` (imported/bundled). Run from `apps/web/buildsmart-commerce-main/`.

**Files:**
- Create: `public/media/for-architectural.mp4`, `public/media/decor.mp4`
- Create: `src/assets/brand/logo-donns.jpeg`, `src/assets/brand/arch.jpeg`, `src/assets/brand/pin.jpg`, `src/assets/brand/pin2.jpg`

- [ ] **Step 1: Copy assets (PowerShell, from repo root)**

```powershell
$web = "apps/web/buildsmart-commerce-main"
New-Item -ItemType Directory -Force "$web/public/media" | Out-Null
New-Item -ItemType Directory -Force "$web/src/assets/brand" | Out-Null
Copy-Item "assets/For architectural.mp4" "$web/public/media/for-architectural.mp4"
Copy-Item "assets/decor.mp4"             "$web/public/media/decor.mp4"
Copy-Item "assets/Donn.jpeg"             "$web/src/assets/brand/logo-donns.jpeg"
Copy-Item "assets/arch.jpeg"             "$web/src/assets/brand/arch.jpeg"
Copy-Item "assets/Pin.jpg"               "$web/src/assets/brand/pin.jpg"
Copy-Item "assets/pin2.jpg"              "$web/src/assets/brand/pin2.jpg"
```

- [ ] **Step 2: Verify**

```bash
ls apps/web/buildsmart-commerce-main/public/media
ls apps/web/buildsmart-commerce-main/src/assets/brand
```

Expected: both video files in `public/media`; four images in `src/assets/brand`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/public apps/web/buildsmart-commerce-main/src/assets
git commit -m "chore: add DONNS brand assets to frontend"
```

---

### Task 3: Install GSAP + Lenis

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install (from `apps/web/buildsmart-commerce-main/`)**

```bash
npm install gsap@^3.13.0 lenis@^1.1.18
```

- [ ] **Step 2: Verify they resolve**

```bash
node -e "require.resolve('gsap'); require.resolve('lenis'); console.log('ok')"
```

Expected: prints `ok`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/package.json apps/web/buildsmart-commerce-main/package-lock.json
git commit -m "feat: add gsap and lenis dependencies"
```

---

### Task 4: Rework design tokens (cream default + `.theme-dark`) and fonts

**Files:**
- Modify: `src/index.css` (full replace of token + font sections)
- Modify: `tailwind.config.ts` (add `gold` colors + keyframes)

- [ ] **Step 1: Replace `src/index.css` with the new token system**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@300;400;500;600;700;800&display=swap');

@layer base {
  /* LIGHT LUXURY — default (shop, checkout, contact) */
  :root {
    --background: 40 33% 96%;        /* cream #F7F3EC */
    --foreground: 40 11% 9%;         /* ink  #1A1813 */

    --card: 0 0% 100%;
    --card-foreground: 40 11% 9%;

    --popover: 0 0% 100%;
    --popover-foreground: 40 11% 9%;

    --primary: 40 11% 9%;            /* ink buttons */
    --primary-foreground: 40 33% 96%;

    --secondary: 40 14% 90%;
    --secondary-foreground: 40 11% 9%;

    --muted: 40 14% 92%;
    --muted-foreground: 40 6% 40%;

    --accent: 43 57% 50%;            /* gold #CBA135 */
    --accent-foreground: 40 11% 9%;

    --destructive: 0 72% 45%;
    --destructive-foreground: 0 0% 100%;

    --border: 40 14% 86%;
    --input: 40 14% 86%;
    --ring: 43 57% 50%;

    --radius: 0.5rem;

    --gold: 43 57% 50%;              /* #CBA135 */
    --gold-light: 44 68% 70%;        /* #E7CC7B */

    --font-heading: 'Cormorant Garamond', serif;
    --font-body: 'Inter', sans-serif;

    --gradient-gold: linear-gradient(135deg, hsl(var(--gold-light)), hsl(var(--gold)));
    --shadow-card: 0 2px 14px hsl(40 11% 9% / 0.06);
    --shadow-card-hover: 0 14px 40px hsl(40 11% 9% / 0.12);
  }

  /* DARK LUXURY — landing, services, footer (apply class on a wrapper) */
  .theme-dark {
    --background: 240 7% 5%;         /* #0B0B0D */
    --foreground: 43 25% 89%;        /* #ECE6D8 */

    --card: 252 9% 9%;               /* #15141A */
    --card-foreground: 43 25% 89%;

    --popover: 252 9% 9%;
    --popover-foreground: 43 25% 89%;

    --primary: 43 57% 50%;           /* gold primary on dark */
    --primary-foreground: 40 11% 9%;

    --secondary: 252 8% 16%;
    --secondary-foreground: 43 25% 89%;

    --muted: 252 8% 14%;
    --muted-foreground: 40 6% 62%;

    --accent: 43 57% 50%;
    --accent-foreground: 40 11% 9%;

    --border: 252 9% 16%;
    --input: 252 9% 16%;
    --ring: 43 57% 50%;
  }
}

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }
  h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
}

@layer components {
  .btn-gold {
    background: var(--gradient-gold);
    color: hsl(40 11% 9%);
  }
  .card-shadow { box-shadow: var(--shadow-card); }
  .card-shadow-hover { box-shadow: var(--shadow-card-hover); }
}

@layer utilities {
  .gradient-gold { background: var(--gradient-gold); }
  .eyebrow {
    font-family: var(--font-body);
    text-transform: uppercase;
    letter-spacing: 0.28em;
    font-size: 0.7rem;
    font-weight: 600;
    color: hsl(var(--gold));
  }
  .text-gold { color: hsl(var(--gold)); }
  .text-gold-light { color: hsl(var(--gold-light)); }
}
```

- [ ] **Step 2: Add `gold` colors + reveal keyframes to `tailwind.config.ts`**

In `theme.extend.colors`, after the `card` block (before `sidebar`), add:

```ts
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
        },
```

Change `fontFamily` to:

```ts
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
```

In `theme.extend.keyframes`, add alongside `fade-in`:

```ts
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
```

In `theme.extend.animation`, add:

```ts
        "reveal-up": "reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
```

- [ ] **Step 3: Build + visual verify**

Run: `npm run dev`, open `http://localhost:5173`. Expected: the site still renders (unstyled-for-new-brand but no errors); headings now render in a serif (Cormorant); the cream background is visible. (Pages look "off-brand" until later tasks — that's fine.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/index.css apps/web/buildsmart-commerce-main/tailwind.config.ts
git commit -m "feat: DONNS design tokens (cream default + theme-dark) and Cormorant/Inter fonts"
```

---

### Task 5: Reduced-motion hook

**Files:**
- Create: `src/lib/animation/useReducedMotion.ts`
- Test: `src/lib/animation/useReducedMotion.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useReducedMotion } from "./useReducedMotion";

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("useReducedMotion", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("returns true when the user prefers reduced motion", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("returns false when motion is allowed", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- useReducedMotion`
Expected: FAIL — cannot find module `./useReducedMotion`.

- [ ] **Step 3: Implement the hook**

```ts
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(QUERY).matches
      : false,
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- useReducedMotion`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/lib/animation/useReducedMotion.ts apps/web/buildsmart-commerce-main/src/lib/animation/useReducedMotion.test.ts
git commit -m "feat: useReducedMotion hook"
```

---

### Task 6: GSAP setup + Lenis smooth-scroll provider

**Files:**
- Create: `src/lib/animation/gsap.ts` (central GSAP + ScrollTrigger registration)
- Create: `src/lib/animation/SmoothScrollProvider.tsx`
- Modify: `src/App.tsx` (wrap app in `SmoothScrollProvider`)

- [ ] **Step 1: Central GSAP registration**

```ts
// src/lib/animation/gsap.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Smooth-scroll provider (Lenis ↔ ScrollTrigger), reduced-motion aware**

```tsx
// src/lib/animation/SmoothScrollProvider.tsx
import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // native scrolling, no smoothing

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
```

- [ ] **Step 3: Wrap the app**

In `src/App.tsx`, import the provider and wrap the `<div className="flex min-h-screen flex-col">…</div>` tree inside `<BrowserRouter>`:

```tsx
import { SmoothScrollProvider } from "@/lib/animation/SmoothScrollProvider";
```

Change the `BrowserRouter` body from:

```tsx
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
```

to:

```tsx
        <BrowserRouter>
          <SmoothScrollProvider>
          <div className="flex min-h-screen flex-col">
```

and close it after `</Footer>`'s wrapping div:

```tsx
          </div>
          </SmoothScrollProvider>
        </BrowserRouter>
```

- [ ] **Step 4: Build + visual verify**

Run: `npm run dev`. Expected: page scrolls with smooth inertia (desktop). No console errors. With OS "reduce motion" on, scrolling is native (no smoothing).

- [ ] **Step 5: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/lib/animation apps/web/buildsmart-commerce-main/src/App.tsx
git commit -m "feat: gsap registration + Lenis smooth-scroll provider"
```

---

### Task 7: `Reveal` and `SplitReveal` animation components

`SplitReveal` splits a heading into word spans and animates them in on scroll. No SplitText plugin needed (license-free). `Reveal` fades/slides any block in on scroll.

**Files:**
- Create: `src/components/motion/Reveal.tsx`
- Create: `src/components/motion/SplitReveal.tsx`

- [ ] **Step 1: `Reveal` component**

```tsx
// src/components/motion/Reveal.tsx
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";

export function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, y, delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: `SplitReveal` component**

```tsx
// src/components/motion/SplitReveal.tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";

/**
 * Renders `text` as a heading with each word animating up on scroll-in.
 * `as` chooses the tag; `className` styles the wrapper.
 */
export function SplitReveal({
  text,
  className,
  as: Tag = "h2",
  stagger = 0.08,
}: {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLElement>("[data-word]");
    if (reduced) {
      gsap.set(spans, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { opacity: 0, y: "0.6em" },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, stagger]);

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
          <span data-word style={{ display: "inline-block", opacity: 0 }}>
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
```

- [ ] **Step 3: Build + visual verify**

These are used in later tasks; for now just confirm they compile: run `npm run build`. Expected: build succeeds with no type errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/motion
git commit -m "feat: Reveal and SplitReveal scroll-in animation components"
```

---

## Phase 1 — Shared primitives, navbar (Services dropdown), footer, routing

### Task 8: Luxury primitives — `GoldButton`, `Eyebrow`, `Hairline`, `StatCounter`

**Files:**
- Create: `src/components/brand/GoldButton.tsx`
- Create: `src/components/brand/Eyebrow.tsx`
- Create: `src/components/brand/Hairline.tsx`
- Create: `src/components/brand/StatCounter.tsx`
- Test: `src/components/brand/StatCounter.test.tsx`

- [ ] **Step 1: `GoldButton` (wraps shadcn Button as gold gradient)**

```tsx
// src/components/brand/GoldButton.tsx
import { forwardRef } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const GoldButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "btn-gold border-0 font-semibold tracking-wide hover:brightness-110 hover:shadow-[0_8px_30px_hsl(43_57%_50%/0.35)]",
        className,
      )}
      {...props}
    />
  ),
);
GoldButton.displayName = "GoldButton";
```

- [ ] **Step 2: `Eyebrow`**

```tsx
// src/components/brand/Eyebrow.tsx
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}
```

- [ ] **Step 3: `Hairline`**

```tsx
// src/components/brand/Hairline.tsx
import { cn } from "@/lib/utils";

export function Hairline({ className }: { className?: string }) {
  return <span className={cn("block h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent", className)} />;
}
```

- [ ] **Step 4: Write the failing test for `StatCounter`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatCounter } from "./StatCounter";

vi.mock("@/lib/animation/useReducedMotion", () => ({ useReducedMotion: () => true }));

describe("StatCounter", () => {
  it("renders the final value immediately under reduced motion", () => {
    render(<StatCounter value={240} suffix="+" label="Projects" />);
    expect(screen.getByText("240+")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm run test -- StatCounter`
Expected: FAIL — cannot find module `./StatCounter`.

- [ ] **Step 6: Implement `StatCounter`**

```tsx
// src/components/brand/StatCounter.tsx
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";

export function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useLayoutEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => setDisplay(Math.round(obj.n)),
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl font-semibold text-gold-light md:text-5xl">
        {display}
        {suffix}
      </div>
      <div className="eyebrow mt-2 text-muted-foreground">{label}</div>
    </div>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm run test -- StatCounter`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/brand
git commit -m "feat: luxury primitives (GoldButton, Eyebrow, Hairline, StatCounter)"
```

---

### Task 9: `Logo` component

**Files:**
- Create: `src/components/brand/Logo.tsx`

- [ ] **Step 1: Implement `Logo`**

```tsx
// src/components/brand/Logo.tsx
import { Link } from "react-router-dom";
import logo from "@/assets/brand/logo-donns.jpeg";
import { cn } from "@/lib/utils";

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-3", className)}>
      <img
        src={logo}
        alt="DONNS"
        className="h-9 w-9 rounded-md object-cover ring-1 ring-gold/40"
      />
      {showWordmark && (
        <span className="font-heading text-2xl font-semibold tracking-[0.22em] leading-none">
          DON<span className="text-gold">N</span>S
        </span>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/brand/Logo.tsx
git commit -m "feat: DONNS Logo component"
```

---

### Task 10: Navbar with Services dropdown + scroll-aware background

**Files:**
- Modify: `src/components/layout/Navbar.tsx` (full replace)
- Test: `src/components/layout/Navbar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";

vi.mock("@/context/CartContext", () => ({ useCart: () => ({ totalItems: 0 }) }));

function renderNav() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );
}

describe("Navbar", () => {
  it("shows the primary links including Services", () => {
    renderNav();
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
  });

  it("reveals the two service links when Services is opened", () => {
    renderNav();
    fireEvent.click(screen.getByRole("button", { name: /services/i }));
    expect(screen.getByText("Architectural Consultation")).toBeInTheDocument();
    expect(screen.getByText("Interior Design")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- Navbar`
Expected: FAIL — "Services" / service links not found (current navbar has none).

- [ ] **Step 3: Replace `src/components/layout/Navbar.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const services = [
  { to: "/services/architectural", label: "Architectural Consultation" },
  { to: "/services/interior", label: "Interior Design" },
];

const primary = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number>();
  const { totalItems } = useCart();
  const location = useLocation();

  // Routes whose top section is a full-bleed dark hero — only there is a
  // transparent bar legible. Everywhere else the bar is solid from the top.
  const darkHeroRoutes = ["/", "/services/architectural", "/services/interior"];
  const overDarkHero = darkHeroRoutes.includes(location.pathname);
  const solid = scrolled || !overDarkHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  const openServices = () => {
    window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <nav
      className={cn(
        "theme-dark sticky top-0 z-50 transition-colors duration-300",
        solid ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4 text-foreground">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {primary.slice(0, 2).map((link) => (
            <NavItem key={link.to} {...link} active={location.pathname === link.to} />
          ))}

          <div className="relative" onMouseEnter={openServices} onMouseLeave={scheduleClose}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-gold"
            >
              Services <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {servicesOpen && (
              <div
                className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-2xl"
                onMouseEnter={openServices}
                onMouseLeave={scheduleClose}
              >
                {services.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className="block rounded-lg px-4 py-3 text-sm text-card-foreground/85 transition-colors hover:bg-secondary hover:text-gold"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {primary.slice(2).map((link) => (
            <NavItem key={link.to} {...link} active={location.pathname === link.to} />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-foreground transition-colors hover:text-gold">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full btn-gold text-[10px] font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-foreground md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="theme-dark border-t border-border bg-background px-4 pb-4 text-foreground md:hidden">
          {[primary[0], primary[1]].map((l) => (
            <MobileLink key={l.to} {...l} />
          ))}
          <p className="px-1 pt-4 eyebrow text-muted-foreground">Services</p>
          {services.map((s) => (
            <MobileLink key={s.to} {...s} indent />
          ))}
          {[primary[2], primary[3]].map((l) => (
            <MobileLink key={l.to} {...l} />
          ))}
        </div>
      )}
    </nav>
  );
};

function NavItem({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-gold",
        active ? "text-gold" : "text-foreground/80",
      )}
    >
      {label}
    </Link>
  );
}

function MobileLink({ to, label, indent }: { to: string; label: string; indent?: boolean }) {
  return (
    <Link to={to} className={cn("block py-3 text-sm font-medium text-foreground/85 hover:text-gold", indent && "pl-4")}>
      {label}
    </Link>
  );
}

export default Navbar;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- Navbar`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/layout/Navbar.tsx apps/web/buildsmart-commerce-main/src/components/layout/Navbar.test.tsx
git commit -m "feat: DONNS navbar with Services dropdown and scroll-aware background"
```

---

### Task 11: Restyle Footer (dark, gold accents, DONNS)

**Files:**
- Modify: `src/components/layout/Footer.tsx` (full replace)

- [ ] **Step 1: Replace `src/components/layout/Footer.tsx`**

```tsx
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Hairline } from "@/components/brand/Hairline";

const Footer = () => (
  <footer className="theme-dark bg-background text-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Design. Supply. Build. Premium building materials and bespoke architectural &amp; interior design — end to end.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-foreground">Explore</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/products" className="transition-colors hover:text-gold">Shop</Link>
            <Link to="/about" className="transition-colors hover:text-gold">About</Link>
            <Link to="/contact" className="transition-colors hover:text-gold">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-foreground">Services</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/services/architectural" className="transition-colors hover:text-gold">Architectural Consultation</Link>
            <Link to="/services/interior" className="transition-colors hover:text-gold">Interior Design</Link>
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-foreground">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +234 800 000 0000</span>
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@donns.com</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Lagos, Nigeria</span>
          </div>
        </div>
      </div>

      <Hairline className="mt-12" />
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} DONNS. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
```

- [ ] **Step 2: Build + visual verify**

Run: `npm run dev`. Expected: footer is dark with gold accents, DONNS logo, Services links present.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/layout/Footer.tsx
git commit -m "feat: restyle footer to DONNS dark/gold"
```

---

### Task 12: Add service routes (placeholder pages) to the router

This wires routing first; real page content arrives in Phases 3–4. Placeholders prevent broken links from the navbar/footer.

**Files:**
- Create: `src/pages/services/Architectural.tsx` (placeholder)
- Create: `src/pages/services/Interior.tsx` (placeholder)
- Modify: `src/routes/AppRouter.tsx`
- Test: `src/routes/AppRouter.test.tsx`

- [ ] **Step 1: Create placeholder pages**

```tsx
// src/pages/services/Architectural.tsx
const Architectural = () => (
  <div className="theme-dark bg-background py-32 text-center text-foreground">
    <h1 className="font-heading text-4xl">Architectural Consultation</h1>
  </div>
);
export default Architectural;
```

```tsx
// src/pages/services/Interior.tsx
const Interior = () => (
  <div className="theme-dark bg-background py-32 text-center text-foreground">
    <h1 className="font-heading text-4xl">Interior Design</h1>
  </div>
);
export default Interior;
```

- [ ] **Step 2: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import AppRouter from "./AppRouter";

vi.mock("@/pages/Home", () => ({ default: () => <div>home</div> }));
vi.mock("@/pages/Products", () => ({ default: () => <div>products</div> }));
vi.mock("@/pages/ProductDetails", () => ({ default: () => <div>details</div> }));
vi.mock("@/pages/Cart", () => ({ default: () => <div>cart</div> }));
vi.mock("@/pages/Checkout", () => ({ default: () => <div>checkout</div> }));
vi.mock("@/pages/About", () => ({ default: () => <div>about</div> }));
vi.mock("@/pages/Contact", () => ({ default: () => <div>contact</div> }));
vi.mock("@/pages/NotFound", () => ({ default: () => <div>notfound</div> }));

describe("AppRouter", () => {
  it("renders the architectural service page at /services/architectural", () => {
    render(
      <MemoryRouter initialEntries={["/services/architectural"]}>
        <AppRouter />
      </MemoryRouter>,
    );
    expect(screen.getByText("Architectural Consultation")).toBeInTheDocument();
  });

  it("renders the interior service page at /services/interior", () => {
    render(
      <MemoryRouter initialEntries={["/services/interior"]}>
        <AppRouter />
      </MemoryRouter>,
    );
    expect(screen.getByText("Interior Design")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- AppRouter`
Expected: FAIL — service routes not defined.

- [ ] **Step 4: Add routes to `src/routes/AppRouter.tsx`**

Add imports:

```tsx
import Architectural from "@/pages/services/Architectural";
import Interior from "@/pages/services/Interior";
```

Add routes inside `<Routes>` (before the `*` route):

```tsx
    <Route path="/services/architectural" element={<Architectural />} />
    <Route path="/services/interior" element={<Interior />} />
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- AppRouter`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/pages/services apps/web/buildsmart-commerce-main/src/routes/AppRouter.tsx apps/web/buildsmart-commerce-main/src/routes/AppRouter.test.tsx
git commit -m "feat: route the two service pages (placeholders)"
```

---

## Phase 2 — Backend bookings + frontend booking form

### Task 13: `consultation_bookings` migration + model + factory

Run backend commands from `apps/api/obidonn-backend/`.

**Files:**
- Create: migration `database/migrations/XXXX_create_consultation_bookings_table.php`
- Create: `app/Models/ConsultationBooking.php`
- Create: `database/factories/ConsultationBookingFactory.php`

- [ ] **Step 1: Generate model + migration + factory**

```bash
php artisan make:model ConsultationBooking -mf --no-interaction
```

Expected: creates the model, a migration, and a factory.

- [ ] **Step 2: Define the migration `up()` schema**

Replace the generated migration's `up()` body:

```php
public function up(): void
{
    Schema::create('consultation_bookings', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email');
        $table->string('phone')->nullable();
        $table->enum('service_type', ['architectural', 'interior']);
        $table->string('project_type')->nullable();
        $table->text('message');
        $table->string('status')->default('new');
        $table->timestamps();
    });
}
```

- [ ] **Step 3: Define the model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'phone', 'service_type', 'project_type', 'message', 'status',
    ];

    public const SERVICE_TYPES = [
        'architectural' => 'Architectural',
        'interior' => 'Interior',
    ];

    public const STATUSES = [
        'new' => 'New',
        'contacted' => 'Contacted',
        'closed' => 'Closed',
    ];

    protected function casts(): array
    {
        return [];
    }
}
```

- [ ] **Step 4: Define the factory**

```php
<?php

namespace Database\Factories;

use App\Models\ConsultationBooking;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsultationBookingFactory extends Factory
{
    protected $model = ConsultationBooking::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'service_type' => fake()->randomElement(['architectural', 'interior']),
            'project_type' => fake()->optional()->randomElement(['New build', 'Renovation', 'Fit-out']),
            'message' => fake()->paragraph(),
            'status' => 'new',
        ];
    }
}
```

- [ ] **Step 5: Migrate + format**

```bash
php artisan migrate
vendor/bin/pint --dirty --format agent
```

Expected: migration runs; Pint reports formatted files.

- [ ] **Step 6: Commit**

```bash
git add apps/api/obidonn-backend/app/Models/ConsultationBooking.php apps/api/obidonn-backend/database/migrations apps/api/obidonn-backend/database/factories/ConsultationBookingFactory.php
git commit -m "feat: consultation_bookings model, migration, factory"
```

---

### Task 14: Form Request + API Resource + controller + route (TDD)

**Files:**
- Create: `app/Http/Requests/Api/StoreConsultationBookingRequest.php`
- Create: `app/Http/Resources/Api/ConsultationBookingResource.php`
- Create: `app/Http/Controllers/Api/ConsultationBookingController.php`
- Modify: `routes/api.php`
- Test: `tests/Feature/ConsultationBookingTest.php`

- [ ] **Step 1: Write the failing feature test**

```bash
php artisan make:test --pest ConsultationBookingTest --no-interaction
```

Replace its contents:

```php
<?php

use App\Models\ConsultationBooking;

it('stores a valid consultation booking', function () {
    $payload = [
        'name' => 'Ada Obi',
        'email' => 'ada@example.com',
        'phone' => '08030000000',
        'service_type' => 'architectural',
        'project_type' => 'New build',
        'message' => 'I want to build a 4-bedroom duplex.',
    ];

    $response = $this->postJson('/api/consultations', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Ada Obi')
        ->assertJsonPath('data.service_type', 'architectural')
        ->assertJsonPath('data.status', 'new');

    expect(ConsultationBooking::where('email', 'ada@example.com')->exists())->toBeTrue();
});

it('rejects an invalid service type', function () {
    $response = $this->postJson('/api/consultations', [
        'name' => 'Ada Obi',
        'email' => 'ada@example.com',
        'service_type' => 'plumbing',
        'message' => 'Hi',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['service_type']);
});

it('requires name, email and message', function () {
    $response = $this->postJson('/api/consultations', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'message', 'service_type']);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `php artisan test --compact --filter=ConsultationBookingTest`
Expected: FAIL — route `/api/consultations` not defined (404/MethodNotAllowed).

- [ ] **Step 3: Create the Form Request**

```bash
php artisan make:request Api/StoreConsultationBookingRequest --no-interaction
```

Replace contents:

```php
<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConsultationBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'service_type' => ['required', Rule::in(['architectural', 'interior'])],
            'project_type' => ['nullable', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'service_type.in' => 'Please choose a valid service.',
            'message.required' => 'Tell us a little about your project.',
        ];
    }
}
```

- [ ] **Step 4: Create the API Resource**

```bash
php artisan make:resource Api/ConsultationBookingResource --no-interaction
```

Replace the `toArray` body:

```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
        'phone' => $this->phone,
        'service_type' => $this->service_type,
        'project_type' => $this->project_type,
        'message' => $this->message,
        'status' => $this->status,
        'created_at' => $this->created_at,
    ];
}
```

- [ ] **Step 5: Create the controller**

```bash
php artisan make:controller Api/ConsultationBookingController --no-interaction
```

Replace contents:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreConsultationBookingRequest;
use App\Http\Resources\Api\ConsultationBookingResource;
use App\Models\ConsultationBooking;
use Illuminate\Http\JsonResponse;

class ConsultationBookingController extends Controller
{
    public function store(StoreConsultationBookingRequest $request): JsonResponse
    {
        $booking = ConsultationBooking::create($request->validated());

        return response()->json([
            'message' => 'Thank you — we will be in touch shortly.',
            'data' => new ConsultationBookingResource($booking),
        ], 201);
    }
}
```

- [ ] **Step 6: Register the route in `routes/api.php`**

Add to the `use` group import line and a route. Update the top `use` statement to include the controller:

```php
use App\Http\Controllers\Api\{CategoryController, ProductController, OrderController, ConsultationBookingController};
```

Add the route (after the orders routes):

```php
Route::post('/consultations', [ConsultationBookingController::class, 'store']);
```

- [ ] **Step 7: Run the test to verify it passes; format**

Run: `php artisan test --compact --filter=ConsultationBookingTest`
Expected: PASS (3 tests).

Then: `vendor/bin/pint --dirty --format agent`

- [ ] **Step 8: Commit**

```bash
git add apps/api/obidonn-backend/app/Http apps/api/obidonn-backend/routes/api.php apps/api/obidonn-backend/tests/Feature/ConsultationBookingTest.php
git commit -m "feat: POST /api/consultations endpoint with validation + resource"
```

---

### Task 15: Filament `ConsultationBookingResource`

**Files:**
- Create (generated): `app/Filament/Resources/ConsultationBookingResource.php` and its Pages

- [ ] **Step 1: Generate the resource**

```bash
php artisan make:filament-resource ConsultationBooking --view --no-interaction
```

- [ ] **Step 2: Replace the resource body**

```php
<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConsultationBookingResource\Pages;
use App\Models\ConsultationBooking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ConsultationBookingResource extends Resource
{
    protected static ?string $model = ConsultationBooking::class;

    protected static ?string $navigationIcon = 'heroicon-o-pencil-square';

    protected static ?string $navigationGroup = 'Sales';

    protected static ?string $navigationLabel = 'Consultations';

    protected static ?int $navigationSort = 2;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Enquiry')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('name')->disabled(),
                    Forms\Components\TextInput::make('email')->disabled(),
                    Forms\Components\TextInput::make('phone')->disabled(),
                    Forms\Components\TextInput::make('service_type')->disabled(),
                    Forms\Components\TextInput::make('project_type')->disabled(),
                    Forms\Components\Textarea::make('message')->disabled()->columnSpan(2),
                    Forms\Components\Select::make('status')
                        ->options(ConsultationBooking::STATUSES)
                        ->required(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('email')->searchable()->copyable(),
                Tables\Columns\TextColumn::make('service_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => ConsultationBooking::SERVICE_TYPES[$state] ?? $state)
                    ->color(fn (string $state): string => $state === 'architectural' ? 'warning' : 'info'),
                Tables\Columns\TextColumn::make('project_type')->placeholder('—'),
                Tables\Columns\SelectColumn::make('status')->options(ConsultationBooking::STATUSES),
                Tables\Columns\TextColumn::make('created_at')->label('Received')->dateTime()->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('service_type')->options(ConsultationBooking::SERVICE_TYPES),
                Tables\Filters\SelectFilter::make('status')->options(ConsultationBooking::STATUSES),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListConsultationBookings::route('/'),
            'view' => Pages\ViewConsultationBooking::route('/{record}'),
            'edit' => Pages\EditConsultationBooking::route('/{record}/edit'),
        ];
    }
}
```

- [ ] **Step 3: Format + sanity check**

```bash
vendor/bin/pint --dirty --format agent
php artisan test --compact
```

Expected: Pint formats; full suite still green.

- [ ] **Step 4: Manual verify**

Run `php artisan serve`, log into `/admin`, confirm a **Consultations** entry exists under the Sales group and lists seeded/posted bookings.

- [ ] **Step 5: Commit**

```bash
git add apps/api/obidonn-backend/app/Filament/Resources/ConsultationBookingResource.php apps/api/obidonn-backend/app/Filament/Resources/ConsultationBookingResource
git commit -m "feat: Filament Consultations resource"
```

---

### Task 16: Frontend booking API client + types

**Files:**
- Create: `src/api/consultations.ts`
- Test: `src/api/consultations.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import apiClient from "./apiClient";
import { submitConsultation, type ConsultationPayload } from "./consultations";

vi.mock("./apiClient", () => ({ default: { post: vi.fn() } }));

const payload: ConsultationPayload = {
  name: "Ada Obi",
  email: "ada@example.com",
  phone: "08030000000",
  service_type: "architectural",
  project_type: "New build",
  message: "Build a duplex",
};

describe("submitConsultation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts to /consultations and returns the created booking", async () => {
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { message: "ok", data: { id: 1, ...payload, status: "new" } },
    });

    const result = await submitConsultation(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/consultations", payload);
    expect(result.id).toBe(1);
    expect(result.status).toBe("new");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- consultations`
Expected: FAIL — cannot find module `./consultations`.

- [ ] **Step 3: Implement the client**

```ts
// src/api/consultations.ts
import apiClient from "@/api/apiClient";

export type ServiceType = "architectural" | "interior";

export interface ConsultationPayload {
  name: string;
  email: string;
  phone?: string;
  service_type: ServiceType;
  project_type?: string;
  message: string;
}

export interface ConsultationBooking extends ConsultationPayload {
  id: number;
  status: string;
  created_at?: string;
}

export async function submitConsultation(payload: ConsultationPayload): Promise<ConsultationBooking> {
  const { data } = await apiClient.post<{ message: string; data: ConsultationBooking }>(
    "/consultations",
    payload,
  );
  return data.data;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- consultations`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/api/consultations.ts apps/web/buildsmart-commerce-main/src/api/consultations.test.ts
git commit -m "feat: submitConsultation API client"
```

---

### Task 17: `BookingForm` component (react-hook-form + zod)

**Files:**
- Create: `src/components/services/BookingForm.tsx`
- Test: `src/components/services/BookingForm.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookingForm } from "./BookingForm";
import * as api from "@/api/consultations";

vi.mock("@/api/consultations", () => ({ submitConsultation: vi.fn() }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));

describe("BookingForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("submits the form with the given service_type", async () => {
    (api.submitConsultation as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 1, name: "Ada", email: "a@b.com", service_type: "interior", message: "hi", status: "new",
    });

    render(<BookingForm serviceType="interior" />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Ada Obi" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "I want a cozy living room." } });
    fireEvent.click(screen.getByRole("button", { name: /request a consultation/i }));

    await waitFor(() =>
      expect(api.submitConsultation).toHaveBeenCalledWith(
        expect.objectContaining({ service_type: "interior", name: "Ada Obi", email: "ada@example.com" }),
      ),
    );
  });

  it("shows a validation error when required fields are empty", async () => {
    render(<BookingForm serviceType="architectural" />);
    fireEvent.click(screen.getByRole("button", { name: /request a consultation/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(api.submitConsultation).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- BookingForm`
Expected: FAIL — cannot find module `./BookingForm`.

- [ ] **Step 3: Implement `BookingForm`**

```tsx
// src/components/services/BookingForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitConsultation, type ServiceType } from "@/api/consultations";
import { GoldButton } from "@/components/brand/GoldButton";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().optional(),
  project_type: z.string().optional(),
  message: z.string().min(1, "Please tell us about your project"),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-lg border border-border bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

export function BookingForm({ serviceType }: { serviceType: ServiceType }) {
  const { toast } = useToast();
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitConsultation({ ...values, service_type: serviceType });
      setDone(true);
      reset();
      toast({ title: "Request sent", description: "We will be in touch shortly." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-card/60 p-10 text-center">
        <p className="font-heading text-2xl text-gold-light">Thank you.</p>
        <p className="mt-2 text-sm text-muted-foreground">Your request has been received — we’ll reach out soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="bf-name" className="eyebrow mb-2 block text-muted-foreground">Full name</label>
        <input id="bf-name" className={inputClass} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bf-email" className="eyebrow mb-2 block text-muted-foreground">Email</label>
          <input id="bf-email" className={inputClass} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="bf-phone" className="eyebrow mb-2 block text-muted-foreground">Phone (optional)</label>
          <input id="bf-phone" className={inputClass} {...register("phone")} />
        </div>
      </div>

      <div>
        <label htmlFor="bf-project" className="eyebrow mb-2 block text-muted-foreground">Project type (optional)</label>
        <input id="bf-project" className={inputClass} placeholder="New build, renovation, fit-out…" {...register("project_type")} />
      </div>

      <div>
        <label htmlFor="bf-message" className="eyebrow mb-2 block text-muted-foreground">Message</label>
        <textarea id="bf-message" rows={4} className={inputClass} {...register("message")} />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <GoldButton type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Request a Consultation"}
      </GoldButton>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- BookingForm`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/services/BookingForm.tsx apps/web/buildsmart-commerce-main/src/components/services/BookingForm.test.tsx
git commit -m "feat: BookingForm with validation + submission"
```

---

## Phase 3 — Architectural Consultation page

### Task 18: Architectural page section components

These compose the page. Each is a focused presentational component using the brand primitives.

**Files:**
- Create: `src/components/services/architectural/ArchHero.tsx`
- Create: `src/components/services/SectionHeading.tsx` (shared)

- [ ] **Step 1: Shared `SectionHeading`**

```tsx
// src/components/services/SectionHeading.tsx
import { Eyebrow } from "@/components/brand/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SplitReveal as="h2" text={title} className="mt-3 font-heading text-3xl font-semibold md:text-5xl" />
    </div>
  );
}
```

- [ ] **Step 2: `ArchHero` (video hero with poster + parallax-safe)**

```tsx
// src/components/services/architectural/ArchHero.tsx
import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { GoldButton } from "@/components/brand/GoldButton";
import { Button } from "@/components/ui/button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import poster from "@/assets/brand/arch.jpeg";

export function ArchHero() {
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/media/for-architectural.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />

      <div className="container relative z-10 mx-auto px-4 pb-20">
        <Eyebrow>Architectural Consultation</Eyebrow>
        <SplitReveal
          as="h1"
          text="Spaces engineered to inspire."
          className="mt-4 max-w-3xl font-heading text-5xl font-semibold leading-[1.05] md:text-7xl"
        />
        <Reveal delay={0.3} className="mt-6 max-w-xl text-lg text-muted-foreground">
          From first sketch to final structure — DONNS designs buildings that command attention and stand for generations.
        </Reveal>
        <Reveal delay={0.45} className="mt-8 flex flex-wrap gap-4">
          <GoldButton asChild size="lg">
            <a href="#book">Book a Consultation</a>
          </GoldButton>
          <Button asChild variant="outline" size="lg" className="border-foreground/30 text-foreground hover:bg-foreground/10">
            <a href="#portfolio">View Portfolio</a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Build check**

Run: `npm run build`. Expected: compiles.

- [ ] **Step 4: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/services/SectionHeading.tsx apps/web/buildsmart-commerce-main/src/components/services/architectural
git commit -m "feat: architectural hero + shared SectionHeading"
```

---

### Task 19: Assemble the Architectural page

**Files:**
- Modify: `src/pages/services/Architectural.tsx` (full replace — remove placeholder)

- [ ] **Step 1: Replace `src/pages/services/Architectural.tsx`**

```tsx
import { ArchHero } from "@/components/services/architectural/ArchHero";
import { SectionHeading } from "@/components/services/SectionHeading";
import { BookingForm } from "@/components/services/BookingForm";
import { StatCounter } from "@/components/brand/StatCounter";
import { Reveal } from "@/components/motion/Reveal";
import { Hairline } from "@/components/brand/Hairline";
import archImage from "@/assets/brand/arch.jpeg";
import pinImage from "@/assets/brand/pin.jpg";

const services = [
  "Site & feasibility analysis",
  "Concept & 3D massing",
  "Construction drawings",
  "Permitting & approvals",
  "Build supervision",
];

const steps = [
  { n: "01", t: "Consult", d: "We listen to your vision, site and budget." },
  { n: "02", t: "Concept", d: "Mood, massing and 3D walkthroughs." },
  { n: "03", t: "Construct", d: "Documentation, permits and on-site supervision." },
];

const Architectural = () => (
  <div className="theme-dark bg-background text-foreground">
    <ArchHero />

    {/* Stats */}
    <section className="border-y border-border">
      <div className="container mx-auto grid grid-cols-3 gap-6 px-4 py-14">
        <StatCounter value={18} suffix="+" label="Years" />
        <StatCounter value={240} label="Projects" />
        <StatCounter value={12} label="Awards" />
      </div>
    </section>

    {/* Split: floor plan + services */}
    <section className="container mx-auto grid items-center gap-10 px-4 py-24 md:grid-cols-2">
      <Reveal>
        <img src={pinImage} alt="Architectural floor plan" className="w-full rounded-2xl border border-border object-cover" />
      </Reveal>
      <div>
        <SectionHeading eyebrow="What we do" title="Concept to blueprint" />
        <ul className="mt-8 space-y-4">
          {services.map((s) => (
            <li key={s} className="flex items-start gap-3 text-muted-foreground">
              <span className="mt-1 text-gold">›</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Full-bleed premium image */}
    <section className="relative h-[60vh] overflow-hidden">
      <img src={archImage} alt="DONNS architecture" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </section>

    {/* Process */}
    <section className="container mx-auto px-4 py-24">
      <SectionHeading eyebrow="The process" title="How we build with you" className="max-w-2xl" />
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border md:grid-cols-3">
        {steps.map((s) => (
          <Reveal key={s.n} className="bg-card p-8">
            <div className="font-heading text-4xl font-semibold text-gold">{s.n}</div>
            <h3 className="mt-4 font-heading text-2xl">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Portfolio (placeholder tiles) */}
    <section id="portfolio" className="container mx-auto px-4 pb-24">
      <SectionHeading eyebrow="Selected work" title="A portfolio of permanence" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[archImage, pinImage, archImage, pinImage, archImage, pinImage].map((img, i) => (
          <Reveal key={i} className="group overflow-hidden rounded-xl border border-border">
            <img src={img} alt={`Project ${i + 1}`} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{/* TODO(content): replace with real project imagery + titles */}Placeholder projects — swap for real work.</p>
    </section>

    {/* Booking */}
    <section id="book" className="border-t border-border bg-card/40">
      <div className="container mx-auto grid gap-12 px-4 py-24 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Start your project" title="Book a consultation" />
          <Hairline className="my-8 max-w-xs" />
          <p className="max-w-md text-muted-foreground">
            Tell us about your site and ambitions. Our architects will reach out to schedule your first session.
          </p>
        </div>
        <BookingForm serviceType="architectural" />
      </div>
    </section>
  </div>
);

export default Architectural;
```

- [ ] **Step 2: Build + visual verify**

Run: `npm run dev`, open `/services/architectural`. Expected: video hero plays (muted, looping), headline reveals word-by-word, stats count up on scroll, floor-plan split, full-bleed dome image, process cards, portfolio grid, and a working booking form. Submitting a valid form (with the Laravel API running, `USE_MOCK=false`) shows the thank-you state and creates a row in Filament → Consultations.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/pages/services/Architectural.tsx
git commit -m "feat: architectural consultation page"
```

---

## Phase 4 — Interior Design page (scroll-scrub video)

### Task 20: `useScrollScrubVideo` hook (desktop video scrub)

Ties `video.currentTime` to a pinned ScrollTrigger. Reduced-motion/no-video → caller falls back (Task 21).

**Files:**
- Create: `src/lib/animation/useScrollScrubVideo.ts`

- [ ] **Step 1: Implement the hook**

```ts
// src/lib/animation/useScrollScrubVideo.ts
import { useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";

/**
 * Pins `containerRef` and scrubs `videoRef.currentTime` from 0..duration
 * across `scrubScreens` viewport-heights of scroll. Reversible by design
 * (ScrollTrigger scrub follows scroll direction).
 */
export function useScrollScrubVideo({
  containerRef,
  videoRef,
  enabled,
  scrubScreens = 3,
}: {
  containerRef: RefObject<HTMLElement>;
  videoRef: RefObject<HTMLVideoElement>;
  enabled: boolean;
  scrubScreens?: number;
}) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!enabled || !container || !video) return;

    let trigger: ScrollTrigger | undefined;
    const state = { duration: 0 };

    const build = () => {
      state.duration = video.duration || 0;
      if (!state.duration) return;
      video.pause();

      const ctx = gsap.context(() => {
        const proxy = { t: 0 };
        gsap.to(proxy, {
          t: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: `+=${scrubScreens * 100}%`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
          },
          onUpdate: () => {
            const time = proxy.t * state.duration;
            if (Number.isFinite(time)) video.currentTime = time;
          },
        });
      }, container);

      trigger = ScrollTrigger.getAll().at(-1);
      return ctx;
    };

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const onReady = () => {
      ctx?.revert();
      ctx = build();
    };

    if (video.readyState >= 1) {
      onReady();
    } else {
      video.addEventListener("loadedmetadata", onReady, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      trigger?.kill();
      ctx?.revert();
    };
  }, [containerRef, videoRef, enabled, scrubScreens]);
}
```

- [ ] **Step 2: Build check**

Run: `npm run build`. Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/lib/animation/useScrollScrubVideo.ts
git commit -m "feat: useScrollScrubVideo hook (pinned scroll-scrub)"
```

---

### Task 21: `InteriorHero` (pinned scrub on desktop, static fallback elsewhere)

The hero detects coarse pointer / reduced-motion and falls back to a static poster + fade so mobile never fights the browser's video throttling.

**Files:**
- Create: `src/components/services/interior/InteriorHero.tsx`

- [ ] **Step 1: Implement the hero**

```tsx
// src/components/services/interior/InteriorHero.tsx
import { useRef } from "react";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";
import { useScrollScrubVideo } from "@/lib/animation/useScrollScrubVideo";
import poster from "@/assets/brand/pin2.jpg";

function useCoarsePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
}

export function InteriorHero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const scrubEnabled = !reduced && !coarse;

  useScrollScrubVideo({ containerRef, videoRef, enabled: scrubEnabled });

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {scrubEnabled ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          muted
          playsInline
          preload="auto"
        >
          <source src="/media/decor.mp4" type="video/mp4" />
        </video>
      ) : (
        <img src={poster} alt="Interior décor" className="absolute inset-0 h-full w-full object-cover" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />

      <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-24">
        <Eyebrow>Interior Design</Eyebrow>
        <SplitReveal
          as="h1"
          text="Interiors that feel like home, finished like a gallery."
          className="mt-4 max-w-3xl font-heading text-5xl font-semibold leading-[1.06] md:text-7xl"
        />
        <p className="eyebrow mt-8 text-muted-foreground">↓ scroll to begin the story</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build + visual verify**

Run: `npm run dev`, open `/services/interior`. Expected (desktop, motion on): the hero pins and the décor video scrubs forward as you scroll down and reverses scrolling up; releases after ~3 screens. With OS reduce-motion on, or in mobile emulation (coarse pointer), it shows the static `pin2` poster instead and the page scrolls normally.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/services/interior/InteriorHero.tsx
git commit -m "feat: interior pinned scroll-scrub hero with mobile/reduced-motion fallback"
```

---

### Task 22: Assemble the Interior page

**Files:**
- Modify: `src/pages/services/Interior.tsx` (full replace — remove placeholder)

- [ ] **Step 1: Replace `src/pages/services/Interior.tsx`**

```tsx
import { InteriorHero } from "@/components/services/interior/InteriorHero";
import { SectionHeading } from "@/components/services/SectionHeading";
import { BookingForm } from "@/components/services/BookingForm";
import { Reveal } from "@/components/motion/Reveal";
import { Hairline } from "@/components/brand/Hairline";
import showcase from "@/assets/brand/pin2.jpg";

const services = [
  { t: "Space planning & styling", d: "Layouts that flow around how you actually live." },
  { t: "Custom furniture & joinery", d: "Bespoke pieces made to your space and taste." },
  { t: "Lighting & ambiance", d: "Layered light that shifts with the time of day." },
  { t: "Material, color & texture", d: "Curated palettes with a tactile, warm finish." },
  { t: "Full project management", d: "We handle trades, timelines and installation." },
];

const Interior = () => (
  <div className="theme-dark bg-background text-foreground">
    <InteriorHero />

    {/* Services over a dark section */}
    <section className="container mx-auto px-4 py-24">
      <SectionHeading eyebrow="Our décor services" title="From mood to move-in" className="max-w-2xl" />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Reveal key={s.t} className="rounded-2xl border border-border bg-card/60 p-7 backdrop-blur">
            <h3 className="font-heading text-2xl">{s.t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
          </Reveal>
        ))}
      </div>
    </section>

    {/* pin2 showcase */}
    <section className="relative h-[80vh] overflow-hidden">
      <img src={showcase} alt="Featured interior project" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-16">
        <p className="eyebrow text-gold-light">Featured project</p>
        <h3 className="mt-2 font-heading text-4xl md:text-5xl">The Ridge Residence</h3>
      </div>
    </section>

    {/* Booking */}
    <section id="book" className="border-t border-border bg-card/40">
      <div className="container mx-auto grid gap-12 px-4 py-24 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Let’s design yours" title="Book a design consultation" />
          <Hairline className="my-8 max-w-xs" />
          <p className="max-w-md text-muted-foreground">
            Share your space and the feeling you’re after. Our designers will follow up to begin.
          </p>
        </div>
        <BookingForm serviceType="interior" />
      </div>
    </section>
  </div>
);

export default Interior;
```

- [ ] **Step 2: Build + visual verify**

Run: `npm run dev`, open `/services/interior`. Expected: scrub hero → services grid → pin2 showcase → booking form. Submitting (valid, API up) creates an `interior` consultation in Filament.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/pages/services/Interior.tsx
git commit -m "feat: interior design page"
```

---

## Phase 5 — Homepage rebuild

### Task 23: Homepage hero + services teaser components

**Files:**
- Create: `src/components/home/HomeHero.tsx`
- Create: `src/components/home/ServicesTeaser.tsx`

- [ ] **Step 1: `HomeHero` (striking still + animated text + parallax)**

```tsx
// src/components/home/HomeHero.tsx
import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { GoldButton } from "@/components/brand/GoldButton";
import { Button } from "@/components/ui/button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";
import hero from "@/assets/brand/arch.jpeg";

export function HomeHero() {
  const imgRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = imgRef.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <img ref={imgRef} src={hero} alt="DONNS architecture" className="absolute inset-0 h-[120%] w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <Eyebrow>Design · Supply · Build</Eyebrow>
        <SplitReveal
          as="h1"
          text="Build in gold standard."
          className="mt-4 max-w-4xl font-heading text-6xl font-semibold leading-[1.02] md:text-8xl"
        />
        <Reveal delay={0.3} className="mt-6 max-w-xl text-lg text-muted-foreground">
          Premium building materials and bespoke architectural &amp; interior design — from foundation to finishing touch.
        </Reveal>
        <Reveal delay={0.45} className="mt-8 flex flex-wrap gap-4">
          <GoldButton asChild size="lg">
            <Link to="/products">Shop Materials <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </GoldButton>
          <Button asChild variant="outline" size="lg" className="border-foreground/30 text-foreground hover:bg-foreground/10">
            <Link to="/services/architectural">Our Services</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `ServicesTeaser` (two tiles)**

```tsx
// src/components/home/ServicesTeaser.tsx
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import arch from "@/assets/brand/arch.jpeg";
import interior from "@/assets/brand/pin2.jpg";

const tiles = [
  { to: "/services/architectural", img: arch, eyebrow: "Service", title: "Architectural Consultation", d: "Concept to blueprint to build." },
  { to: "/services/interior", img: interior, eyebrow: "Service", title: "Interior Design", d: "Décor that feels like home." },
];

export function ServicesTeaser() {
  return (
    <section className="container mx-auto grid gap-6 px-4 py-24 md:grid-cols-2">
      {tiles.map((t) => (
        <Reveal key={t.to}>
          <Link to={t.to} className="group relative block h-[60vh] overflow-hidden rounded-3xl border border-border">
            <img src={t.img} alt={t.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="eyebrow text-gold-light">{t.eyebrow}</p>
              <h3 className="mt-2 flex items-center gap-2 font-heading text-3xl md:text-4xl">
                {t.title} <ArrowUpRight className="h-6 w-6 text-gold transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.d}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}
```

- [ ] **Step 3: Build check + commit**

Run: `npm run build`. Expected: compiles.

```bash
git add apps/web/buildsmart-commerce-main/src/components/home
git commit -m "feat: home hero + services teaser"
```

---

### Task 24: Rebuild `Home.tsx`

Reuses existing `useProducts`/`useCategories` hooks and `ProductCard`/`CategoryCard` (restyled in Phase 6). Wrapped in `theme-dark`.

**Files:**
- Modify: `src/pages/Home.tsx` (full replace)

- [ ] **Step 1: Replace `src/pages/Home.tsx`**

```tsx
import { Link } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import CategoryCard from "@/components/product/CategoryCard";
import { Button } from "@/components/ui/button";
import { HomeHero } from "@/components/home/HomeHero";
import { ServicesTeaser } from "@/components/home/ServicesTeaser";
import { SectionHeading } from "@/components/services/SectionHeading";
import { StatCounter } from "@/components/brand/StatCounter";
import { Reveal } from "@/components/motion/Reveal";

const Home = () => {
  const { products: featured, loading: loadingFeatured } = useProducts({ featured: true });
  const { categories, loading: loadingCategories } = useCategories();

  return (
    <div className="theme-dark bg-background text-foreground">
      <HomeHero />
      <ServicesTeaser />

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading eyebrow="The store" title="Shop by category" className="mb-10 text-center md:text-left" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {loadingCategories
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)
            : categories.map((cat) => (
                <Reveal key={cat.id}>
                  <CategoryCard category={cat} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-card/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <SectionHeading eyebrow="Curated" title="Featured products" />
            <Button asChild variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10">
              <Link to="/products">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />)
              : featured.map((p) => (
                  <Reveal key={p.id}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="container mx-auto px-4 py-24 text-center">
        <SectionHeading eyebrow="Why DONNS" title="Design. Supply. Build." className="mx-auto max-w-2xl" />
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-8">
          <StatCounter value={18} suffix="+" label="Years" />
          <StatCounter value={240} label="Projects" />
          <StatCounter value={5000} suffix="+" label="Products" />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-24 text-center">
          <SectionHeading eyebrow="Start building" title="Ready to build in gold standard?" className="mx-auto max-w-2xl" />
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg" className="btn-gold border-0 font-semibold">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
```

- [ ] **Step 2: Build + visual verify**

Run: `npm run dev`, open `/`. Expected: parallax hero with word-reveal headline, two service tiles, category grid, featured products, animated brand-story counters, CTA — all dark/gold. (Product cards may look plain until Task 26.)

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/pages/Home.tsx
git commit -m "feat: rebuild premium DONNS homepage"
```

---

## Phase 6 — E-commerce restyle (light luxury)

> These tasks re-skin existing pages to the cream/black/gold system. No data/logic changes. Each is verified by build + visual check. Because the global tokens already changed in Task 4, much restyling is automatic — these tasks fix brand-specific bits (orange→gold, headings, spacing, card treatment).

### Task 25: Restyle `ProductCard`

**Files:**
- Modify: `src/components/product/ProductCard.tsx`

- [ ] **Step 1: Apply gold/cream treatment**

In `src/components/product/ProductCard.tsx`, make these exact changes:

1. The featured badge currently uses `bg-primary ... text-primary-foreground`. Replace that `<span>`'s className with:

```tsx
className="absolute left-2 top-2 rounded-full btn-gold px-2 py-0.5 text-xs font-medium"
```

2. The category label `<p className="text-xs font-medium text-primary">` → change `text-primary` to `text-gold`.

3. The price `<p className="font-heading text-lg font-bold text-foreground">` stays, but add tracking: change to `font-heading text-lg font-semibold text-foreground`.

4. The card wrapper `<Link>` className: change `hover:shadow-md card-shadow` to `hover:card-shadow-hover card-shadow transition-shadow`.

- [ ] **Step 2: Visual verify**

Run: `npm run dev`, open `/products`. Expected: product cards are clean white-on-cream with gold category text and a gold "Featured" badge; serif price.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/product/ProductCard.tsx
git commit -m "style: gold/cream ProductCard"
```

---

### Task 26: Restyle remaining product components (`CategoryCard`, `FilterSidebar`, `SearchBar`)

**Files:**
- Modify: `src/components/product/CategoryCard.tsx`
- Modify: `src/components/product/FilterSidebar.tsx`
- Modify: `src/components/product/SearchBar.tsx`

- [ ] **Step 1: Read each file, then replace orange/primary accents with gold**

For each file, apply this rule set (search-and-replace within the file):
- `text-primary` → `text-gold`
- `bg-primary` (used as an accent dot/active state, not a button) → `bg-gold`
- `ring-primary` / `border-primary` (active filter states) → `ring-gold` / `border-gold`
- `hover:text-primary` → `hover:text-gold`
- Any heading using `font-heading` keeps it (now Cormorant) — ensure section titles use `font-heading text-xl font-semibold`.

Leave shadcn `Button`/`Input` components as-is (they read the new tokens automatically).

- [ ] **Step 2: Visual verify**

Run: `npm run dev`, open `/products`. Expected: category cards, the filter sidebar (active states gold), and the search bar all read in the cream/gold system with serif headings.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/components/product
git commit -m "style: gold/cream product browsing components"
```

---

### Task 27: Restyle pages `Products`, `ProductDetails`, `Cart`, `Checkout`

**Files:**
- Modify: `src/pages/Products.tsx`
- Modify: `src/pages/ProductDetails.tsx`
- Modify: `src/pages/Cart.tsx`
- Modify: `src/pages/Checkout.tsx`

- [ ] **Step 1: Apply brand pass to each page**

For each page file, read it, then:
- Replace any `text-primary` accent with `text-gold`; `bg-primary` used as a non-button accent with `bg-gold`.
- Page H1/H2 headings: ensure they use `font-heading text-3xl md:text-4xl font-semibold` (Cormorant). Add an `Eyebrow` above the main page title where there's a section intro, e.g. on `Products.tsx` add at the top of the header block:

```tsx
import { Eyebrow } from "@/components/brand/Eyebrow";
// ...inside the page header:
<Eyebrow>The store</Eyebrow>
```

- Primary CTAs that should pop (e.g., "Place Order" on Checkout, "Proceed to Checkout" on Cart): give them the gold treatment by adding `className="btn-gold border-0 font-semibold"` to that `Button` (keep `size`).
- These pages stay on the **light** (default) theme — do NOT add `theme-dark`.

- [ ] **Step 2: Visual verify each route**

Run: `npm run dev`, visit `/products`, a product detail, `/cart`, `/checkout`. Expected: consistent cream/black/gold, serif headings, gold primary CTAs; cart/checkout still function (add to cart → cart → checkout flow unchanged).

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/pages/Products.tsx apps/web/buildsmart-commerce-main/src/pages/ProductDetails.tsx apps/web/buildsmart-commerce-main/src/pages/Cart.tsx apps/web/buildsmart-commerce-main/src/pages/Checkout.tsx
git commit -m "style: gold/cream shop, product, cart, checkout pages"
```

---

### Task 28: Restyle `About`, `Contact`, `NotFound`

**Files:**
- Modify: `src/pages/About.tsx`
- Modify: `src/pages/Contact.tsx`
- Modify: `src/pages/NotFound.tsx`

- [ ] **Step 1: Restyle**

- `About.tsx`: wrap the top hero/intro block in `theme-dark` (dark editorial), the rest stays light. Replace brand name "BuildMart"/"Obidonn Hardwares" copy with "DONNS"; `text-primary` → `text-gold`; headings → `font-heading`. Add an `Eyebrow` ("Our story") above the title.
- `Contact.tsx`: light theme. Replace any orange accents with gold; ensure form inputs match the `inputClass` style (border, `focus:ring-gold`); update contact details to the DONNS placeholders (`hello@donns.com`, `+234 800 000 0000`, `Lagos, Nigeria`). Heading → `font-heading`, add `Eyebrow` ("Get in touch").
- `NotFound.tsx`: center a large serif "404" in gold, a short line, and a `GoldButton` linking home.

```tsx
// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { GoldButton } from "@/components/brand/GoldButton";

const NotFound = () => (
  <div className="theme-dark flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center text-foreground">
    <p className="font-heading text-8xl font-semibold text-gold">404</p>
    <p className="mt-4 text-muted-foreground">This page wandered off the blueprint.</p>
    <GoldButton asChild size="lg" className="mt-8">
      <Link to="/">Back home</Link>
    </GoldButton>
  </div>
);

export default NotFound;
```

- [ ] **Step 2: Visual verify**

Run: `npm run dev`, visit `/about`, `/contact`, and a bad URL. Expected: cohesive brand; 404 is on-brand; contact form usable.

- [ ] **Step 3: Commit**

```bash
git add apps/web/buildsmart-commerce-main/src/pages/About.tsx apps/web/buildsmart-commerce-main/src/pages/Contact.tsx apps/web/buildsmart-commerce-main/src/pages/NotFound.tsx
git commit -m "style: DONNS About, Contact, NotFound"
```

---

## Phase 7 — Polish, verification, ship

### Task 29: Update document title, meta, and favicon

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update `index.html`**

- `<title>` → `DONNS — Design. Supply. Build.`
- `<meta name="description" ...>` → `DONNS: premium building materials, architectural consultation and interior design.`
- Update/replace any `og:title`/`og:description` similarly.
- Set the favicon to the logo: ensure `/media`-independent — copy logo to `public/favicon.png` and reference it.

```bash
# from apps/web/buildsmart-commerce-main/
cp src/assets/brand/logo-donns.jpeg public/favicon.png
```

Then in `index.html` set `<link rel="icon" type="image/png" href="/favicon.png" />`.

- [ ] **Step 2: Visual verify + commit**

Run: `npm run dev`. Expected: browser tab shows DONNS title + gold logo favicon.

```bash
git add apps/web/buildsmart-commerce-main/index.html apps/web/buildsmart-commerce-main/public/favicon.png
git commit -m "chore: DONNS title, meta, favicon"
```

---

### Task 30: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Frontend tests**

Run: `npm run test`
Expected: PASS — all suites (useReducedMotion, StatCounter, Navbar, AppRouter, consultations, BookingForm) green.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors. Fix any introduced.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 4: Backend tests + format**

```bash
# from apps/api/obidonn-backend/
php artisan test --compact
vendor/bin/pint --dirty --format agent
```

Expected: full suite green; Pint clean.

- [ ] **Step 5: Manual end-to-end smoke (API running, USE_MOCK=false)**

Start both apps (`npm run dev` at repo root). Verify:
1. Home renders with hero/teaser/counters.
2. Services dropdown → both pages load; arch video plays; interior scrub works on desktop and falls back on mobile-emulation/reduced-motion.
3. Submit each booking form → thank-you state → appears under `/admin` → Consultations with correct `service_type`.
4. Shop → add to cart → checkout still works.
5. Toggle OS reduced-motion: no pinned scrub, counters show final values, content static — nothing broken.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: DONNS rebuild verification pass"
```

---

## Self-Review notes (coverage map)

- Brand name DONNS → Tasks 9, 10, 11, 29.
- Dark hero / light shop tokens → Task 4; applied per-page via `theme-dark` (Tasks 11, 19, 22, 24, 28) vs default light (Tasks 25–28).
- Services dropdown + routes → Tasks 10, 12.
- Architectural page (video hero, arch + Pin imagery, booking) → Tasks 18, 19.
- Interior page (pinned scrub, mobile fallback, pin2, booking) → Tasks 20, 21, 22.
- Cormorant + Inter → Task 4.
- Homepage striking still + animated text → Tasks 23, 24.
- Bookings backend + Filament → Tasks 13–15; frontend client + form → Tasks 16, 17.
- Premium GSAP (Lenis, reveals, split-text, counters, parallax, scrub, magnetic-not-included note*) → Tasks 5, 6, 7, 8, 20, 21, 23.
- Reduced-motion + mobile fallback → Tasks 5, 21, 30.
- E-commerce restyle → Tasks 25–28.
- Performance/meta → Tasks 21 (preload), 29, 30.

\* *Magnetic buttons were listed in the spec's "full premium" set. They are omitted here to keep the GoldButton accessible and simple; if desired, add a follow-up task wrapping `GoldButton` in a pointer-tracking transform. Flagged so it's a conscious choice, not a gap.*
