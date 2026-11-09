export interface Product {
  id: string;
  name: string;
  category: 'beds' | 'carriers' | 'harnesses' | 'crates' | 'litter' | 'feeding' | 'tech';
  species: 'dog' | 'cat' | 'both';
  merchant: string;
  href: string;
  priceUsd: number | null;
  /** Null until a price has actually been observed at the retailer. */
  priceChecked: string | null;
  affiliate: boolean;
  rating: null | { score: number; reviewer: string; testedOn: string };
}

/**
 * Mirrored from pawverdi-site/config.py, not an account or earnings check.
 * Keep this operator-set flag separate from the tracking ID: a non-empty tag
 * alone must never turn an ordinary retailer link into an affiliate link.
 */
const amazonConfig: { approved: boolean; tag: string } = {
  approved: true,
  tag: 'pawverdi-20',
};

function amazonCategoryLink(query: string): Pick<Product, 'href' | 'affiliate'> {
  const url = new URL('/s', 'https://www.amazon.com');
  url.searchParams.set('k', query);
  const validDestination = url.protocol === 'https:' && url.hostname === 'www.amazon.com'
    && url.pathname === '/s' && Boolean(query) && !url.username && !url.password;
  const affiliate = amazonConfig.approved === true
    && /^[a-z0-9][a-z0-9-]*-\d{2}$/i.test(amazonConfig.tag)
    && validDestination;
  if (affiliate) url.searchParams.set('tag', amazonConfig.tag);
  return { href: url.toString(), affiliate };
}

export const products: Product[] = [
  {
    id: 'pdp-bed-ortho-boucle',
    name: 'Orthopedic dog beds',
    category: 'beds',
    species: 'dog',
    merchant: 'Amazon',
    ...amazonCategoryLink('orthopedic dog beds'),
    priceUsd: null,
    priceChecked: null,
    rating: null,
  },
  {
    id: 'pdp-carrier-topload',
    name: 'Top-loading cat carriers',
    category: 'carriers',
    species: 'cat',
    merchant: 'Chewy',
    href: 'https://www.chewy.com/b/carriers-106726',
    priceUsd: null,
    priceChecked: null,
    affiliate: false, // Source config: approved=false, no tracking ID.
    rating: null,
  },
  {
    id: 'pdp-harness-frontclip',
    name: 'Front-clip dog harnesses',
    category: 'harnesses',
    species: 'dog',
    merchant: 'Amazon',
    ...amazonCategoryLink('front clip dog harnesses'),
    priceUsd: null,
    priceChecked: null,
    rating: null,
  },
  {
    id: 'pdp-litter-highside',
    name: 'High-sided litter boxes',
    category: 'litter',
    species: 'cat',
    merchant: 'Chewy',
    href: 'https://www.chewy.com/b/litter-boxes-413',
    priceUsd: null,
    priceChecked: null,
    affiliate: false, // Source config: approved=false, no tracking ID.
    rating: null,
  },
  {
    id: 'pdp-ebay-dog-bed',
    name: 'Dog beds on eBay',
    category: 'beds',
    species: 'dog',
    merchant: 'eBay',
    href: 'https://www.ebay.com/sch/i.html?_nkw=dog+beds',
    priceUsd: null,
    priceChecked: null,
    affiliate: false, // Ordinary category link; no verified EPN campaign or tracking URL.
    rating: null,
  },
  {
    id: 'pdp-ebay-cat-carrier',
    name: 'Cat carriers on eBay',
    category: 'carriers',
    species: 'cat',
    merchant: 'eBay',
    href: 'https://www.ebay.com/sch/i.html?_nkw=cat+carriers',
    priceUsd: null,
    priceChecked: null,
    affiliate: false, // Ordinary category link; no verified EPN campaign or tracking URL.
    rating: null,
  },
];
