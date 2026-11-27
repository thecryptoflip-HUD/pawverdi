import type { PublishedMediaDetails } from '@/components/published-media';
import { manufacturerItems } from "@/lib/manufacturer-products";
import { products } from "@/lib/shop";
import { readPublicEntries } from "@/lib/publication";

export const collections = [
  {
    slug: "dogs",
    code: "dog",
    name: "Dogs",
    intro:
      "From a quiet corner to the daily walk, start with fit, space and cleaning.",
  },
  {
    slug: "cats",
    code: "cat",
    name: "Cats",
    intro:
      "Compare everyday gear for travelling, resting and keeping a comfortable home.",
  },
  {
    slug: "birds",
    code: "bird",
    name: "Birds",
    intro:
      "Look closely at perch dimensions, hardware and access for cleaning.",
  },
  {
    slug: "small-animals",
    code: "small-animal",
    name: "Small animals",
    intro:
      "Measure the enclosure and entrances before comparing hides and accessories.",
  },
  {
    slug: "fish",
    code: "fish",
    name: "Fish & aquatic pets",
    intro:
      "Compare equipment specifications against your tank dimensions and setup.",
  },
  {
    slug: "reptiles",
    code: "reptile",
    name: "Reptiles",
    intro:
      "Check enclosure dimensions and equipment compatibility for your species.",
  },
] as const;
export type Collection = (typeof collections)[number];

export type Item = {
  media?: PublishedMediaDetails;
  slug: string;
  title: string;
  summary: string;
  species: string;
  category: string;
  merchant: string | null;
  brand?: string;
  sourceUrl?: string;
  sourceChecked?: string;
  careSourceUrl?: string;
  price?: { formatted: string; checked: string };
  considerations: string[];
  route: string | null;
  label: string;
  disclosure: string | null;
  body: string | null;
};

const guides = [
  [
    "bird-perches",
    "Bird perches",
    "bird",
    "Habitat",
    "Measure available mounting space and compare the perch dimensions.",
    "Diameter and usable length",
    "Mounting hardware",
    "Cleaning instructions",
  ],
  [
    "bird-carriers",
    "Bird travel carriers",
    "bird",
    "Travel",
    "Compare carrier access, latch design and cleaning access.",
    "Door dimensions",
    "Handle attachment",
    "Removable base",
  ],
  [
    "small-animal-hides",
    "Small animal hides",
    "small-animal",
    "Habitat",
    "Choose a hide that fits your enclosure and is easy to inspect and clean.",
    "Entrance dimensions",
    "Usable floor space",
    "Material and care instructions",
  ],
  [
    "small-animal-carriers",
    "Small animal carriers",
    "small-animal",
    "Travel",
    "Compare usable floor space and access before buying.",
    "Interior measurements",
    "Closure design",
    "Base and liner compatibility",
  ],
  [
    "aquarium-filters",
    "Aquarium filters",
    "fish",
    "Equipment",
    "Compare filter specifications with your tank and its existing equipment.",
    "Manufacturer tank rating",
    "Replacement media availability",
    "Clearance for servicing",
  ],
  [
    "aquarium-lights",
    "Aquarium lights",
    "fish",
    "Equipment",
    "Measure your tank and lid before comparing fixtures.",
    "Mounting width",
    "Timer controls",
    "Moisture rating",
  ],
  [
    "reptile-hides",
    "Reptile hides",
    "reptile",
    "Habitat",
    "Check interior dimensions and placement against your current enclosure.",
    "Entry dimensions",
    "Footprint",
    "Surface and cleaning instructions",
  ],
  [
    "terrarium-instruments",
    "Terrarium monitors",
    "reptile",
    "Equipment",
    "Compare instruments for measuring conditions inside the enclosure.",
    "Sensor placement",
    "Measurement range",
    "Calibration instructions",
  ],
];

const houseItems: Item[] = [
  ...products.map((p) => ({
    slug: p.id,
    title: p.name,
    summary: p.description,
    species: p.species,
    category: p.category,
    merchant: p.merchant,
    considerations: p.considerations,
    route: p.affiliate ? "/go/guide/" + p.id : p.href,
    label: "Category guide",
    disclosure: p.affiliate
      ? "Affiliate link. As an Amazon Associate I earn from qualifying purchases."
      : null,
    body: null,
  })),
  ...guides.map(
    ([slug, title, species, category, summary, ...considerations]) => ({
      slug,
      title,
      species,
      category,
      summary,
      considerations,
      merchant: null,
      route: null,
      label: "Category guide",
      disclosure: null,
      body: null,
    }),
  ),
];

export async function getItems(): Promise<Item[]> {
  const rows = await readPublicEntries("product");
  const published = rows.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary || "",
    species: p.species,
    category: p.category || "Gear",
    merchant: p.merchant,
    brand: p.brand,
    media: p.media_path ? { path: p.media_path, description: p.media_description, credit: p.media_credit } : undefined,
    price: formatRecentPrice(p.price_cents,p.price_checked_at),
    considerations: [],
    route: p.destination_url ? "/go/product/" + p.slug : null,
    label: "Product",
    disclosure: p.disclosure,
    body: p.body,
  }));
  return [
    ...published,
    ...[...manufacturerItems,...houseItems].filter((i) => !published.some((p) => p.slug === i.slug)),
  ];
}
export function formatRecentPrice(cents:number|null,checked:string|null):Item['price'] {
  if (!Number.isSafeInteger(cents) || cents===null || cents<0 || !checked) return;
  const elapsed=Date.now()-Date.parse(checked);
  if(!Number.isFinite(elapsed) || elapsed<0 || elapsed>=86_400_000) return;
  return {formatted:new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100),checked};
}
export function speciesName(code: string) {
  return collections.find((c) => c.code === code)?.name || "All pets";
}
export function validMerchantUrl(value: string | null): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}
