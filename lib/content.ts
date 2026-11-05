import { guideBySlug, guideReadingMinutes, guideSources, type Guide } from './guides';

/**
 * PawVerdi content layer.
 *
 * Today this reads from typed seed data so the site can run with zero
 * infrastructure. Every function here has the same shape it will have once
 * Supabase is connected (see supabase/migrations and lib/db.ts) — swapping the
 * source is a one-file change, not a rewrite.
 *
 * Editorial rule enforced in types: an article can only claim vet review when
 * `review.status === 'vet-reviewed'` and a reviewer is named. Nothing in this
 * file invents reviews, ratings, sellers or listings.
 */

export type PetSpecies = 'dog' | 'cat';

export type ReviewStatus = 'unreviewed' | 'editorial' | 'vet-reviewed';

export interface Article {
  slug: string;
  title: string;
  summary: string;
  section: 'costs' | 'health' | 'nutrition' | 'training' | 'grooming' | 'safety' | 'setup' | 'behaviour' | 'tech';
  species: PetSpecies | 'both';
  updated: string; // ISO date
  readingMinutes: number;
  review: { status: ReviewStatus; reviewer?: string };
  sources: { id: number; label: string; url: string }[];
  guide?: Guide;
}

export { products } from './shop';
export type { Product } from './shop';

export interface BreedEntry {
  slug: string;
  name: string;
  species: PetSpecies;
  size: 'small' | 'medium' | 'large' | 'giant';
  lifespanYears: [number, number];
  temperament: string[];
  grooming: 'low' | 'moderate' | 'high';
  energy: 'low' | 'moderate' | 'high';
  note: string;
  sources: { label: string; url: string }[];
}

/* ------------------------------------------------------------------ articles */

