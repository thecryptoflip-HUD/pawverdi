# Editorial, medical and commercial policy

This document is the operating version of what the site says publicly at `/trust`. When the two disagree, the site is wrong and should be corrected to match this document.

## 1. The review ladder

| State | Meaning | Who can set it |
| --- | --- | --- |
| `unreviewed` | Draft. Not eligible for publication. | automatic on create |
| `editorial` | Sourcing, prices and internal links checked by a second editor. Publishes with an "Editorial review" badge. | `editor` or `admin` |
| `vet-reviewed` | A licensed veterinarian has reviewed every clinical claim. Publishes with the reviewer's name. | `reviewer` or `admin`, with a name recorded |

Enforcement: `guard_article_publish()` in the database refuses to publish an `unreviewed` article and refuses `vet-reviewed` without `reviewer_name`. The admin UI disables the same action, so the rule is visible before it is tested.

## 2. Sourcing standard

Acceptable primary sources, in order of preference:

1. Peer-reviewed veterinary literature (PubMed/PMC, journal DOI).
2. Regulators and statutory bodies (FDA, EMA, VMD, APHA, DEFRA, state veterinary boards).
3. Breed health schemes and kennel-club databases (KC, AKC, OFA, BVA/KC/ISDS).
4. Manufacturer specifications — for factual product attributes only, never for efficacy claims.
5. Veterinary practice guidance (e.g. WSAVA, AAHA, ISFM) — acceptable for clinical framing.

Not acceptable: aggregator blogs, affiliate "review" sites, forum consensus, AI-generated summaries, or another outlet's reporting as the sole source for a factual claim.

Every factual claim carries an inline citation at publication; the `article_sources` table is the audit trail.

## 3. Medical content rules

- Educational only. No diagnosis, no dosing, no treatment protocols.
- No dosage tables of any kind. Dosing is species-, weight- and formulation-specific; a generic table is a hazard.
- Emergency signs are separated from routine ones and carry a "contact a vet now" call to action, not a home remedy.
- Any claim about a condition's frequency, prognosis or treatment must be sourced to a veterinary body or a peer-reviewed study.
- Owner experience is labelled as experience, never as evidence.

## 4. Commercial rules

- Every paid placement is rendered by the `AdSlot` component, which prints the "Sponsored" label above the creative. Editors cannot remove it.
- Affiliate links carry `rel="sponsored"` and an inline marker; the disclosure block is part of the page template.
- Commission rate never influences position. When the cheaper product wins, it is published as the winner.
- No advertiser sees copy before publication. Sponsor-supplied assets are limited to the creative inside a labelled unit.
- Advertising refusals (mills, banned breeds, unproven medical claims, deposit scams) are listed publicly at `/advertise` and applied before a rate card is issued.

## 5. Marketplace rules

- Five gates: identity/licence, welfare inspection, health screening, disclosure review, scam-pattern checks. Each gate has a named owner.
- Listings publish only when the seller is `verified` and the disclosure contains microchip, vaccinations and a reason for placement — enforced by trigger.
- Deposits before a viewing are prohibited and are grounds for permanent removal.
- No animal is shipped as cargo.
- Shelter listings are free and untimed; no paid placement may outrank an adoption listing.
- Rejected applications record the gate that failed, and the applicant is told which evidence would change the outcome.

## 6. Corrections

- `corrections` is append-only; a trigger rejects UPDATE and DELETE.
- Each entry records: original claim, correction, source, reviewer, timestamp.
- Safety-affecting corrections are made within 24 hours and announced in the newsletter.
- Articles re-review on a fixed calendar: costs quarterly, health annually or on new guidance, products at 18 months from test date.
