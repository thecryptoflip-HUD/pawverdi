# PawVerdi release handoff

## Review the build

Use Node.js 22 and npm. Extract the project before running it. On Windows, run `Start-PawVerdi.cmd`. On macOS or Linux, run `npm ci`, `npm run build`, then `npm start -- --hostname 127.0.0.1` and open http://localhost:3000. For development, use `npm run dev`.

This is the Next.js GitHub/Vercel application. The separate, older Sites project has its own repository and deployment history. The source of record for this release is thecryptoflip-HUD/pawverdi.

Start at the home page to try the pet reel and pointer-responsive hero. Follow **Discover** to filter by pet, search the catalogue and compare items. Explore the journal, shopping guides, media kit and inquiry forms. Open cookie preferences to control analytics. Inputs submitted with no Supabase configuration run in preview mode and do not enter an operations queue.

## Administrator guide

1. Use an isolated staging Supabase project for acceptance. Set the public URL, public key and server-only credential in your host's environment. Apply every SQL migration in filename order. Provision named staff accounts through Supabase Auth and assign the minimum required profile role.
2. Sign in at `/admin/login`. Create a draft and enter a unique lowercase slug, title, summary and content. Use the summary for the search description. Assign the species, subcategory, merchant and destination where relevant.
3. Move the item to review. A reviewer or administrator checks the merchant destination, commercial disclosure and expiry before publishing. Inspect it in the public catalogue. Verify a featured item's home placement.
4. Return published material to draft for revision, or archive it. Refresh the editor if another staff member has changed the record. Check the audit trail under an administrator account.
5. Use the operations inbox for subscriber records, contact messages, advertising inquiries and seller applications. Verify receipt in staging with a controlled email address. Arrange delivery through an approved email provider before promising readers timed newsletters.
6. Inspect consented click and impression reports when enabled. Reconcile conversion or payout claims against merchant reports.

## Launch checks

- [ ] Confirm the canonical staging domain, secrets and backups. Review row-level access for public, reader, editor, reviewer and administrator roles in the deployed Supabase project.
- [ ] Complete a real staging sign-in, publication, archive, contact and newsletter round trip. Confirm persisted records across reload and sign-out, exercise expiry and verify consent behavior.
- [ ] Confirm current affiliate approval and the exact merchant-generated destination before enabling an affiliate tag. Keep expired or unverified offers out of the public feed.
- [ ] Complete the original Higgsfield production and visual review. See `higgsfield-production.json` for requests, outcomes and inherited asset inventories.
- [ ] Review consumer disclosures, privacy handling, rights and actual data processors. Confirm administrative ownership, email delivery, and support coverage.
- [ ] Review the release tests and outstanding measurements. Check the deployed staging application on physical devices and validate any live integrations.
- [ ] Obtain the owner's approval before releasing to production. Keep the previous deployment available for rollback. Database migrations require their own backup and rollback review.

## Evidence

See the [release verification report](RELEASE-VERIFICATION.md) for tests performed on this source. Historical QA documents describe earlier releases. Dependency and media inventories are in this directory. The lockfile pins the build.