const articleRecords: Article[] = [
  {
    slug: 'cat-cost-per-year',
    title: 'What a cat actually costs per year',
    summary: 'Food, litter, vet care and insurance broken out line by line, with the two categories that swing the widest.',
    section: 'costs',
    species: 'cat',
    updated: '2026-10-28',
    readingMinutes: 9,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'cost-of-spaying-a-dog',
    title: 'Cost of spaying a dog, and what drives the price',
    summary: 'Why the same procedure ranges from a few hundred to over a thousand dollars, and where the money goes.',
    section: 'costs',
    species: 'dog',
    updated: '2026-10-22',
    readingMinutes: 7,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'dog-dental-cleaning-cost',
    title: 'Dog dental cleaning: what it costs and what it includes',
    summary: 'Exam, anaesthesia, scaling and extractions are priced separately. Here is how to read a quote.',
    section: 'costs',
    species: 'dog',
    updated: '2026-10-19',
    readingMinutes: 8,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-dog-bed',
    title: 'The bed your dog actually sleeps in',
    summary: 'Four bed types compared by sleeping posture rather than price. The expensive one is often the wrong one.',
    section: 'setup',
    species: 'dog',
    updated: '2026-10-30',
    readingMinutes: 10,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-cat-carrier',
    title: 'Top-loading vs front-loading cat carriers',
    summary: 'A top opening is what lets a vet examine a frightened cat without tipping it out. What that means when you buy.',
    section: 'safety',
    species: 'cat',
    updated: '2026-10-27',
    readingMinutes: 8,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-dog-harness',
    title: 'Harness for a dog that pulls',
    summary: 'Front-clip, back-clip, dual-clip and head halters measured on dogs that actually pull.',
    section: 'training',
    species: 'dog',
    updated: '2026-10-25',
    readingMinutes: 11,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'new-puppy-checklist',
    title: 'Everything to buy before day one',
    summary: 'Sorted into what you need tonight, what can wait a week, and what to skip entirely.',
    section: 'setup',
    species: 'dog',
    updated: '2026-10-31',
    readingMinutes: 12,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'new-kitten-checklist',
    title: 'New kitten checklist',
    summary: 'The first-week setup for a kitten, including what a vet needs from you at the first visit.',
    section: 'setup',
    species: 'cat',
    updated: '2026-10-30',
    readingMinutes: 10,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'cat-not-eating',
    title: 'Cat not eating: how long is safe, and when to worry',
    summary: 'Appetite loss in cats is a clinical sign with a real time limit. Here is the decision path.',
    section: 'health',
    species: 'cat',
    updated: '2026-10-18',
    readingMinutes: 6,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'dog-ear-infection-signs',
    title: 'Dog ear infection signs, and what to avoid',
    summary: 'What an ear infection looks like versus ear mites, and the home remedies that make it worse.',
    section: 'health',
    species: 'dog',
    updated: '2026-10-16',
    readingMinutes: 7,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'how-much-to-feed-a-puppy',
    title: 'How much to feed a puppy, in real amounts',
    summary: 'Portion sizes by weight and age, plus the growth-curve check that catches overfeeding early.',
    section: 'nutrition',
    species: 'dog',
    updated: '2026-10-24',
    readingMinutes: 9,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'how-much-wet-food-for-a-cat',
    title: 'How much wet food a cat needs',
    summary: 'Wet food has different energy density from dry. Here is the arithmetic, and the water question.',
    section: 'nutrition',
    species: 'cat',
    updated: '2026-10-21',
    readingMinutes: 7,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'how-to-travel-with-a-cat-in-a-car',
    title: 'Travel with a cat in a car, step by step',
    summary: 'A pre-trip plan built around restraint, temperature and the two hours after arrival.',
    section: 'safety',
    species: 'cat',
    updated: '2026-10-20',
    readingMinutes: 8,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'kitten-vaccination-schedule',
    title: 'Kitten vaccination schedule',
    summary: 'The core vaccine timeline and the gaps that matter, with a note on regional variation.',
    section: 'health',
    species: 'cat',
    updated: '2026-10-15',
    readingMinutes: 8,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'are-prong-collars-cruel',
    title: 'Are prong collars cruel? What the evidence says',
    summary: 'Welfare evidence, alternative tools, and why "it worked" is not the same as "it was safe".',
    section: 'training',
    species: 'dog',
    updated: '2026-10-14',
    readingMinutes: 9,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'grain-free-dog-food',
    title: 'Is grain-free dog food better?',
    summary: 'What the evidence supports, what it does not, and the cardiac question owners keep asking.',
    section: 'nutrition',
    species: 'dog',
    updated: '2026-10-13',
    readingMinutes: 10,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-food-for-senior-dogs',
    title: 'Food for senior dogs: what actually changes',
    summary: 'Protein, phosphorus and caloric density as dogs age, and when a diet change needs a vet first.',
    section: 'nutrition',
    species: 'dog',
    updated: '2026-10-12',
    readingMinutes: 9,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'dog-harness-size-guide',
    title: 'Harness sizing for large, small and medium breeds',
    summary: 'Which circumference to measure, how brands differ, and the two fit checks people skip.',
    section: 'training',
    species: 'dog',
    updated: '2026-10-11',
    readingMinutes: 7,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-leash-for-pulling-dog',
    title: 'Leash choice for a dog that pulls',
    summary: 'Length, material and handle placement — and why a longer leash usually means more pulling.',
    section: 'training',
    species: 'dog',
    updated: '2026-10-09',
    readingMinutes: 6,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-dog-car-seat-for-small-dogs',
    title: 'Dog car seats for small dogs: crash safety',
    summary: 'What the crash tests actually cover, and which seats are rated for restraint rather than comfort.',
    section: 'safety',
    species: 'dog',
    updated: '2026-10-08',
    readingMinutes: 9,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-dog-crate',
    title: 'Dog crate sizing and which type to buy',
    summary: 'A sizing chart that uses standing height, plus the fabric-vs-wire decision.',
    section: 'setup',
    species: 'dog',
    updated: '2026-10-07',
    readingMinutes: 8,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-cat-litter-box',
    title: 'Cat litter boxes compared by odour control',
    summary: 'Four box types tested against the same ventilation problem, with the size mistake most owners make.',
    section: 'setup',
    species: 'cat',
    updated: '2026-10-06',
    readingMinutes: 9,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-cat-litter-box-multiple-cats',
    title: 'Litter boxes for multiple cats',
    summary: 'The one-box-per-cat rule, where it comes from, and what to do in a small flat.',
    section: 'behaviour',
    species: 'cat',
    updated: '2026-10-05',
    readingMinutes: 7,
    review: { status: 'editorial' },
    sources: [],
  },
  {
    slug: 'best-pet-camera-while-at-work',
    title: 'Pet cameras for watching your dog at work',
    summary: 'Latency, two-way audio and the privacy settings that most owners never open.',
    section: 'tech',
    species: 'dog',
    updated: '2026-10-04',
    readingMinutes: 8,
    review: { status: 'editorial' },
    sources: [],
  },
];

