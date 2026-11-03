# QA report — build `0.1.0`

Environment: Linux, Node 26.12.1, Next.js 15.1.6, production build (`next build` + `next start`), Chromium headless for browser checks. Everything below was executed, not estimated.

## 1. Build

```
✓ Compiled successfully
✓ Generating static pages (44/44)
```

| Route | Page JS | First Load JS |
| --- | --- | --- |
| `/` | 3.87 kB | 113 kB |
| `/knowledge` (dynamic) | 603 B | 110 kB |
| `/knowledge/[slug]` (24 SSG paths) | 181 B | 109 kB |
| `/admin` | 181 B | 109 kB |
| shared framework chunk | — | 105 kB |

`tsc --noEmit` exits 0 with `strict: true`.

## 2. Smoke test — `npm run verify`

```
21/21 checks passed
```

16 page checks (status 200 + expected copy present), 4 API behaviour checks, 1 header check:

- `/api/health` → `{ok:true, mode:"demo", articles:24}`
- `/api/newsletter` valid email → `202 {stored:false}` (honest demo response, not a fake success)
- `/api/newsletter` invalid email → `400 {ok:false}`
- `/api/seller-application` valid → `202 {stored:false}` (never creates a listing)
- security headers present: `nosniff`, `referrer-policy`, `x-frame-options`

## 3. Accessibility / semantics (measured in the browser)

| Page | h1 count | images w/o alt | unlabelled buttons | vague link text | landmarks |
| --- | --- | --- | --- | --- | --- |
| `/` | 1 | 0 (12 decorative `alt=""`) | 0 | 0 | header/main/nav/footer |
| `/knowledge` | 1 | 0 | 0 | 0 | header/main/nav×2/footer |
| `/marketplace` | 1 | n/a | 0 | 0 | header/main/nav/footer |
| `/admin` | 1 | n/a | 0 | 0 | header/main/nav/footer |
| `/knowledge/cat-cost-per-year` | 1 | n/a | 0 | 0 | header/main/nav×2/footer |

`lang="en"` on every page. Contrast of the token pairs, computed against `#050807`:

| Token | Ratio |
| --- | --- |
| body cream (100%) | 17.3:1 |
| muted (`cream/84`) | 11.9:1 |
| captions (`cream/62`) | 6.9:1 |
| gold accent | 14.0:1 |

All pass WCAG AA at every size used.

## 4. Responsive

- 1440×900 and 390×844 checked on `/`, `/knowledge`, `/marketplace`, `/admin`.
- `document.scrollWidth > innerWidth` is `false` on every checked page at 390 px — no horizontal overflow, including the breed tables (they scroll inside their own container).
- Mobile nav toggles via a labelled button with `aria-expanded` and `aria-controls`; menu closes on route change.

## 5. Interaction

- Guide rail: pointer drag, dots, prev/next and arrow keys all move the same index; verified programmatically (`deck` transform changes, active card index updates).
- Filters on `/knowledge` are plain links — verified working with the query string (`?species=cat&section=health` returns 200 and a filtered count).
- Newsletter/contact/advertise/seller forms POST to zod-validated handlers; invalid payloads rejected with 400.

## 6. Bugs found and fixed during QA

1. **Invisible `<h1>`.** The first hero used Framer Motion with `initial={{y:'112%'}}`; when hydration stalled the headline stayed translated out of view with no error. Rebuilt the hero as CSS keyframes gated on an inline `js` class, so the copy is visible even if JavaScript never runs. Bundle also dropped from 152 kB to 113 kB first load. Framer Motion was then removed from dependencies because nothing else used it.
2. **Invalid Tailwind opacity steps.** `border-white/12` silently produced no border on filter chips and admin panels; replaced with `/15` across three files.
3. **Admin link in the public header.** Moved to the footer ("Staff dashboard") so the public nav does not advertise an internal route.
4. **Carousel geometry.** Cards were scaled ~1.27× by the perspective translation and overflowed their stage; corrected the deck offset so the active card renders at 1:1 and the stage clips neighbours as intended.
5. **Hero video 404 path.** The first draft pointed at a file that did not exist in `public/`; removed that loader and moved the film into its own band with `mp4` + `webm` sources.

