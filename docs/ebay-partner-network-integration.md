# PV-EBAY-001 — eBay Partner Network integration gate

Status: prepared; not launched. Date: 2026-11-05. Budget: $0.

## Confirmed evidence

- Onboarding email describes how to create EPN campaigns and generate links.
- Email does not confirm account approval, completed payments/tax setup, or a working EPN link.
- Existing PawVerdi shop has four category rows: two Amazon affiliate links and two ordinary Chewy links.
- Existing shop tests assert four rows and exact affiliate disclosures.

## Implementation requirements

1. Create an EPN campaign within the official portal, ideally `pawverdi-shop`; record only the campaign name/ID and an approved generated example URL. Never store payment or tax details in the repository.
2. Add eBay search/category retailer rows, initially with `affiliate: false` and ordinary https://www.ebay.com destinations. Do not claim product reviews, prices, special offers, or tracked earnings.
3. Only replace ordinary URLs with EPN-generated tracked URLs after operator validation of account status, destination, approved promotion channels, and tracking.
4. Extend shop disclosure text to say when eBay links are tracked and label each row accordingly. Retain Amazon disclosure as-is.
5. Update the count from four to a derived product count and expand `scripts/test-shop.mjs` to validate links, safety attributes, untracked defaults, and disclosure.
6. Execute `npm run typecheck`, `npm run build`, and `npm run verify` in an isolated environment. Require quality-review approval before opening a publication PR.

## Acceptance criteria

- No invented campaign IDs, tracking identifiers, commissions, product prices, or product ratings.
- Every ordinary eBay link is visibly untracked; every monetized eBay link has evidence and disclosure.
- Four existing retailer links still behave the same.
- CI is green and manual QA has reviewed the published page before claiming live integration.

Next owner: PawVerdi partnerships manager to validate account and obtain first generated eBay link; engineering follows after evidence is available.