export const articles: Article[] = articleRecords.map((record) => {
  const guide = guideBySlug[record.slug];
  return guide ? {
    ...record,
    title: guide.title,
    guide,
    updated: guide.updated,
    readingMinutes: guideReadingMinutes(guide),
    sources: guideSources.filter((source) => guide.sourceIds.includes(source.id)),
  } : { ...record, review: { status: 'unreviewed' } };
});

export const completeArticles = articles.filter((article) => article.guide);

/* ------------------------------------------------------------------ breeds */

export const breeds: BreedEntry[] = [
  {
    slug: 'labrador-retriever',
    name: 'Labrador Retriever',
    species: 'dog',
    size: 'large',
    lifespanYears: [10, 12],
    temperament: ['friendly', 'eager to please', 'food motivated'],
    grooming: 'moderate',
    energy: 'high',
    note: 'Working-line and show-line Labradors differ noticeably in drive and build. Ask which line a breeder works with.',
    sources: [],
  },
  {
    slug: 'border-collie',
    name: 'Border Collie',
    species: 'dog',
    size: 'medium',
    lifespanYears: [12, 15],
    temperament: ['intense', 'handler-focused', 'high stimulation needs'],
    grooming: 'moderate',
    energy: 'high',
    note: 'Bred to work stock at distance. A household without a job for this dog is a welfare problem, not a training problem.',
    sources: [],
  },
  {
    slug: 'cavalier-king-charles-spaniel',
    name: 'Cavalier King Charles Spaniel',
    species: 'dog',
    size: 'small',
    lifespanYears: [9, 14],
    temperament: ['affectionate', 'sociable', 'lap-oriented'],
    grooming: 'high',
    energy: 'moderate',
    note: 'Known breed-wide health concerns are documented by kennel clubs and breed health schemes. Ask for health screening records before agreeing to anything.',
    sources: [],
  },
  {
    slug: 'maine-coon',
    name: 'Maine Coon',
    species: 'cat',
    size: 'large',
    lifespanYears: [12, 15],
    temperament: ['sociable', 'confident', 'slow to mature'],
    grooming: 'high',
    energy: 'moderate',
    note: 'Large-breed cat; growth continues past three years. Adult-sized furniture and litter boxes matter earlier than you expect.',
    sources: [],
  },
  {
    slug: 'domestic-shorthair',
    name: 'Domestic Shorthair',
    species: 'cat',
    size: 'medium',
    lifespanYears: [13, 17],
    temperament: ['variable', 'adaptable', 'independent'],
    grooming: 'low',
    energy: 'moderate',
    note: 'The most common cat type and the easiest to rehome responsibly. Temperament is individual, not breed-typical.',
    sources: [],
  },
  {
    slug: 'bengal',
    name: 'Bengal',
    species: 'cat',
    size: 'medium',
    lifespanYears: [12, 16],
    temperament: ['active', 'vocal', 'climbing'],
    grooming: 'low',
    energy: 'high',
    note: 'Needs vertical space and daily interaction. Under-stimulated Bengals redirect energy into household damage.',
    sources: [],
  },
];

/* ----------------------------------------------------------------- helpers */

export const sections = [
  { href: '/dogs', label: 'Dog Center', blurb: 'Breeds, health, nutrition, training, grooming, puppies.' },
  { href: '/cats', label: 'Cat Center', blurb: 'Breeds, health, nutrition, behaviour, grooming, kittens.' },
  { href: '/knowledge', label: 'Knowledge Center', blurb: 'Source-linked checklists and clearly marked upcoming topics.' },
  { href: '/marketplace', label: 'Marketplace', blurb: 'Verified sellers, health disclosures, adoption.' },
  { href: '/shop', label: 'Product Shop', blurb: 'Gear categories, buying priorities and clearly labelled merchant links.' },
  { href: '/community', label: 'Community', blurb: 'Owner stories, newsletters, future forums.' },
] as const;

export function featuredArticles(limit = 3): Article[] {
  return [...completeArticles].sort((a, b) => (a.updated < b.updated ? 1 : -1)).slice(0, limit);
}

export function articlesBySpecies(species: PetSpecies | 'both'): Article[] {
  return completeArticles.filter((a) => a.species === species || a.species === 'both');
}

export function articleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function breedsBySpecies(species: PetSpecies): BreedEntry[] {
  return breeds.filter((b) => b.species === species);
}

/** Honest label for the review badge in the UI. */
export function reviewLabel(a: Article): string {
  if (a.review.status === 'vet-reviewed' && a.review.reviewer) return `Vet-reviewed · ${a.review.reviewer}`;
  if (a.guide) return 'Research-based guide';
  return 'In preparation';
}
