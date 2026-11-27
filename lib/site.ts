export const site = {
  name: 'PawVerdi',
  tagline: 'Happy pets. Thoughtful choices.',
  description:
    'Practical, source-linked dog and cat care guides, everyday ideas, and thoughtfully researched gear. Clear review status and commercial disclosures.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pawverdi.com',
  email: 'PawVerdi@hotmail.com',
  launched: '2026-11-02',
} as const;

export const navigation = [
  { href: '/dogs', label: 'Dogs' },
  { href: '/cats', label: 'Cats' },
  { href: '/discover', label: 'Discover' },
  { href: '/knowledge', label: 'Guides' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/deals', label: 'Deals' },
  { href: '/community', label: 'Community' },
] as const;

export const footerGroups = [
  {
    title: 'Learn',
    links: [
      { href: '/dogs', label: 'Dog Center' },
      { href: '/cats', label: 'Cat Center' },
      { href: '/knowledge', label: 'Knowledge Center' },
      { href: '/knowledge#news', label: 'Pet care news' },
      { href: '/journal', label: 'Pet lifestyle journal' },
    ],
  },
  {
    title: 'Buy & adopt',
    links: [
      { href: '/marketplace', label: 'Marketplace' },
      { href: '/marketplace#adoption', label: 'Adoption' },
      { href: '/shop', label: 'Product shop' },
      { href: '/deals', label: 'Verified deals' },
      { href: '/compare', label: 'Compare products' },
      { href: '/discover/published', label: 'Published collections' },
    ],
  },
  {
    title: 'PawVerdi',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/faq', label: 'Frequently asked questions' },
      { href: '/partners', label: 'Partner with us' },
      { href: '/advertise', label: 'Advertise' },
      { href: '/media-kit', label: 'Media kit' },
      { href: '/search', label: 'Search' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms of use' },
      { href: '/accessibility', label: 'Accessibility' },
      { href: '/cookie-preferences', label: 'Cookie preferences' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/trust', label: 'Editorial & safety policy' },
      { href: '/affiliate-disclosure', label: 'Affiliate disclosure' },
      { href: '/advertising-disclosure', label: 'Advertising disclosure' },
      { href: '/editorial-standards', label: 'Editorial standards' },
      { href: '/trust#sellers', label: 'Seller verification' },
      { href: '/contact', label: 'Contact' },
      { href: '/admin', label: 'Staff dashboard' },
    ],
  },
] as const;
