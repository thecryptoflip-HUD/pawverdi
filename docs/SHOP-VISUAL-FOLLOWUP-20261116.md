# Shop visual follow-up — November 16, 2026 UTC

The approved Shop reference leads with distinct category photography and useful cards. The live implementation still repeated one generic gear image across collections and topics, followed three generic resources with a wide table as its primary retailer browsing area.

## Result

- Four image cards now lead category browsing, using the existing bed, carrier, harness and litter records. Each offers practical comparison criteria, a named retailer destination and a nearby commercial-link label.
- Distinct category illustrations replace the repeated gear image in Shop collections and topics. The images are explicitly described as AI-generated illustrations, not actual retailer products or tested recommendations. Asset hashes are in `garden-assets.json`; the complete generation prompts are in `gear-asset-prompts.json`.
- The existing six-column comparison table and truthful price/review states remain inside an expandable, keyboard-scrollable comparison. Species/category filters drive both views, including the genuine empty state and reset path.
- Existing Amazon tracking tags and untracked Chewy destinations are preserved. The Amazon disclosure precedes all commercial browsing cards, with additional disclosure beside each card link. No offers, prices, ratings or account status were invented.
- Removed a duplicated sentence from the Home newsletter introduction.

## Validation before publication

TypeScript, production build and all 50 checks passed: 31 smoke/security checks, eight guide/publication/form checks and 11 Shop checks. New checks verify category image availability, card/table destination and disclosure consistency, filtered and empty states, and the retained comparison region. External retailer links were inspected as URLs without producing affiliate clicks. Live visual acceptance follows the protected deployment.

## Scope

This realizes the approved composition using truthful current inventory. It does not create tested product picks, listings or testimonials from the reference artwork. New images are illustrative brand assets, not retailer-supplied photographs. Affiliate account approval, commission attribution and earnings are outside these automated checks.

## Production acceptance follow-up

Live desktop and 454px phone-width checks caught inherited CSS overriding the new action and selected-filter colors. The correction in PR #17 restores white text on the green buttons and active filters, with a measured rendered contrast of 7.41:1. All four retailer card destinations retain their original tracking states. The owner independently reported the same contrast defect during this check.

The disclosure shortcut now has the same 96px fixed-header clearance as the filter target. Card arrows use an inline SVG to avoid platform-dependent missing glyphs. Six other public hubs were rechecked at 1363px desktop and 454px phone widths: each retained one H1, one newsletter form and no document overflow. Mobile menu opening, Escape closing and focus restoration also passed. Responsive checks use browser zoom rather than physical-device emulation; the existing full seven-page visual audit remains the broader baseline.
