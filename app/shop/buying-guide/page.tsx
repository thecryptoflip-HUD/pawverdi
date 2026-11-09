import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pet gear buying guide — compare fit, care and cost',
  description: 'An independent checklist for comparing dog beds, walking harnesses, cat carriers and litter trays without relying on invented review scores.',
  alternates: { canonical: '/shop/buying-guide' },
};

const comparisons = [
  {
    title: 'Dog beds',
    questions: ['Measure your dog while resting, then compare the usable sleeping area with the listed exterior dimensions.', 'Check whether the cover and filling can be cleaned separately and whether replacement parts are sold.', 'Look at the stated return policy before assuming an orthopedic label predicts comfort or a medical benefit.'],
  },
  {
    title: 'Walking harnesses',
    questions: ['Measure the chest and neck using the manufacturer\'s chart rather than choosing from breed name alone.', 'Check adjustment points, buckle placement, leash attachment and visibility in low light.', 'Inspect seams and fittings regularly; no harness is escape-proof or a substitute for supervision.'],
  },
  {
    title: 'Cat carriers',
    questions: ['Check internal space, ventilation, closure security and whether the cat can turn and settle.', 'Consider a removable top or multiple openings for easier handling and cleaning.', 'Read the carrier and vehicle instructions before travel; confirm the seller\'s return conditions.'],
  },
  {
    title: 'Litter trays',
    questions: ['Check entry height, interior floor space and whether your cat can enter and turn comfortably.', 'Consider where a quiet, accessible tray can be placed, away from eating and resting areas.', 'For automated products, verify manufacturer age and weight restrictions; provide a suitable ordinary tray if needed.'],
  },
];

export default function BuyingGuide() {
  return (
    <div className="mx-auto max-w-wrap px-5 py-16 sm:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gold">
        <Link href="/shop" className="underline underline-offset-4">Shop</Link> / Buying guide
      </nav>
      <h1 className="display max-w-4xl text-[clamp(2rem,5vw,4rem)] text-cream">How to compare pet gear before you buy</h1>
      <p className="mt-6 max-w-[75ch] text-cream/80">
        Compare function, fit, cleaning, ongoing costs and return terms before making a purchase. PawVerdi has not tested or rated the retailer categories shown in our shop. These are shopping questions, not product endorsements or veterinary advice.
      </p>
      <aside className="mt-8 rounded-2xl border border-white/15 bg-moss/50 p-6">
        <h2 className="font-serif text-xl text-cream">Affiliate and retailer disclosure</h2>
        <p className="mt-2 text-cream/80">PawVerdi may receive commissions from clearly marked affiliate links. The shop currently labels Amazon links as affiliate links and Chewy and eBay links as ordinary, untracked retailer links. Prices and availability must be checked with the retailer.</p>
      </aside>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {comparisons.map((item) => (
          <section key={item.title} className="rounded-2xl border border-white/15 p-6">
            <h2 className="font-serif text-2xl text-cream">{item.title}</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-cream/80">
              {item.questions.map((question) => <li key={question}>{question}</li>)}
            </ul>
          </section>
        ))}
      </div>
      <section className="mt-10 max-w-[75ch]">
        <h2 className="font-serif text-2xl text-cream">Before checking out</h2>
        <p className="mt-3 text-cream/80">Compare the final price including shipping and returns. Confirm dimensions, materials, seller reputation and compatibility from the actual listing. A marketplace search results page contains many sellers and variants; it does not guarantee the availability or quality of any one product.</p>
        <Link href="/shop" className="mt-5 inline-block text-gold underline underline-offset-4">Browse the PawVerdi category shortlist</Link>
      </section>
    </div>
  );
}
