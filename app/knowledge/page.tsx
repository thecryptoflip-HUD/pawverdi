import type { Metadata } from 'next';
import Link from 'next/link';
import CinematicHero from '@/components/cinematic-hero';
import ArticleCard from '@/components/article-card';
import Reveal from '@/components/reveal';
import { articles, reviewLabel } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Knowledge Center — fact-checked guides and pet care news',
  description:
    'Every PawVerdi guide states its review status, sources and last-checked date. Filter by species or topic; nothing is published without an editorial pass.',
  alternates: { canonical: '/knowledge' },
};

const sectionOptions = ['all', 'costs', 'health', 'nutrition', 'training', 'setup', 'safety', 'behaviour', 'tech'] as const;
const speciesOptions = ['all', 'dog', 'cat'] as const;

type Search = { species?: string; section?: string };

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const species = speciesOptions.includes((params.species ?? 'all') as (typeof speciesOptions)[number])
    ? (params.species ?? 'all')
    : 'all';
  const section = sectionOptions.includes((params.section ?? 'all') as (typeof sectionOptions)[number])
    ? (params.section ?? 'all')
    : 'all';

  const filtered = articles.filter((a) => {
    const speciesOk = species === 'all' || a.species === species || a.species === 'both';
    const sectionOk = section === 'all' || a.section === section;
    return speciesOk && sectionOk;
  });

  const reviewedCount = articles.filter((a) => a.review.status === 'vet-reviewed').length;

  return (
    <>
      <CinematicHero variant="knowledge"
        kicker="Knowledge Center"
        title={<>The reading list, with its paperwork attached.</>}
        intro={`${articles.length} published guides. ${reviewedCount} have completed veterinary review; the rest carry an editorial badge and say so. Prices are re-checked on a schedule and every entry shows its last update.`}
      />

      <section className="py-[clamp(40px,6vw,72px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          {/* filters are plain links: they work with JS off and are crawlable */}
          <nav aria-label="Filter articles" className="mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-[0.64rem] uppercase tracking-[0.22em] text-cream/45">Species</span>
              {speciesOptions.map((option) => (
                <Link
                  key={option}
                  href={`/knowledge?species=${option}${section !== 'all' ? `&section=${section}` : ''}`}
                  aria-current={species === option ? 'page' : undefined}
                  className={`rounded-full border px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    species === option ? 'border-amber text-gold' : 'border-white/15 text-cream/70 hover:border-white/30 hover:text-cream'
                  }`}
                >
                  {option}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-[0.64rem] uppercase tracking-[0.22em] text-cream/45">Topic</span>
              {sectionOptions.map((option) => (
                <Link
                  key={option}
                  href={`/knowledge?section=${option}${species !== 'all' ? `&species=${species}` : ''}`}
                  aria-current={section === option ? 'page' : undefined}
                  className={`rounded-full border px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    section === option ? 'border-amber text-gold' : 'border-white/15 text-cream/70 hover:border-white/30 hover:text-cream'
                  }`}
                >
                  {option}
                </Link>
              ))}
            </div>
          </nav>

          <p className="mb-7 text-[0.82rem] text-cream/55" role="status">
            Showing <strong className="text-cream">{filtered.length}</strong> of {articles.length} guides
            {species !== 'all' && ` · species: ${species}`}
            {section !== 'all' && ` · topic: ${section}`}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-moss/60 p-10 text-center">
              <h2 className="font-serif text-2xl text-cream">Nothing published under that filter yet.</h2>
              <p className="mx-auto mt-3 max-w-[46ch] text-[0.94rem] text-cream/70">
                We would rather show an empty shelf than pad the count with thin content. The next guides on this topic
                are in editorial.
              </p>
              <Link href="/knowledge" className="btn btn-ghost mx-auto mt-6">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, i) => (
                <Reveal key={article.slug} delay={(i % 3) * 60}>
                  <div className="relative h-full">
                    <ArticleCard
                      article={article}
                      image={['/brand/carrier.jpg', '/brand/bed.jpg', '/brand/gear.jpg', '/brand/hero.jpg'][i % 4]}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="news" className="border-t border-white/[0.07] bg-forest py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-8 max-w-[640px]">
            <p className="kicker mb-4">Pet care news</p>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.6rem)] text-[#fcf8f1]">Updates, with the source attached.</h2>
            <p className="lede mt-4">
              News items are short, sourced and dated. A story is only published here when we can link the primary
              source — regulator, journal, kennel club or manufacturer recall notice.
            </p>
          </Reveal>

          <div className="rounded-[18px] border border-white/[0.08] bg-moss/60 p-8">
            <p className="tag mb-4">Feed status</p>
            <h3 className="font-serif text-2xl text-cream">No news items published yet.</h3>
            <p className="mt-3 max-w-[60ch] text-[0.94rem] leading-relaxed text-cream/75">
              The news desk opens with the first sourced item. We do not syndicate press releases or republish other
              outlets&apos; reporting, and we will not fill this space with evergreen filler presented as news.
            </p>
            <dl className="mt-6 grid gap-4 border-t border-white/[0.07] pt-5 text-[0.86rem] sm:grid-cols-3">
              {[
                ['Editorial reviews completed this month', String(articles.filter((a) => a.review.status !== 'unreviewed').length)],
                ['Vet reviews completed', String(reviewedCount)],
                ['Corrections issued', '0'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-cream/55">{k}</dt>
                  <dd className="mt-1 font-serif text-xl text-cream">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="py-[clamp(48px,7vw,84px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <div className="rounded-[18px] border border-white/[0.08] bg-moss/50 p-8">
            <p className="kicker mb-3">How review works</p>
            <ol className="grid gap-4 text-[0.92rem] text-cream/80 sm:grid-cols-3">
              {[
                ['Draft', 'Written from primary sources: veterinary literature, regulator guidance, breed-club data. Claims without a source are cut.'],
                ['Editorial pass', 'A second editor checks sourcing, prices and internal links. The article publishes with an editorial badge.'],
                ['Veterinary review', 'A licensed veterinarian reviews clinical claims. Only then does the vet-reviewed badge appear, with the reviewer named.'],
              ].map(([title, body], i) => (
                <li key={title} className="rounded-xl border border-white/[0.07] bg-void/40 p-5">
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-amber">Step 0{i + 1}</span>
                  <h3 className="mt-2 font-serif text-lg text-cream">{title}</h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-cream/70">{body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[0.78rem] text-cream/50">
              Current labels in use: {[...new Set(articles.map(reviewLabel))].join(' · ')}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
