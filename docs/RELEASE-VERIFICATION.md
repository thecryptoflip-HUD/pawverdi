# PawVerdi release verification — November 27, 2026

The production configuration was exercised on loopback in a clean Linux checkout with Node 24.22.3, Next.js 15.5.29 and no production credentials. Browser checks used Chromium 158. No test submitted data to PawVerdi's public website or merchants.

| Check | Observed result |
| --- | --- |
| Production compilation | Next compiled the application, checked TypeScript and generated 63 prerendered pages. Dynamic endpoints were also built. |
| Existing regression suite | 31 HTTP and security-header checks, nine editorial checks, 11 shopping checks and four photographic catalogue checks passed. The image checks fetched all 91 existing photo placements. |
| Public navigation | 54 sitemap entries, 161 distinct reachable local paths, 319 internal fragment targets and 89 distinct image URLs (including responsive sources) checked. No missing local targets or image alt attributes found. External destinations were excluded from the crawl. |
| Interactive hero | Mouse at 1440px, touch at 768px, 390px and 320px. Verified depth response, reset after interaction, reduced-motion fallback and no horizontal viewport overflow. |
| Reader journeys | Chromium submitted a species-filtered gear search, selected an item for comparison, found an aquarium lighting entry through global search, displayed the empty verified-offer state and persisted consent and withdrawal. No page exceptions or console errors in those journeys. |
| Editorial and enquiries | Browser checked support pages, journal, global search, contact and advertising submissions. Offline forms retained typed input and correctly reported that receipt was unavailable. Invalid requests returned HTTP 400. |
| Private media | Four multipart handler tests passed with in-memory identity and storage adapters, including authenticated upload, stale revisions, cleanup on failure, format and size limits, and denied reader access. |
| Signed-in end-to-end | Chromium signed in through real local GoTrue against disposable PostgreSQL and PostgREST. A contact submission persisted, the administrator read and triaged it, and the database recorded the change. Staff created, reviewed, published and archived an entry through the dashboard. Anonymous reads exposed it only while published. Sign-out restored the protected route redirect. Storage object tables were present for migration testing. The separate Storage service was simulated in upload tests. |
| Database workflow | Ephemeral PostgreSQL verified editorial role restrictions, publication and archival, expiry, optimistic revision, auditing, form intake throttling and access control. Clicks and impression totals were readable by staff. Only administrator-role identities could record merchant statements, and duplicate entries were rejected. |
| Commerce fixtures | Local PostgREST fixtures exercised approved offer destinations, hidden expired and unverified offers, consent and Global Privacy Control handling, sponsored placements, event recording and restricted report access. No retailer transaction took place. |

## Homepage Lighthouse run

A single local run per profile provides a reproducible reference, not live traffic measurements. Lighthouse 12.8.2 ran with its default simulated mobile throttling and the desktop preset. Scores vary with server latency, CPU load and browser versions.

| Profile | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 94 | 100 | 100 | 100 |
| Desktop | 99 | 100 | 100 | 100 |

The homepage met all four target scores in both profiles. Largest Contentful Paint was 3.0 seconds on mobile and 1.0 second on desktop. Automated accessibility checks cover a subset of WCAG success criteria. Physical-device, assistive-technology and public staging checks remain outstanding.

## Reproduce

1. Install dependencies with `npm ci` in a fresh checkout, then run `npm run build`. A previously used build directory can retain stale prerendered route-cache entries. Use a clean workspace for release testing.
2. On a Unix-like system with Python 3, run `bash scripts/verify-production.sh` to start a local production server, exercise the HTTP suite, crawl its navigation and shut it down. Use a test environment with no real database credentials.
3. Run `npm run test:cms`, `node scripts/test-intake-db.mjs` and `node scripts/test-commerce-db.mjs` for isolated database exercises. Run `node scripts/test-commerce.mjs` from a separate checkout because its local dev server writes its own build directory.
4. For interactive tests, run the production server locally. Provide its origin in `BASE`, and a Chromium executable in `CHROME_PATH`. With Puppeteer Core available to the QA environment, run `node scripts/test-reader-flows.mjs` and `node scripts/test-hero.mjs`. Set `PUPPETEER_MODULE` to the absolute ES module path if installed outside the project. `QA_SHOTS` optionally saves homepage screenshots. The contact form browser test uses Python Playwright and `PAWVERDI_OFFLINE_TEST=1` against an isolated local server without credentials.
5. With Lighthouse installed in a QA environment, run `lighthouse http://127.0.0.1:3000 --only-categories=performance,accessibility,best-practices,seo`. Repeat with `--preset=desktop`.

## External acceptance

A real staff sign-in with a hosted identity, media transfer against hosted Storage, persistent subscriber delivery, merchant conversion reconciliation, public domain performance and rights for new Higgsfield creative must be checked before launch. The current generation entitlement blocked the requested new creative. See the asset inventory and release handoff.
