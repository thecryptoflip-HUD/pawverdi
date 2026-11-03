import type { Metadata } from 'next';
import Link from 'next/link';
import CinematicHero from '@/components/cinematic-hero';
import Reveal from '@/components/reveal';
import AdSlot from '@/components/ad-slot';
import { products } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Product shop — tested recommendations and honest comparisons',
  description:
    'Products we recommend, how they are tested, how affiliate links are labelled, and why nothing carries a star rating until a named reviewer has tested it.',
  alternates: { canonical: '/shop' },
};

export default function ShopPage() {
  return (
    <>
      <CinematicHero variant="shop"
        kicker="Product shop"
        title={<>If we have not tested it, it does not get a score.</>}
        intro="Recommendations are earned by testing, and affiliate links never change a ranking. Every product page states who tested it, when, and what it was compared against — or says plainly that it has not been tested yet."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="#how-we-test" className="btn btn-solid">
            How we test
          </Link>
          <Link href="/trust#disclosure" className="btn btn-ghost">
            Affiliate disclosure
          </Link>
        </div>
      </CinematicHero>

      <section className="py-[clamp(48px,7vw,88px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="kicker mb-4">Catalogue</p>
              <h2 className="display text-[clamp(1.8rem,3.2vw,2.5rem)] text-[#fcf8f1]">Shortlisted gear</h2>
            </div>
            <p className="max-w-[36ch] text-[0.82rem] leading-relaxed text-cream/55">
              These are shortlisted categories, not rated products. Each row links to the merchant and records when the
              price was last checked.
            </p>
          </Reveal>

          <div className="overflow-x-auto">
            <table className="table min-w-[760px]">
              <caption className="sr-only">Shortlisted products with merchant, price check date and review status</caption>
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Category</th>
                  <th scope="col">Merchant</th>
                  <th scope="col">Price</th>
                  <th scope="col">Checked</th>
                  <th scope="col">Review status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row" className="text-left font-serif text-base font-normal text-cream">
                      {product.name}
                    </th>
                    <td className="capitalize text-cream/80">{product.category}</td>
                    <td className="text-cream/80">
                      {product.merchant}
                      {product.affiliate && <span className="ml-2 tag tag-ad">Affiliate</span>}
                    </td>
                    <td className="text-cream/60">{product.priceUsd === null ? 'Not yet captured' : `$${product.priceUsd}`}</td>
                    <td className="text-cream/60">
                      <time dateTime={product.priceChecked}>
                        {new Date(product.priceChecked).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </time>
                    </td>
                    <td>
                      {product.rating ? (
                        <span className="tag tag-verified">
                          {product.rating.score}/10 · {product.rating.reviewer}
                        </span>
                      ) : (
                        <span className="tag">Not yet reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-moss/50 p-6">
            <h3 className="font-serif text-xl text-cream">Why the price column is empty</h3>
            <p className="mt-2 max-w-[70ch] text-[0.92rem] leading-relaxed text-cream/70">
              Prices change weekly and a stale price is a broken promise. The price sync job (see{' '}
              <code className="text-cream/80">lib/pricing.ts</code> in the codebase) only writes a value it has fetched from
              the merchant feed within the last 24 hours. Until that job runs against live feeds, the column honestly says
              &ldquo;not yet captured&rdquo; rather than showing a remembered number.
            </p>
          </div>
        </div>
      </section>

      <section id="how-we-test" className="border-y border-white/[0.07] bg-forest py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-9 max-w-[640px]">
            <p className="kicker mb-4">Method</p>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.5rem)] text-[#fcf8f1]">What &ldquo;tested&rdquo; means here.</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Bought, not gifted', 'Anything carrying a score was purchased at retail. Samples are disclosed if a manufacturer sends one, and a gifted item is never scored.'],
              ['Same job, same test', 'Every product in a category is measured against the same task — a bed against sleeping posture and wash cycle, a harness against pull force on the same three dogs.'],
              ['Named and dated', 'The reviewer is a person with a name, the test date is shown, and the unit is kept for re-test. Ratings expire after 18 months.'],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-white/[0.08] bg-moss/50 p-6">
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-amber">0{i + 1}</span>
                  <h3 className="mt-2 font-serif text-xl text-cream">{title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-cream/70">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10">
            <AdSlot placement="shop-inline-01" />
          </div>
        </div>
      </section>
    </>
  );
}
