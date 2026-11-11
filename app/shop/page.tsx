import type { Metadata } from 'next';
import Link from 'next/link';
import CinematicHero from '@/components/cinematic-hero';
import Reveal from '@/components/reveal';
import AdSlot from '@/components/ad-slot';
import WelcomePaths from '@/components/welcome-paths';
import { products } from '@/lib/shop';

export const metadata: Metadata = {
  title: 'Pet gear shop — category shortlist',
  description:
    'Browse dog and cat gear categories with clearly labelled retailer links. No tested product picks, scores or captured prices are available in this shortlist yet.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ species?: string | string[]; category?: string | string[] }> }) {
  const params = await searchParams;
  const species = params.species === 'dog' || params.species === 'cat' ? params.species : 'all';
  const category = typeof params.category === 'string' && ['beds', 'carriers', 'harnesses', 'litter'].includes(params.category) ? params.category : 'all';
  const filteredProducts = products.filter((product) =>
    (species === 'all' || product.species === species || product.species === 'both')
    && (category === 'all' || product.category === category)
  );

  return (
    <>
      <CinematicHero variant="shop"
        kicker="Product shop"
        title={<>Browse pet gear by type.</>}
        intro="These gear types are a starting point for your own comparison, not tested recommendations. No products in this shortlist have been tested or rated by PawVerdi. Links open retailer category or search pages, not individual product picks."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="#how-we-test" className="btn btn-solid">
            Future review policy
          </Link>
          <Link href="#shop-disclosure" className="btn btn-ghost">
            Affiliate disclosure
          </Link>
        </div>
      </CinematicHero>

      <WelcomePaths
        kicker="Shop with confidence"
        heading="Find the right fit, not just a pretty picture."
        intro="Start with your pet's needs. Our links lead to retailer categories, not PawVerdi-tested product recommendations."
        items={[
          { eyebrow: 'For cozy days', title: 'A bed for their favourite spot', description: 'Compare sleeping space, washable covers and return terms before you buy.', href: '/shop?species=dog&category=beds', image: '/brand/bed.jpg', action: 'Explore dog beds' },
          { eyebrow: 'On the move', title: 'Ready for the next adventure', description: 'Look for secure fastenings, ventilation and useful dimensions.', href: '/shop?species=cat&category=carriers', image: '/brand/carrier.jpg', action: 'Explore cat carriers' },
          { eyebrow: 'Daily essentials', title: 'Useful gear for life together', description: 'Start with fit and function, then check current prices at the retailer.', href: '/shop?species=dog&category=harnesses', image: '/brand/gear.jpg', action: 'Explore dog harnesses' },
        ]}
      />
      <section className="py-[clamp(48px,7vw,88px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <aside id="shop-disclosure" aria-label="Shop affiliate disclosure" className="mb-8 rounded-2xl border border-white/[0.08] bg-moss/50 p-6">
            <h2 className="font-serif text-xl text-cream">Affiliate disclosure</h2>
            <p className="mt-2 max-w-[70ch] text-[0.92rem] leading-relaxed text-cream/70">
              As an Amazon Associate I earn from qualifying purchases. Labelled Amazon links contain our configured
              tracking tag. If you buy through one, PawVerdi may earn a commission at no extra cost to you.
              Chewy links are ordinary retailer links without affiliate tracking.
            </p>
            <Link href="/trust#disclosure" className="mt-3 inline-block text-sm text-gold underline underline-offset-4">
              Read our full disclosure
            </Link>
          </aside>

          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="kicker mb-4">Browse by type</p>
              <h2 className="display text-[clamp(1.8rem,3.2vw,2.5rem)] text-[#fcf8f1]">Category shortlist</h2>
            </div>
            <p className="max-w-[36ch] text-[0.82rem] leading-relaxed text-cream/55">
              Choose a gear type to browse at the retailer. Check the individual listing for fit, materials, price and
              availability before buying.
            </p>
          </Reveal>

          <nav aria-label="Filter by species" className="mb-4 flex flex-wrap gap-4">
            {['all', 'dog', 'cat'].map((value) => (
              <Link key={value} href={`?species=${value}&category=${category}`} aria-current={species === value ? 'page' : undefined} className="capitalize text-gold underline underline-offset-4">
                {value}
              </Link>
            ))}
          </nav>
          <nav aria-label="Filter by category" className="mb-4 flex flex-wrap gap-4">
            {['all', 'beds', 'carriers', 'harnesses', 'litter'].map((value) => (
              <Link key={value} href={`?species=${species}&category=${value}`} aria-current={category === value ? 'page' : undefined} className="capitalize text-gold underline underline-offset-4">
                {value}
              </Link>
            ))}
          </nav>
          <p className="mb-4 text-sm text-cream/70">Showing {filteredProducts.length} of 4 gear types</p>

          {filteredProducts.length === 0 ? (
            <p className="text-cream/70">
              No gear types match these filters. <Link href="?species=all&category=all" className="text-gold underline underline-offset-4">Reset filters</Link>
            </p>
          ) : (
          <div className="overflow-x-auto">
            <table className="table min-w-[760px]" aria-describedby="shop-disclosure">
              <caption className="sr-only">Pet gear category/type shortlist with retailer links, price check dates and review status</caption>
              <thead>
                <tr>
                  <th scope="col">Category / type</th>
                  <th scope="col">Category</th>
                  <th scope="col">Merchant</th>
                  <th scope="col">Price</th>
                  <th scope="col">Checked</th>
                  <th scope="col">Review status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <th scope="row" className="text-left font-serif text-base font-normal text-cream">
                      {product.name}
                    </th>
                    <td className="capitalize text-cream/80">{product.category}</td>
                    <td className="text-cream/80">
                      <a
                        href={product.href}
                        data-track={product.affiliate ? 'tracked' : 'UNTRACKED'}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                        className="text-gold underline underline-offset-4 hover:text-cream"
                      >
                        Browse {product.category} on {product.merchant}
                      </a>
                      {product.affiliate ? (
                        <span className="ml-2 tag tag-ad">Affiliate link</span>
                      ) : (
                        <span className="ml-2 tag">Retailer link · untracked</span>
                      )}
                    </td>
                    <td className="text-cream/60">{product.priceUsd === null ? 'Not yet captured' : `$${product.priceUsd}`}</td>
                    <td className="text-cream/60">
                      {product.priceChecked ? (
                        <time dateTime={product.priceChecked}>
                          {new Date(product.priceChecked).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </time>
                      ) : 'Not yet checked'}
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
          )}

          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-moss/50 p-6">
            <h3 className="font-serif text-xl text-cream">Why the price column is empty</h3>
            <p className="mt-2 max-w-[70ch] text-[0.92rem] leading-relaxed text-cream/70">
              We have not captured prices for this shortlist, and a category page does not have a single product price.
              Check the retailer for the current price and availability. The price column says &ldquo;Not yet captured&rdquo;,
              and no price check date is shown until a price has actually been observed.
            </p>
          </div>
        </div>
      </section>

      <section id="how-we-test" className="border-y border-white/[0.07] bg-forest py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-9 max-w-[640px]">
            <p className="kicker mb-4">Method</p>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.5rem)] text-[#fcf8f1]">Future testing policy.</h2>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-cream/70">
              This is our policy for future product reviews, not a record of completed tests.
            </p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Retail purchases and samples', 'Before assigning a score, we will document how the item was obtained. We plan to buy scored items at retail and disclose any samples; gifted items will not receive a score.'],
              ['Documented comparisons', 'For any future review, we will publish the tasks, conditions and comparison items used. We have not run category comparison tests for this shortlist.'],
              ['Named reviewer and test date', 'Any future score will require a named reviewer, dated test notes and supporting evidence. Until that work is published, items will remain unscored.'],
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
