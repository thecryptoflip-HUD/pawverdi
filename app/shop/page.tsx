import type { Metadata } from 'next';
import Link from 'next/link';
import CinematicHero from '@/components/cinematic-hero';
import Reveal from '@/components/reveal';
import AdSlot from '@/components/ad-slot';
import PawVerdiShowcase from '@/components/pawverdi-seven-page-showcase';
import ReferenceDetails from '@/components/reference-details';
import GearCategoryCard from '@/components/gear-category-card';
import { products } from '@/lib/shop';

export const metadata: Metadata = {
  title: 'Pet gear shop — category shortlist',
  description:
    'Browse dog and cat gear categories with clearly labelled retailer links. No tested product picks, scores or captured prices are available in this shortlist yet.',
  alternates: { canonical: '/shop' },
};

const blackFridayStart = Date.parse('2026-11-19T00:00:00-08:00');
const blackFridayEnd = Date.parse('2026-12-01T00:00:00-08:00');

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ species?: string | string[]; category?: string | string[] }> }) {
  const params = await searchParams;
  const now = Date.now();
  const showBlackFriday = now >= blackFridayStart && now < blackFridayEnd;
  const species = params.species === 'dog' || params.species === 'cat' ? params.species : 'all';
  const category = typeof params.category === 'string' && ['beds', 'carriers', 'harnesses', 'litter'].includes(params.category) ? params.category : 'all';
  const filteredProducts = products.filter((product) =>
    (species === 'all' || product.species === species || product.species === 'both')
    && (category === 'all' || product.category === category)
  );

  return (
    <div className="vibrant-page">
      <CinematicHero variant="shop"
        kicker="Product shop"
        title={<>Shop for<br /><em>happier pets.</em></>}
        intro="Thoughtful gear categories for everyday life. Start with fit, comfort and practical needs. No products in this shortlist have been tested or rated by PawVerdi."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/shop?species=dog#gear-types" className="btn btn-solid">
            Shop dog gear
          </Link>
          <Link href="/shop?species=cat#gear-types" className="btn btn-ghost">
            Shop cat gear
          </Link>
          <Link href="#shop-disclosure" className="pv-hero-disclosure">Affiliate disclosure</Link>
        </div>
      </CinematicHero>

      <PawVerdiShowcase variant="shop" featuredContent={
      <section id="gear-types" className="pv-shop-browse" aria-label="Pet gear category shortlist">
          <aside id="shop-disclosure" aria-label="Shop affiliate disclosure" className="pv-shop-disclosure">
            <h3>Affiliate disclosure</h3>
            <p>
              As an Amazon Associate I earn from qualifying purchases. If you buy through a labelled Amazon link,
              PawVerdi may earn a commission at no extra cost to you.
              Chewy links are ordinary retailer links without affiliate tracking.
            </p>
            <Link href="/trust#disclosure">
              Read our full disclosure
            </Link>
          </aside>

          {showBlackFriday && (
            <section aria-labelledby="black-friday-heading" className="my-6 rounded-2xl border border-white/10 bg-moss/50 p-5 sm:p-6">
              <h3 id="black-friday-heading" className="font-serif text-2xl text-cream">Black Friday pet gear shopping</h3>
              <p className="mt-2 text-cream/80">
                Amazon’s U.S. Black Friday Week and Cyber Monday event runs November 19–30.
                Use the gear shortlist below to compare sizes and check current prices at the retailer.
                Prices, availability and discounts vary by item.
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <li><Link href="?species=dog&category=beds#gear-types" className="text-gold underline underline-offset-4">Browse dog beds</Link></li>
                <li><Link href="?species=dog&category=harnesses#gear-types" className="text-gold underline underline-offset-4">Browse dog harnesses</Link></li>
                <li><a href="https://press.aboutamazon.com/2026/11/amazons-black-friday-week-and-cyber-monday-return-november-19-30-with-millions-of-deals-to-deliver-joy-this-holiday-season" className="text-gold underline underline-offset-4">Amazon’s event details</a></li>
              </ul>
            </section>
          )}

          <nav aria-label="Filter by species" className="pv-shop-filters">
            {['all', 'dog', 'cat'].map((value) => (
              <Link key={value} href={`?species=${value}&category=${category}#gear-types`} aria-current={species === value ? 'page' : undefined} className="vibrant-filter capitalize">
                {value}
              </Link>
            ))}
          </nav>
          <nav aria-label="Filter by category" className="pv-shop-filters">
            {['all', 'beds', 'carriers', 'harnesses', 'litter'].map((value) => (
              <Link key={value} href={`?species=${species}&category=${value}#gear-types`} aria-current={category === value ? 'page' : undefined} className="vibrant-filter capitalize">
                {value}
              </Link>
            ))}
          </nav>
          <p className="pv-shop-count" role="status">Showing {filteredProducts.length} of {products.length} gear types</p>
          <p className="pv-shop-image-note">AI-generated category illustrations. Actual retailer products vary; these are not tested product recommendations.</p>

          {filteredProducts.length === 0 ? (
            <p className="pv-shop-empty">
              No gear types match these filters. <Link href="?species=all&category=all#gear-types">Reset filters</Link>
            </p>
          ) : (
          <>
          <div className="pv-gear-grid">{filteredProducts.map((product) => <GearCategoryCard key={product.id} product={product} />)}</div>
          <ReferenceDetails title="Compare category details">
          <div className="pv-shop-table-scroll" role="region" aria-label="Gear category comparison" tabIndex={0}>
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

          <div className="pv-shop-price-note">
            <h3 className="font-serif text-xl text-cream">Why the price column is empty</h3>
            <p className="mt-2 max-w-[70ch] text-[0.92rem] leading-relaxed text-cream/70">
              We have not captured prices for this shortlist, and a category page does not have a single product price.
              Check the retailer for the current price and availability. The price column says &ldquo;Not yet captured&rdquo;,
              and no price check date is shown until a price has actually been observed.
            </p>
          </div>
          </ReferenceDetails>
          </>
          )}
      </section>
      }>


        <ReferenceDetails title="How we plan product reviews">
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
        </ReferenceDetails>
      </PawVerdiShowcase>
    </div>
  );
}
