# PawVerdi Design Completion Pass — 2026-11-15

The user has approved a colorful Golden Retriever inspired visual direction. This pass finishes the **homepage's functional layout**, replacing old dark cinema sections and duplicated forms with a cohesive warm cream, mint, yellow, coral and emerald public interface.

## User-visible changes
- Hero remains a full-width photographic panel with real copy, CTAs and transparent care claims, now drawing from existing `/brand/home-hero.jpg` instead of the collie-only `/brand/sections/dogs.jpg` photo. This still reuses pre-existing site-controlled media; the generated mockup's Golden Retriever composition is not available as a clean deployable source photo.
- Three pastel entry cards (Puppy Care, Daily Care, Pet Gear).
- Five colorful pet topics, each linked to a real guide filter or Cat Center.
- Featured **published** guide cards using `completeArticles`, with exact existing title, date, sources and review status (no invented veterinary endorsements or new publication claims).
- Mint trust strip with transparent status (vet review still in progress).
- Coral monthly signup with the existing newsletter API, and one clearly disclosed ad slot.
- Removed legacy dark ticker/film and redundant newsletter sections from Home.
- Header breakpoint fixed: mobile menu and primary nav change together at `xl`, and mobile navigation offers a real link to Community rather than a dead-end CTA.
- Public editorial routes, admin security and affiliate disclosures are preserved.

## Verification
GitHub TypeScript, Next production build and smoke tests must pass. Then review Vercel preview, protected merge and Vercel deployment status. User's actual browser needs to confirm public appearance; a deployment success alone does not verify pixel matching.
