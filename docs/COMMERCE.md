# Operating the PawVerdi catalog

Visitors browse six collections at /discover. Each guide is identified as a category guide; manufacturer-sourced products include their source and check date. Select up to four items for /compare. Published records with the same slug replace the corresponding built-in listing.

## Publish a merchant product or offer

1. Create a product or deal draft in the publishing dashboard. Enter the merchant, species, category, source copy and HTTPS destination. Use the official confirmed product page.
2. For a product, add a brand and USD price only when checked against the merchant. The public display suppresses prices after 24 hours. For a deal, enter the merchant’s actual expiration with its time zone.
3. Include the appropriate commercial disclosure before sending the draft for review. Obtain current affiliate approval before including tracking parameters.
4. A reviewer approves and publishes the record. Published products appear in discovery. Published, verified, unexpired deals appear at /deals. The redirect rechecks the record at click time, including expiration.
5. To pause an offer, archive it through the dashboard. Product or campaign URLs may contain reviewed, merchant-approved UTM parameters. The redirect preserves the approved destination and does not accept a visitor-supplied redirect target.

The legacy Amazon category links use the previously configured pawverdi-20 tag **only** when the operator explicitly sets PAWVERDI_AMAZON_APPROVED=true after confirming their account status. The default is off. Chewy category links are ordinary retailer links.

## Book a campaign

Use the campaign kind, put the placement identifier in Category, name the paying merchant, and add a disclosure, sponsor copy, destination and expiry. The public placement renders the first approved active campaign in featured/update order. Supported placements include home-inline-01, dogs-inline-01, shop-inline-01 and marketplace-inline-01. Only one campaign appears per placement. A viewable impression is recorded when at least half of the placement enters the viewport, once per mounted placement.

## Reporting

Apply the repository migrations to your authorized Supabase project in filename order. /admin/performance shows 30-day event counts by item, merchant and referring site section. Clicks and impressions are opt-in through /cookie-preferences, and DNT or Global Privacy Control prevents collection. For consented visitors, a landing URL such as /discover?utm_campaign=winter-walks attributes subsequent visits in the same browser session to the published, active campaign with that exact slug. Unknown UTM values and other UTM parameters are ignored. The last valid campaign wins. PawVerdi stores only the approved slug in a first-party session cookie, rechecks campaign status before counting an event, and clears the cookie when consent is withdrawn. The report keeps inbound campaign and referring section in separate columns.

No IP addresses, customer IDs or raw referrer URLs are stored in the event table. Counts are observations, not unique visitors or proof of a sale.

Administrators may enter aggregate USD conversions and commissions from actual merchant statements. Keep buyer information out of the reference. Reusing a merchant/date/reference is rejected to prevent double counting. The report shows statements separately from web events.

## Local verification

- node scripts/test-commerce.mjs starts its own local test fixture and Next dev process. Run from a separate checkout or after stopping the dev server to keep build outputs isolated.
- node scripts/test-commerce-db.mjs uses ephemeral PostgreSQL to exercise permissions, aggregate reporting and duplicate statement protection.
- node scripts/test-shop.mjs verifies catalog disclosures for the active deployment configuration. Use matching PAWVERDI_AMAZON_APPROVED settings when testing against a running instance.
