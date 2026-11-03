# PawVerdi

A pet knowledge and marketplace platform for dog and cat owners — education, verified listings, product recommendations, labelled advertising.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Supabase/PostgreSQL

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

No environment variables are required to run. Without Supabase credentials the app runs in **demo mode**: all reads come from `lib/content.ts`, writes are validated but not stored, and the UI says so on every form and in the admin header.

```bash
npm run build && npm start     # production build (44 prerendered routes)
npm run verify                 # smoke test: 16 pages + 4 API behaviours + security headers
npm run typecheck              # tsc --noEmit
```

---

## Environment

Copy `.env.example` to `.env.local` when connecting a database.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | for live mode | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for live mode | Client reads, subject to RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | for live writes | Server-only; bypasses RLS. Never expose to the browser. |
| `NEXT_PUBLIC_SITE_URL` | for canonical URLs | Defaults to `https://pawverdi.com` |

**The service-role key must never be prefixed with `NEXT_PUBLIC_`.** It is used only inside server route handlers (`app/api/*`).

---

## What is built

| Area | Route | State |
| --- | --- | --- |
| Home (cinematic hero, rail, film) | `/` | Live layout, seed content |
| Dog Center | `/dogs` | Breed table + topic doors + article grid |
| Cat Center | `/cats` | Same structure, cat-specific copy |
| Knowledge Center | `/knowledge` | Filters via query params (work without JS) |
| Article page | `/knowledge/[slug]` | Metadata, JSON-LD, review badge, editorial record |
| Marketplace | `/marketplace` | Verification standard, adoption policy, seller intake form |
| Product shop | `/shop` | Shortlist table, honest "not yet reviewed" states |
| Advertise | `/advertise` | Formats, refusal list, enquiry form, disclosure rules |
| Community | `/community` | Stories queue, newsletter, roadmap gates |
| Trust & safety | `/trust` | Editorial, medical, affiliate, seller, privacy policies |
| Admin | `/admin` | Ops dashboard, publish gating, mode banner |
| API | `/api/health`, `/api/newsletter`, `/api/contact`, `/api/advertise`, `/api/seller-application` | Validated with zod; demo mode returns `stored:false` |

---

## What is deliberately *not* built yet

These are honest gaps, not oversights:

1. **Authentication UI.** Supabase auth helpers and the `profiles`/`is_staff()` policies exist; no login screens are shipped. Admin is read-only until a login flow is added.
2. **Article bodies.** The CMS column (`articles.body`) and the article page shell exist; the seed records carry titles, summaries and review state only.
3. **Marketplace listings.** Zero listings, by policy — publishing requires a verified seller and a complete disclosure, enforced by a database trigger.
4. **Payments and price sync.** `products.price_cents` is written only by a feed job that does not exist yet, so the UI shows "not yet captured" instead of a stale price.
5. **Comment threads / forum.** Gated behind moderation staffing (see `/community` roadmap).

---

## Project layout

```
app/                     routes (App Router)
  api/                   route handlers (health, newsletter, contact, advertise, sellers)
  knowledge/[slug]/      article template
components/              header, footer, hero, guide rail, ad slot, reveal, cards
lib/
  content.ts             typed seed content + editorial types
  site.ts                brand config, navigation, footer
  supabase.ts            public + admin clients, isLive() mode switch
supabase/migrations/     schema, triggers, RLS policies
scripts/verify.mjs       production smoke test
docs/                    architecture, deployment, editorial policy, OpenArt prompts, QA
```

---

## Editorial rules encoded in code

- An article cannot be published while `review_status = 'unreviewed'` — enforced by `guard_article_publish()` and mirrored in the admin UI.
- `rating_score` is rejected by a check constraint unless a reviewer name and test date are present.
- A listing cannot publish unless its seller is `verified` **and** the health disclosure contains microchip, vaccinations and reason for placement.
- An ad cannot be `live` without a named sponsor and a date window.
- `corrections` is append-only (a trigger raises on UPDATE/DELETE); `audit_log` records every staff write.

---

## Licence / attribution

Photography and film used on this build were generated for the project and are stored in `public/brand/`. Replace them before a public launch if you want a different visual identity — the design does not depend on the specific images.
