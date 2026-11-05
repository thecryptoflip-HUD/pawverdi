# Release scope: complete checklists and truthful shop links

Owner requested corrections and explicitly approved publishing in Telegram.

## Included

- Two full, server-rendered checklists: preparing for a puppy and a kitten. Sources are linked inline; neither guide claims independent veterinary review or hands-on product testing.
- Homepage, dog/cat article selections and Knowledge Center distinguish complete guides from unfinished topics.
- Topic previews remain accessible, but have `noindex, follow`, no Article structured data, and no sitemap entry.
- Shop category links and affiliate labels are explicit. No prices, reviews or check dates are invented.
- Regression tests accompany the existing smoke suite.

## Deliberately not changed

- No Supabase migration, account provisioning, credentials, DNS, domain connection or hosting settings.
- No marketplace listings, payments, advertising commitments, paid API use or fabricated reviews.
- No assertion of actual affiliate approval, commissions, traffic or search indexing. A tracking parameter proves configuration, not an account's standing or an earned commission.
- The remaining topic previews are not complete articles. Content expansion and analytics are separate follow-up work.

## Release procedure

1. Pass TypeScript, production build, existing demo-mode smoke tests and correction-specific regressions.
2. Review the actual staged diff independently. Fix blocking findings before committing.
3. Push a correction branch and use a pull request; do not bypass `main` protection.
4. Verify required CI and merge only the reviewed commit. The owner's “Publish it” authorises this release, not future unattended publishing.
5. Read back the deployed pages, sitemap, source links and merchant tracking. Production verification uses read-only requests; demo form submissions are not replayed against the live database.

## Rollback

Before release the production deployment is `dpl_5x8eM7t9Sph1GHyhLnsUpKXQTfxH` (`pawverdi-d91tabutl-paw-verdi.vercel.app`), read directly from Vercel. If this release fails live checks, promote that known-good deployment back rather than editing DNS or reverting production environment variables. Use a separate revert pull request if a repository rollback is also needed. Never use `git reset --hard` on the owner's checkout.

Test results and the final deployment handle are recorded after execution in the release report.
