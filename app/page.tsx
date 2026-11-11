import Link from 'next/link';
import Hero from '@/components/hero';
import Reveal from '@/components/reveal';
import GuideRail, { type RailItem } from '@/components/guide-rail';
import ArticleCard from '@/components/article-card';
import AdSlot from '@/components/ad-slot';
import WelcomePaths from '@/components/welcome-paths';
import { articles, completeArticles, featuredArticles, sections } from '@/lib/content';

const railImages = ['/brand/carrier.jpg', '/brand/bed.jpg', '/brand/gear.jpg', '/brand/hero.jpg'];

export default function HomePage() {
  const featured = featuredArticles(3);
  const rail: RailItem[] = completeArticles.slice(0, 8).map((a, i) => ({
    slug: a.slug,
    title: a.title,
    section: a.section,
    species: a.species,
    image: railImages[i % railImages.length],
  }));

  return (
    <>
      <Hero />

      <WelcomePaths
        kicker="A happy place to begin"
        heading="A little more joy. A lot more confidence."
        intro="Every pet has a story. Find the practical help, thoughtful gear and everyday ideas that fit yours."
        items={[
          { eyebrow: 'For dog people', title: 'Make every day a good dog day', description: 'From new-puppy routines to walking and care, start with a helpful guide.', href: '/dogs', image: '/brand/sections/dogs.jpg', action: 'Explore dog care' },
          { eyebrow: 'For cat people', title: 'A happier home for your cat', description: 'Explore kitten essentials, comfort, behaviour and care in one place.', href: '/cats', image: '/brand/sections/cats.jpg', action: 'Explore cat care' },
          { eyebrow: 'Shop thoughtfully', title: 'Find gear that fits real life', description: 'Compare beds, carriers and harnesses before deciding what to buy.', href: '/shop', image: '/brand/sections/shop.jpg', action: 'Browse pet gear' },
        ]}
      />

      {/* ---------- ticker ---------- */}
      <div className="overflow-hidden border-y border-white/[0.07] bg-forest py-3.5" aria-hidden="true">
        <div className="flex w-max animate-[slide_52s_linear_infinite] gap-0">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex">
              {['Cost per year', 'Gear that lasts', 'Vet bills, explained', 'Verified sellers', 'Adoption first', 'Honest disclosures'].map((label) => (
                <b key={label + copy} className="flex items-center gap-6 whitespace-nowrap px-6 text-[0.68rem] font-bold uppercase tracking-[0.3em] text-cream/55">
                  {label}
                  <span className="h-1 w-1 rounded-full bg-amber/70" />
                </b>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- pillars ---------- */}
      <section className="py-[clamp(72px,11vw,132px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="max-w-[680px]">
            <p className="kicker mb-5">The platform</p>
            <h2 className="display text-[clamp(2rem,3.7vw,3.2rem)] text-[#fcf8f1]">
              Something for every kind of pet parent.
            </h2>
            <p className="lede mt-5 max-w-[56ch]">
              From useful guides to practical shopping, explore PawVerdi at your own pace. We label commercial links
              clearly and keep unreviewed content distinct from verified advice.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, i) => (
              <Reveal key={section.href} delay={i * 70}>
                <Link href={section.href} className="card group flex h-full flex-col p-7">
                  <span className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-amber">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-[1.4rem] leading-tight text-[#fcf8f1]">{section.label}</h3>
                  <p className="mt-2.5 flex-1 text-[0.94rem] leading-relaxed text-cream/80">{section.blurb}</p>
                  <span className="mt-5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-cream/85">
                    Enter <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- rail ---------- */}
      <section className="border-y border-white/[0.07] bg-gradient-to-b from-void via-forest to-void py-[clamp(64px,9vw,110px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="kicker mb-4">The index</p>
              <h2 data-guide-count={completeArticles.length} className="display text-[clamp(1.9rem,3.4vw,2.9rem)] text-[#fcf8f1]">
                {completeArticles.length} full guides.
                <br />
                Drag through them.
              </h2>
            </Reveal>
            <Link href="/knowledge" className="text-[0.76rem] font-bold uppercase tracking-[0.16em] text-cream/80 underline underline-offset-4 hover:text-cream">
              All articles →
            </Link>
          </div>
          <GuideRail items={rail} />
        </div>
      </section>

      {/* ---------- featured ---------- */}
      <section className="py-[clamp(72px,10vw,124px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-11 max-w-[640px]">
            <p className="kicker mb-4">Recently published</p>
            <h2 className="display text-[clamp(1.9rem,3.4vw,2.8rem)] text-[#fcf8f1]">Start where it hurts.</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((article, i) => (
              <Reveal key={article.slug} delay={i * 80}>
                <div className="relative h-full">
                  <ArticleCard article={article} image={railImages[(i + 2) % railImages.length]} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- film ---------- */}
      <section className="border-y border-white/[0.07] bg-forest py-[clamp(56px,8vw,104px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mx-auto mb-9 max-w-[660px]">
            <p className="kicker mb-4">Shot for this platform</p>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.6rem)] text-[#fcf8f1]">
              A room, a dog, a cat. That is the whole brief.
            </h2>
          </Reveal>
          <Reveal className="mx-auto max-w-[1000px]">
            <figure className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-moss shadow-[0_60px_120px_-60px_rgba(0,0,0,.95)]">
              <video
                muted
                loop
                playsInline
                preload="metadata"
                poster="/brand/at-home-poster.jpg"
                aria-label="Short cinematic loop of a dog and cat resting in warm light"
                className="aspect-[4/3] w-full object-cover saturate-[1.02] contrast-[1.03]"
              >
                <source src="/brand/at-home.mp4" type="video/mp4" />
                <source src="/brand/at-home.webm" type="video/webm" />
              </video>
              <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] bg-forest px-5 py-3.5 text-[0.68rem] uppercase tracking-[0.2em] text-cream/55">
                <span>PawVerdi index film · 5s loop</span>
                <span className="hidden sm:inline">No stock footage · no brand placement</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------- trust / figures ---------- */}
      <section className="py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-9 max-w-[620px]">
            <p className="kicker mb-4">The short version</p>
            <h2 className="display text-[clamp(1.9rem,3.3vw,2.7rem)] text-[#fcf8f1]">What this is, in four lines.</h2>
          </Reveal>
          <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-white/[0.07] bg-white/[0.06] lg:grid-cols-4">
            {[
              { n: String(completeArticles.length), l: 'Complete guides' },
              { n: String(articles.length - completeArticles.length), l: 'Topics in preparation' },
              { n: String(new Set(completeArticles.flatMap((a) => a.sources.map((s) => s.url))).size), l: 'Linked source pages' },
              { n: String(completeArticles.filter((a) => a.review.status === 'vet-reviewed' && a.review.reviewer).length), l: 'Veterinary reviews' },
            ].map((stat) => (
              <div key={stat.l} className="bg-forest px-7 py-8">
                <div className="font-serif text-[clamp(2rem,3.4vw,2.7rem)] leading-none text-gold">{stat.n}</div>
                <div className="mt-3 text-[0.72rem] uppercase tracking-[0.18em] text-cream/60">{stat.l}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- marketplace gate ---------- */}
      <section className="border-t border-white/[0.07] bg-forest py-[clamp(64px,9vw,116px)]">
        <div className="mx-auto grid max-w-wrap gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <Reveal>
            <p className="kicker mb-4">Marketplace</p>
            <h2 className="display text-[clamp(1.9rem,3.3vw,2.7rem)] text-[#fcf8f1]">
              No listing goes live until the seller does.
            </h2>
            <p className="lede mt-5 max-w-[54ch]">
              Verified identity, documented health screening, written health disclosures and a welfare-first refusal
              policy. Where adoption is the better answer, we say so — even though a sale would pay us more.
            </p>
            <ul className="mt-7 space-y-3 text-[0.95rem] text-cream/80">
              {[
                'Seller identity and licence checked before onboarding',
                'Health disclosure template required on every animal listing',
                'No animal shipped as cargo; collection or supervised transport only',
                'Scam-pattern detection on every inbound listing',
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-amber" />
                  {line}
                </li>
              ))}
            </ul>
            <Link href="/marketplace" className="btn btn-ghost mt-8">
              Read the verification standard
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[18px] border border-white/[0.08] bg-moss/70 p-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="tag tag-verified">Verification gate</span>
                <span className="text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">Live status</span>
              </div>
              <h3 className="font-serif text-2xl text-cream">0 listings published</h3>
              <p className="mt-3 text-[0.94rem] leading-relaxed text-cream/80">
                The marketplace is deliberately empty during launch. Listings appear only after a seller completes
                verification and their health disclosures are reviewed by a human — so the count above is zero, not a
                template populated with invented animals.
              </p>
              <dl className="mt-6 space-y-3 border-t border-white/[0.07] pt-5 text-[0.86rem]">
                {[
                  ['Applications received', '0'],
                  ['Sellers verified', '0'],
                  ['Listings rejected at review', '0'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-cream/60">{k}</dt>
                    <dd className="font-semibold text-cream">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- ad ---------- */}
      <section className="py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <AdSlot placement="home-inline-01" format="leaderboard" />
        </div>
      </section>

      {/* ---------- newsletter ---------- */}
      <section className="border-t border-white/[0.07] bg-forest py-[clamp(64px,9vw,110px)]">
        <div className="mx-auto grid max-w-wrap gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <Reveal>
            <p className="kicker mb-4">Community</p>
            <h2 className="display text-[clamp(1.9rem,3.3vw,2.7rem)] text-[#fcf8f1]">
              One email a month. What changed, and why.
            </h2>
            <p className="lede mt-5 max-w-[52ch]">
              New guides, price changes we re-checked, marketplace policy updates and corrections we issued. No
              affiliate blasts, no daily drip.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <form action="/api/newsletter" method="post" className="rounded-[18px] border border-white/[0.08] bg-moss/70 p-7">
              <label htmlFor="email" className="block text-[0.7rem] uppercase tracking-[0.2em] text-cream/60">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-3 w-full rounded-xl border border-white/15 bg-void/60 px-4 py-3.5 text-cream placeholder:text-cream/35 focus:border-amber focus:outline-none"
              />
              <button type="submit" className="btn btn-solid mt-4 w-full justify-center">
                Subscribe
              </button>
              <p className="mt-3 text-[0.72rem] leading-relaxed text-cream/50">
                Double opt-in. Stored only for the newsletter; never sold or used for affiliate targeting.
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
