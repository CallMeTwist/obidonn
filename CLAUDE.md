# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OBIDONN is a full-stack e-commerce monorepo with:
- **Backend**: Laravel 12 REST API + Filament 3 admin panel — `apps/api/obidonn-backend/`
- **Frontend**: React 18 + TypeScript + Vite SPA — `apps/web/buildsmart-commerce-main/`

## Commands

### Root (runs both apps concurrently)
```bash
npm run dev          # Start API (port 8000) and frontend (port 5173) concurrently
npm run build:web    # Production build of the frontend
```

### Backend (`apps/api/obidonn-backend/`)
```bash
composer setup                              # First-time setup: install, env, key, migrate, build
php artisan serve                           # Start API on http://localhost:8000
php artisan migrate                         # Run migrations
php artisan test --compact                  # Run Pest test suite
php artisan test --compact --filter=Name    # Run a single test
vendor/bin/pint --dirty --format agent      # Format changed PHP files (required after edits)
```

### Frontend (`apps/web/buildsmart-commerce-main/`)
```bash
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Vitest
npm run test:watch # Vitest in watch mode
```

## Architecture

### Backend

**API routes** (`routes/api.php`) are stateless REST endpoints — CSRF is exempted for `/api/*` in `bootstrap/app.php`.

**Middleware and service providers** are registered in `bootstrap/app.php` (Laravel 12 streamlined structure — no `Kernel.php`).

**Models and relationships:**
- `Product` → `belongsTo(Category)`, `hasMany(ProductVariant)`; scopes: `active()`, `featured()`
- `Order` → `hasMany(OrderItem)`; auto-generates unique order numbers; statuses: pending → confirmed → processing → out_for_delivery → delivered → cancelled
- `OrderItem` → links product/variant to an order with quantity and locked pricing
- `ProductVariant` → independent pricing and stock per size/color

**Order creation** (`POST /api/orders`) runs inside a DB transaction that validates stock and decrements it atomically.

**API responses** use Eloquent API Resources — paginated `{ data, links, meta }` or single `{ data, related? }`.

**Admin panel** is served by Filament 3 at `/admin`.

### Frontend

**Routing** (`src/routes/AppRouter.tsx`) uses React Router v6: `/`, `/products`, `/products/:id`, `/cart`, `/checkout`, `/about`, `/contact`.

**State**: Cart lives in `CartContext` (global, localStorage-backed). Server state uses TanStack React Query.

**API client** (`src/api/`) uses Axios pointed at `VITE_API_URL`. Toggle `USE_MOCK` in `apiClient.ts` to use local mock data without the backend running.

**UI** is built with Tailwind CSS 3.4 + shadcn/ui (Radix UI primitives) in `src/components/ui/`.

## Key Conventions

### Backend
- Use `php artisan make:` for all new files; pass `--no-interaction` and appropriate `--options`.
- Always create Form Request classes for validation (never inline in controllers).
- Prefer `Model::query()` over `DB::` raw queries; use eager loading to prevent N+1s.
- Use `env()` only inside `config/` files; reference values via `config()` elsewhere.
- Run `vendor/bin/pint --dirty --format agent` after any PHP file change.
- Tests use **Pest 4** — create with `php artisan make:test --pest {Name}`. See the `pest-testing` skill.

### Frontend
- TypeScript strict mode — all new code must be fully typed.
- Check `src/components/` for existing components before creating new ones.

## Environment
- Backend `.env`: MySQL on localhost, database `obidonn_backend`
- Frontend `.env`: `VITE_API_URL=http://localhost:8000/api`

## Additional Backend Guidelines

The backend has detailed Laravel Boost guidelines in `apps/api/obidonn-backend/CLAUDE.md` covering Laravel 12 specifics, Pint formatting, Pest testing, Filament, and the `search-docs` / `tinker` / `database-query` MCP tools. Consult it when working in the backend.
