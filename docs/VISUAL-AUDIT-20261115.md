# Approved-design visual audit — November 15, 2026 (Eastern)

Scope: live `https://pawverdi.com/`, `/dogs`, `/cats`, `/knowledge`, `/shop`, `/marketplace`, `/community` compared with the seven user-approved full-page mockups saved November 15. Baseline source: `acd651755b1d46e54979bf62bc9895248277d4a7`.

## Observed differences

| Page | Evidence on the live public domain | Correction |
| --- | --- | --- |
| Home | Dark indoor imagery, broad spacing, large unsold-ad placeholder | Sunny garden art, compact collection/topic/guide rhythm, small labeled advertising availability |
| Dogs | Missing page-specific CSS: 16px H1, block collections, blank hero, 6,475px desktop page | Restored complete responsive hero, collection, topic, article, trust and signup styles |
| Cats | Dog displayed in Cat Gear; dog displayed on published kitten guide; bed used for Grooming; repeated topics and article rows | Species-appropriate images, meaningful topic imagery, one guide/resource row; preserved breed references in an expandable section |
| Knowledge | Dark corgi-and-books cover, repeated featured/search article rows, Grooming filter silently fell back to All | Garden cover, one real searchable guide section, recognized Grooming filter, retained topic/news/review details |
| Shop | Dark hero, long duplicate explanation around categories, filters returned to the cover | Sunny pet hero, generic illustrative gear, visible original disclosures/category table; links target actual filter results |
| Marketplace | Dark kitten-in-a-box cover, extended legacy page after signup, content order differed from reference | Welcoming illustrative people/pets cover; actual zero inventory and seller/adoption/application content retained before trust/signup |
| Community | Dark indoor cover, two newsletter forms, repeated legacy content after signup | Sunny community art, one shared signup close, expandable real submission/roadmap details |
| Shared | Menu button visible below 1280px but its expanded panel hidden at 768px; stretched article link lacked its own positioning context | Matched 1280px breakpoints, scrollable panel, Escape/focus handling, link closes menu, positioned each article card |

All seven desktop pages were inspected at a 1,363px CSS viewport and all seven responsive layouts at a 454px CSS viewport using the actual browser. Phone-width inspection uses browser zoom; it is not hardware-device emulation. Desktop DevTools emulation was unavailable. Baseline horizontal overflow was not observed. Saved baseline screenshots are internal QA evidence, not production page assets.

## Implementation and truthful differences

The result is functional HTML, CSS and interactive forms, not flattened mockup images. Thirteen new AI-generated, optimized WebP assets in `public/brand/garden/` replace the dark stock illustrations. Subjects, scene briefs and intended roles are listed in `garden-assets.json`. These are illustrative generic animals, people and gear; they are not actual available animals, testimonials or reviewed products. Existing assets remain available to older articles.

Three pastel collection cards, five photo topics, real guide/resource cards, a mint trust band, one coral newsletter close and the green footer follow the approved design. Supplementary policies, breed references and application forms remain accessible through native expandable sections and direct fragment links. Knowledge search and shop filters remain visible. Extra navigation resources are labeled as resources, not invented published guides.

The site continues to report two genuine completed guides, zero published animal listings, and pending veterinary review. No mockup-only vet endorsements, fabricated prices, ratings, social accounts, members or animal inventory were copied. Existing affiliate labels, retailer URLs, admin access controls and backend submission logic remain intact. The newsletter now presents truthful inline feedback from the existing API; an unavailable store cannot appear as a successful signup.

## Validation record

The first visual repair shipped through protected PR #14, main commit `00c53b5d040059af011dfb5e5c3ee690ed615648`. Required [CI run 43790097464](https://github.com/thecryptoflip-HUD/pawverdi/actions/runs/43790097464) passed install, TypeScript, production build and all existing tests. Local checks also passed: 31 smoke/security checks, 6 guide/publication tests and 8 shop checks. Vercel confirmed successful production deployment, and the public domain visibly served the new garden assets and layout.

All seven public pages were then scrolled and inspected again at 1,363px desktop and 454px phone widths. Every page had exactly one H1, one newsletter form, zero broken images and no document horizontal overflow. The 779px tablet menu opened all seven links, closed on Escape and restored focus. At 340px, its contents scrolled and choosing Cats closed the menu and navigated correctly. Empty newsletter submission stayed on the page with native required-field validation. These are responsive browser checks, not physical-device or emulated-touch tests.

| Page | Desktop height before | Desktop height after first repair |
| --- | ---: | ---: |
| Home | 3,245px | 2,402px |
| Dogs | 6,475px | 2,426px |
| Cats | 5,129px | 2,365px |
| Knowledge | 5,342px | 2,833px |
| Shop | 4,994px | 3,450px |
| Marketplace | 6,324px | 2,697px |
| Community | 4,276px | 2,351px |

Functional public-domain checks confirmed Carriers leads to the actual one-row filtered results with disclosure present and correct scroll offset. Grooming now reports its real empty result rather than All topics. Final inspection found two additional defects: Next Link fragment navigation did not emit `hashchange`, so links into collapsed references did not open them; and the pre-existing seller form was missing its actual POST target. The follow-up fixes both, adds truthful inline application feedback and regression coverage for form targets/single newsletter counts, and softens the observed vertical seam in the desktop hero artwork. The final live recheck is recorded in the existing Notion PawVerdi project memory.

The managed local preview launcher supplied unsupported Vite flags to Next.js; application code was not changed to compensate. The Vercel preview succeeded but required additional sign-in. Opening a new Vercel integration was rejected by automatic approval review, so no integration, access setting or preview-protection policy was changed. Validation proceeded through the existing protected GitHub/Vercel production workflow and the actual public site. No real newsletter subscriptions or seller applications were submitted as test data; submission API tests used an isolated local server with no database configuration.
