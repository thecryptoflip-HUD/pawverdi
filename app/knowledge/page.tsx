import type { Metadata } from 'next';
import Link from 'next/link';
import CinematicHero from '@/components/cinematic-hero';
import ArticleCard from '@/components/article-card';
import Reveal from '@/components/reveal';
import { articles, completeArticles, reviewLabel } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Knowledge Center — practical dog and cat care guides',
  description:
    'Source-linked puppy and kitten checklists, with clear review status. Browse complete guides and see which dog and cat topics are still in preparation.',
  alternates: { canonical: '/knowledge' },
};

const sectionOptions = ['all', 'costs', 'health', 'nutrition', 'training', 'setup', 'safety', 'behaviour', 'tech'] as const;
const speciesOptions = ['all', 'dog', 'cat'] as const;

type Search = { species?: string; section?: string; q?: string };

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const q = params.q ?? '';
  const query = q.trim().toLowerCase();
  const species = speciesOptions.includes((params.species ?? 'all') as (typeof speciesOptions)[number])
    ? (params.species ?? 'all')
    : 'all';
  const section = sectionOptions.includes((params.section ?? 'all') as (typeof sectionOptions)[number])
    ? (params.section ?? 'all')
    : 'all';

  const filtered = completeArticles.filter((a) => {
    const speciesOk = species === 'all' || a.species === species || a.species === 'both';
    const sectionOk = section === 'all' || a.section === section;
    const searchOk = [a.title, a.summary, a.section].some((value) => value.toLowerCase().includes(query));
    return speciesOk && sectionOk && searchOk;
  });

  const reviewedCount = completeArticles.filter((a) => a.review.status === 'vet-reviewed' && a.review.reviewer).length;
  const upcoming = articles.filter((article) => !article.guide);

  return (
    <>
      <CinematicHero variant="knowledge"
        kicker="Knowledge Center"
        title={<>The reading list, with its paperwork attached.</>}
        intro={`${completeArticles.length} full guides. ${upcoming.length} topics in preparation. The complete checklists link their sources and state their review status; none has completed independent veterinary review.`}
      />

      <section className="py-[clamp(40px,6vw,72px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <form action="/knowledge" method="get" className="mb-8">
            <label htmlFor="knowledge-search" className="mb-2 block text-[0.82rem] text-cream/70">Search guides</label>
            <div className="flex flex-wrap gap-3">
              <input
                id="knowledge-search"
                type="search"
                name="q"
                defaultValue={q}
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-moss/60 px-4 py-3 text-cream"
              />
              <button type="submit" className="btn btn-ghost">Search</button>
            </div>
            <input type="hidden" name="species" value={species} />
            <input type="hidden" name="section" value={section} />
          </form>
          {/* filters are plain links: they work with JS off and are crawlable */}
          <nav aria-label="Filter articles" className="mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-[0.64rem] uppercase tracking-[0.22em] text-cream/45">Species</span>
              {speciesOptions.map((option) => (
                <Link
                  key={option}
                  href={`/knowledge?species=${option}${section !== 'all' ? `&section=${section}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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
                  href={`/knowledge?section=${option}${species !== 'all' ? `&species=${species}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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
            Showing <strong className="text-cream">{filtered.length}</strong> of {completeArticles.length} full guides
            {species !== 'all' && ` · species: ${species}`}
            {section !== 'all' && ` · topic: ${section}`}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-moss/60 p-10 text-center">
              <h2 className="font-serif text-2xl text-cream">Nothing published under that filter yet.</h2>
              <p className="mx-auto mt-3 max-w-[46ch] text-[0.94rem] text-cream/70">
                {q ? "No guide matches that search. Try a different term, or clear a filter." : "Change the species or topic filter to see other guides."}
              </p>
              <Link href={q ? `/knowledge?species=${species}&section=${section}` : '/knowledge'} className="btn btn-ghost mx-auto mt-6">
                {q ? 'Reset search' : 'Clear filters'}
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

      <section className="border-t border-white/[0.07] py-10">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <details className="rounded-2xl border border-white/10 bg-moss/50 p-6">
            <summary className="cursor-pointer font-serif text-xl text-cream">{upcoming.length} topics in preparation</summary>
            <p className="mt-3 text-[0.9rem] text-cream/75">These are planned topics, not finished guides. They are excluded from the complete-guide count and sitemap.</p>
            <ul className="mt-4 grid list-disc gap-x-10 gap-y-3 pl-5 text-[0.88rem] text-cream/75 sm:grid-cols-2">
              {upcoming.map((article) => <li key={article.slug}>{article.title}</li>)}
            </ul>
          </details>
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
                ['Complete guides with sources', String(completeArticles.filter((a) => a.sources.length > 0).length)],
                ['Vet reviews completed', String(reviewedCount)],
                ['Topics in preparation', String(upcoming.length)],
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
                ['Independent editorial pass', 'An independent editor should check the sources, safety wording and links. Source-linked checklists do not claim this review has happened.'],
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
