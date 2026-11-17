# Distinct pet photographs — November 17, 2026

The seven public hubs previously reused 17 photographs across 91 placements. Ray requested a different dog or cat picture in every section, without the same picture recurring throughout the site.

Each of those 91 placements now owns a distinct image. Six existing generated PawVerdi assets are retained once each; 85 new illustrations introduce varied breeds, coats, ages and relevant care scenes. Home, Dogs, Cats, Knowledge, Marketplace and Community have distinct collection, topic, resource/guide, hero and newsletter imagery. Shop also has separate pictures for its four retailer category cards. Images remain illustrative and do not represent available animals, customer stories or tested retail products.

`lib/pet-photography.json` maps placement IDs to their image paths and descriptions. `docs/pet-photography-20261117.json` records the complete generation prompts, source provenance and final file hashes. Generated assets live in `public/brand/pets/`, with Shop category files in `public/brand/garden/`. Future guides can omit a photograph until a new illustration is assigned instead of silently reusing a default puppy or kitten image.

The approved cream, emerald, mint and coral visual system is retained. Card and newsletter crops are adjusted to suit the new subjects. Existing guide content, publication status, forms, retailer destinations, disclosures and tracking settings are preserved.

The live desktop review found that the bed category still referenced its prior image and that wide guide/resource crops clipped some ears. The follow-up wires the bed card to its assigned Clumber Spaniel illustration, raises guide/resource crops, and checks that rendered paths exactly match the full placement catalogue.

## Acceptance

The photography check reads the actual rendered HTML of all seven hubs, including hero backgrounds. It requires all 91 assigned images to load, rejects repeated URLs across pages, and hashes downloaded image bytes to catch identical files under different names. It runs with the existing 50 checks, for 54 checks in total.

On November 17, `npm run typecheck`, `npm run build` (48 routes) and all 54 checks in `npm run verify` passed against a local production server. All seven image contact sheets were visually reviewed. The 91 optimized assets total 4,920,146 bytes. Public desktop and phone-width visual acceptance is recorded with the release after deployment; the managed local preview could not start because its injected `--host` flag is unsupported by Next.js.
