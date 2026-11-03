export const site = {
  name: 'PawVerdi',
  tagline: 'What your pet actually needs. And what it costs.',
  description:
    'Independent, research-based pet knowledge for dog and cat owners: costs, health, nutrition, training, grooming and honestly-reviewed gear.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pawverdi.com',
  email: 'PawVerdi@hotmail.com',
  launched: '2026-11-02',
} as const;

export const navigation = [
  { href: '/dogs', label: 'Dogs' },
  { href: '/cats', label: 'Cats' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/shop', label: 'Shop' },
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
    ],
  },
  {
    title: 'Buy & adopt',
    links: [
      { href: '/marketplace', label: 'Marketplace' },
      { href: '/marketplace#adoption', label: 'Adoption' },
      { href: '/shop', label: 'Product shop' },
      { href: '/advertise', label: 'Advertise' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/trust', label: 'Editorial & safety policy' },
      { href: '/trust#disclosure', label: 'Affiliate disclosure' },
      { href: '/trust#sellers', label: 'Seller verification' },
      { href: '/contact', label: 'Contact' },
      { href: '/admin', label: 'Staff dashboard' },
    ],
  },
] as const;
