import type { Item } from "@/lib/discovery";

type ManufacturerItem = Item & {
  brand: string;
  sourceChecked: string;
  sourceUrl: string;
  careSourceUrl?: string;
};

const kongUrl = "https://www.kongcompany.com/kong-classic/";
const topplUrl = "https://www.westpaw.com/products/toppl-treat-toy";

export const manufacturerItems: ManufacturerItem[] = [
  {
    slug: "kong-classic",
    title: "KONG Classic",
    species: "dog",
    category: "Enrichment",
    label: "Product",
    brand: "KONG",
    merchant: "KONG",
    route: kongUrl,
    sourceUrl: kongUrl,
    careSourceUrl: "https://www.kongcompany.com/how-to-clean-a-kong/",
    sourceChecked: "2026-11-27",
    disclosure: null,
    summary: "A three-tiered rubber toy with a hollow center that can hold kibble or treats.",
    considerations: [
      "Sizes: XS, S, M, L, XL and XXL. KONG lists a dog weight range for each size.",
      "Material: red natural rubber.",
      "Care: rinse the cavity after use, or wash on the upper dishwasher rack and skip heated drying.",
    ],
    body: null,
  },
  {
    slug: "west-paw-toppl",
    title: "West Paw Toppl",
    species: "dog",
    category: "Enrichment",
    label: "Product",
    brand: "West Paw",
    merchant: "West Paw",
    route: topplUrl,
    sourceUrl: topplUrl,
    sourceChecked: "2026-11-27",
    disclosure: null,
    summary: "An open-topped treat toy. A small and large pair, or a large and extra-large pair, can interlock to make a food puzzle.",
    considerations: [
      "Sizes and capacities: small holds ¼ cup, large holds ¾ cup, and extra-large holds 1¼ cups.",
      "Material: West Paw’s Zogoflex.",
      "Care: the manufacturer permits washing on the upper dishwasher rack.",
    ],
    body: null,
  },
];
