import { petPhoto, petPhotoAlt } from '@/lib/pet-photography';

export interface Product {
  id: string;
  name: string;
  category: 'beds' | 'carriers' | 'harnesses' | 'crates' | 'litter' | 'feeding' | 'tech';
  species: 'dog' | 'cat' | 'both';
  merchant: string;
  href: string;
  image: string;
  imageAlt: string;
  description: string;
  considerations: [string, string, string];
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
  approved: process.env.PAWVERDI_AMAZON_APPROVED === 'true',
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
    image: petPhoto('shop-category-beds'),
    imageAlt: petPhotoAlt('shop-category-beds'),
    description: 'Start with your dog’s sleeping space and the care the bed will need.',
    considerations: ['Sleeping area and entry height', 'Removable, washable cover', 'Return and warranty terms'],
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
    image: petPhoto('shop-category-carriers'),
    imageAlt: petPhotoAlt('shop-category-carriers'),
    description: 'Compare access, dimensions and ventilation before choosing a carrier.',
    considerations: ['Internal size and pet weight limit', 'Top access and secure closures', 'Ventilation and cleaning access'],
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
    image: petPhoto('shop-category-harnesses'),
    imageAlt: petPhotoAlt('shop-category-harnesses'),
    description: 'Use your dog’s measurements and the maker’s fitting instructions.',
    considerations: ['Neck and chest measurements', 'Front attachment and adjustment', 'Manufacturer fitting instructions'],
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
    image: petPhoto('shop-category-litter'),
    imageAlt: petPhotoAlt('shop-category-litter'),
    description: 'Look at usable space, entry height and everyday cleaning needs.',
    considerations: ['Tray dimensions and entry height', 'Space for turning and digging', 'Material and cleaning instructions'],
    priceUsd: null,
    priceChecked: null,
    affiliate: false, // Source config: approved=false, no tracking ID.
    rating: null,
  },
];