## 6b. Section cinematics (added after review)

Each of the six primary sections renders its own hero treatment from one declarative config (`lib/cinematic.ts`):

| Section | Subject (own 3D render) | Grade | Motion | Decoration |
| --- | --- | --- | --- | --- |
| Dogs | adult Border Collie | warm, near-neutral | 22s ken-burns push | amber beam |
| Cats | adult British Shorthair | cool teal, slight hue shift | 26s horizontal pan | teal radial wash |
| Knowledge | Corgi puppy with books | light archive desaturation | 30s vertical drift | letterbox rules, copy bottom-aligned |
| Marketplace | tabby kitten in a rehoming box | procedural, muted | 18s light sweep | cool beam |
| Shop | Vizsla in a leather harness + props | high-key product | 20s float | conic spotlight |
| Community | owner (from behind) with a dog and kitten | warm, intimate | 20s float | bokeh dots |

All six are server-rendered with CSS keyframes only — no client JS, no hydration dependency, and every animation is switched off under `prefers-reduced-motion`. Verified: each route returns 200 locally and through the tunnel, and `data-variant` matches the expected treatment on all six pages.

Each section now has its own dedicated stylised 3D render in `public/brand/sections/` (generated on OpenArt, Seedream 5 Pro, 6 images = 180 credits). Swapping art means editing the `image` field per variant; the prompt pack in `docs/OPENART-PROMPTS.md` already covers each section.

## 6c. Shop hero crop fix

The shop render is 4:3 while its hero panel is ~2.33:1, so `object-fit: cover` was discarding ~43% of the frame vertically and slicing the top of the vizsla's head. Three changes:

1. Recomposed `public/brand/sections/shop.jpg` to 1920×823 — the exact aspect the panel renders at — with 150px of matched dark background composited above the artwork.
2. Removed the scaling animation from that variant (`motion: 'none'`), because `scale()` overscan crops edges even at 1.01.
3. Removed the plate's negative `inset` bleed site-wide; the keyframes now supply all overscan, so no section can clip the top of its artwork.

Verified after the change: background is visible above the ears, no fur touches the panel edge, all six routes and images return 200, `npm run verify` 21/21.

## 6d. Final art pass (home hero + shop motion)

- **Home hero is now a 3D render** (`public/brand/home-hero.jpg`, Seedream 5 Pro, 30 credits) matching the six section treatments, so the whole site shares one art direction. The photographic film layer was removed from the hero — a live-action loop under a stylised render read as a mistake — and the film band lower down is retained as its own labelled feature.
- The 4:3 render was cropped to 2.33:1 with 150 px of matched dark background composited above the subjects, then upscaled 1152→1920 with a light unsharp pass; heads are intact with headroom.
- **Shop regained motion without touching its framing:** a travelling diagonal light sweep (`::after` gradient, `background-position` animation, screen blend) rather than a `scale()` — a transform would have cropped the edges again, which is exactly the bug fixed in 6c.

## 7. Known limitations (not bugs, decided)

| Item | Status | Why |
| --- | --- | --- |
| Authentication UI | Not shipped | Supabase auth + `profiles`/`is_staff()` policies are in the migration; no login screens. Admin is read-only until then. |
| Article bodies | Not seeded | Titles, summaries, review state and dates are real records; `articles.body` is empty and the page says so instead of inventing text. |
| Marketplace listings | 0 by policy | Publishing is blocked in the database unless the seller is verified and the disclosure is complete. |
| Price column | "Not yet captured" | No price feed job exists; showing a remembered price would be a false claim. |
| Hero film playback | Not verifiable here | This headless Chromium build cannot decode H.264, and reported `readyState 0` for both mp4 and webm. The poster renders correctly, both sources are served with `200`, and the markup uses `muted/playsInline/loop` with a save-data guard. **Verify on a real device.** |
| Lighthouse | Not run | No Lighthouse binary in this environment; the bundle numbers above are from the build output, not a Lighthouse score. |

## 8. Reproduce

```bash
npm ci
npm run typecheck
npm run build
npm start &
npm run verify
```
