# Architecture

## Shape

```
Browser ──► Next.js 15 (App Router, RSC)
              │
              ├─ static routes prerendered at build (44 routes)
              ├─ /knowledge is dynamic (reads ?species=&section=)
              ├─ route handlers in /app/api/* validate with zod
              │
              └─► Supabase (Postgres + Auth + Storage)
                    ├─ row-level security for every table
                    ├─ triggers enforce publishing rules
                    └─ storage buckets for article hero images
```

Stateless front end (deploy anywhere: Vercel, Netlify, a Node box, Docker). All state lives in Supabase, so a redeploy never loses content.

## Two modes, one codebase

`lib/supabase.ts` exposes `isLive()`. When the Supabase env vars are absent:

- reads come from `lib/content.ts` (typed seed data),
- writes return HTTP 202 with `stored: false` and a plain-English reason,
- the admin page shows a "demo" banner.

This exists because the alternative — silently swallowing writes — teaches an operator to trust a dashboard that is not saving anything. Every form in the UI therefore states which mode it is in.

## Content model

| Table | Purpose | Key rules |
| --- | --- | --- |
| `profiles` | staff roles (`reader/editor/reviewer/admin`) | created by trigger from `auth.users`; role never settable from the client |
| `articles` | guides | cannot publish while `review_status='unreviewed'`; `vet-reviewed` requires `reviewer_name` |
| `article_sources` | citations per article | cascade delete with the article |
| `breeds` | reference entries | public read |
| `products` | shop shortlist | `rating_score` requires reviewer + test date; price requires a check timestamp |
| `sellers` | verified businesses | `verified` requires `verified_at` + `verified_by` |
| `listings` | animals | publish blocked unless seller verified **and** disclosure has microchip/vaccinations/reason |
| `ads` | campaigns | `live` requires sponsor + start/end window |
| `corrections` | correction log | append-only (trigger raises on update/delete) |
| `audit_log` | staff write trail | every insert/update/delete on articles, listings, ads, sellers |
| `newsletter_subscribers`, `contact_messages`, `ad_enquiries`, `seller_applications` | inbound | insert open to anon, read staff-only |

## Why the rules live in the database

A UI can be bypassed by an API call, a forgotten code path, or a future admin panel written in a hurry. Publishing rules that matter for animal welfare belong where every write has to pass: `guard_article_publish()`, `guard_listing_publish()` and the `rating_requires_evidence` / `live_needs_sponsor` constraints.

## Rendering and performance

- Home, dogs, cats, shop, marketplace, advertise, community, trust, contact, admin: **statically prerendered**.
- Article pages: **SSG** via `generateStaticParams` (24 paths today).
- Knowledge index: server-rendered on demand because it reads search params; filters are plain links, so they work with JS disabled and are crawlable.
- No client-side data fetching on first paint. The heaviest client island is the guide rail (~4 KB gzipped plus the shared 113 KB framework chunk).
- Hero copy is CSS-animated, not JS-gated: if hydration fails, the headline is still visible. This was a deliberate change after a hydration stall produced an invisible `<h1>` in testing.

## Search and SEO

- `app/sitemap.ts` emits every static route plus all article URLs with their real `updated` dates.
- `app/robots.ts` disallows `/admin` and `/api/`.
- Article pages emit `Article` JSON-LD; `reviewedBy` appears **only** when a vet reviewer is recorded.
- Canonical URLs are derived from `NEXT_PUBLIC_SITE_URL`.
- Security headers (`nosniff`, `frame-options`, `referrer-policy`, `permissions-policy`) are set in `next.config.ts`.

## Failure modes considered

| Failure | Behaviour |
| --- | --- |
| Supabase unreachable | pages still render from seed content; forms return a clear error, not a fake success |
| JS bundle blocked | hero copy, articles, tables and filters all work; only parallax and the 3D rail degrade (rail falls back to a `<noscript>` list) |
| Slow connection | hero film skipped on save-data/2G; still image is the LCP |
| Reduced motion | all animation disabled, including the film |
| Missing price feed | shop shows "not yet captured" instead of a stale number |
