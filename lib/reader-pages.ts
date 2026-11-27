export interface ReaderPage {
  title: string;
  intro: string;
  sections: [string, string][];
  links: [string, string][];
}

export const readerPages: Record<string, ReaderPage> = {
  about: {
    title: 'About PawVerdi',
    intro: 'A field guide to everyday life with pets, from the first night at home to choosing gear that fits your routine.',
    sections: [
      ['For readers', 'Start with a care checklist or a buying guide. Complete research-based guides include their sources, review status and update date so you can judge how the advice fits your household.'],
      ['How PawVerdi is funded', 'The site makes room for labelled advertising and affiliate links. Commercial relationships are disclosed beside the relevant placement. A retailer link alone does not establish a partnership.'],
    ],
    links: [['Read the guides', '/knowledge'], ['How we cover pet care', '/editorial-standards']],
  },
  faq: {
    title: 'Frequently asked questions', intro: 'Answers about shopping links, guides, advertising and your information.',
    sections: [
      ['Where do I buy an item?', 'Follow the retailer link on a shortlist. The merchant handles checkout, shipping, returns and order questions. Check the listing for the current price and size before placing an order.'],
      ['How can I tell if a link earns commission?', 'Look for the affiliate disclosure next to the link. Ordinary retailer links are identified separately.'],
      ['Who reviews the guides?', 'Each guide shows its review status. A veterinary review requires a named reviewer. You can inspect the sources at the end of a research-based guide.'],
      ['How do I stop newsletter updates?', 'Contact PawVerdi using the privacy topic and the email address you subscribed with.'],
      ['How do I correct a guide?', 'Use the corrections topic on the contact form. Include the page address, the passage you are concerned about and any supporting source.'],
    ],
    links: [['Contact PawVerdi', '/contact'], ['Manage cookies', '/cookie-preferences']],
  },
  privacy: {
    title: 'Privacy policy', intro: 'How PawVerdi uses information you choose to share.',
    sections: [
      ['Forms and subscriptions', 'Newsletter signup collects an email address. Contact and partnership forms collect your contact details and message so PawVerdi can respond. Seller applications collect the details requested on the form for review. Avoid putting sensitive records in a message.'],
      ['Service providers', 'When configured, Supabase stores form submissions and provides staff authentication. The hosting provider processes connection information to deliver pages. Retailers handle information you give them after leaving PawVerdi.'],
      ['Optional measurement', 'You can allow or decline optional analytics. On the production site, allowing analytics enables Google Analytics with advertising personalization disabled. With your permission, PawVerdi may also keep a campaign identifier during the browser session to measure referrals. Your preference applies to this browser.'],
      ['Your requests', 'Use the privacy topic on the contact page to request access, correction, removal of submitted information or newsletter removal. Include the email address associated with the request.'],
    ],
    links: [['Change cookie preferences', '/cookie-preferences'], ['Contact PawVerdi', '/contact']],
  },
  terms: {
    title: 'Terms of use', intro: 'Using the PawVerdi website and its editorial, directory and shopping features.',
    sections: [
      ['Using our content', 'Use the guides for general information. For advice specific to an animal’s health or treatment, consult a licensed veterinarian.'],
      ['Retailer transactions', 'Before buying, check the merchant’s current price, product specifications, availability, return policy and shipping terms. Purchases are completed with the merchant. Contact the merchant about an order.'],
      ['Submissions', 'Submit accurate information that you have permission to share. Do not submit private documents through the general contact form. PawVerdi reviews editorial, listing and advertising proposals before publication.'],
      ['Questions about these terms', 'Contact PawVerdi with the page address and a description of the issue so the team can investigate.'],
    ], links: [['Contact', '/contact'], ['Privacy policy', '/privacy']],
  },
  'affiliate-disclosure': {
    title: 'Affiliate disclosure', intro: 'Some shopping links can earn PawVerdi a commission when a reader makes a qualifying purchase.',
    sections: [
      ['At the link', 'Look for the affiliate label before visiting a merchant. Ordinary retailer links carry no PawVerdi affiliate identifier. A commission does not increase the price charged by the merchant.'],
      ['How we compare', 'Our guides look at dimensions, care requirements, household routines and the information a merchant supplies. Check the retailer for final specifications and current price.'],
      ['Questions about a listing', 'Send the link and describe the issue. We can review incorrect labels, changed destinations or a price discrepancy.'],
    ], links: [['See the shortlist', '/shop'], ['Report a listing', '/contact']],
  },
  'advertising-disclosure': {
    title: 'Advertising disclosure', intro: 'How to recognise a paid placement on PawVerdi.',
    sections: [
      ['Labels', 'Paid placements must display an advertising or sponsorship label next to the creative. Editorial coverage and retailer listings have their own disclosures.'],
      ['Independence', 'Purchasing a placement does not buy a favourable review, a clinical endorsement or a position in an editorial comparison.'],
      ['Reporting a concern', 'Contact PawVerdi with the placement location and any concern about the label or claim.'],
    ], links: [['Advertising formats', '/advertise'], ['Editorial standards', '/editorial-standards']],
  },
  'editorial-standards': {
    title: 'Editorial standards', intro: 'What readers can check before relying on a PawVerdi guide.',
    sections: [
      ['Sources and dates', 'Published research-based guides include links to the underlying guidance and an update date. Draft topics are marked in preparation.'],
      ['Review and authorship', 'A named veterinary reviewer is required for a veterinary review credit. AI-assisted preparation is disclosed in guides where applicable. A photograph or editorial illustration is not proof of hands-on product testing.'],
      ['Corrections', 'Send the page address, the disputed statement and a supporting source using the corrections topic. Substantive changes to recommendations should be explained in a dated correction.'],
    ], links: [['Full editorial and seller policy', '/trust'], ['Submit a correction', '/contact']],
  },
  accessibility: {
    title: 'Accessibility statement', intro: 'PawVerdi aims to make pet care information usable with a keyboard, screen reader or touch device.',
    sections: [
      ['Navigating the site', 'Use the skip link to reach the main content. Form controls have text labels. Where an animation supports reduced motion, the site follows your device preference.'],
      ['Report a barrier', 'Please share the page address, what you were trying to do and the browser or assistive technology you used. Contact PawVerdi if you need information in another format.'],
    ], links: [['Report an accessibility issue', '/contact']],
  },
  partners: {
    title: 'Partner with PawVerdi', intro: 'Bring a relevant pet brand, merchant or editorial collaboration to our team for review.',
    sections: [
      ['Affiliate programmes', 'Include the merchant website, product categories, geographic availability and proposed programme terms. Links and commission arrangements require approval before activation.'],
      ['Sponsored placements and brand collaborations', 'Describe the audience, dates, creative format and claims in your proposal. Paid placements need a visible disclosure. Sponsorship does not grant control over an editorial recommendation.'],
    ], links: [['Submit a partnership enquiry', '/advertise#enquire'], ['View the media kit', '/media-kit']],
  },
  'media-kit': {
    title: 'PawVerdi media kit', intro: 'Placement information for advertising and partnership proposals.',
    sections: [
      ['Audience and subjects', 'PawVerdi serves readers researching pet care, adoption, household routines and shopping decisions. Editorial formats include practical checklists and buying guides.'],
      ['Creative formats', 'Proposals may include a section banner, inline creative, a featured listing or a newsletter sponsorship. Availability, dates and commercial terms are confirmed during review.'],
      ['Prepare a proposal', 'Send a brand URL, contact email, campaign goal, proposed dates, creative dimensions and evidence supporting product claims. Request current availability or verified audience figures in your enquiry.'],
    ], links: [['Discuss a placement', '/advertise#enquire'], ['Advertising disclosure', '/advertising-disclosure']],
  },
};
