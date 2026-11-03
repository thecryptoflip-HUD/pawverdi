import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articleBySlug, articles, reviewLabel } from '@/lib/content';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return { title: 'Article not found' };
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/knowledge/${article.slug}` },
    openGraph: { title: article.title, description: article.summary, type: 'article', modifiedTime: article.updated },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const reviewed = article.review.status === 'vet-reviewed';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    dateModified: article.updated,
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
    isAccessibleForFree: true,
    ...(reviewed && article.review.reviewer
      ? { reviewedBy: { '@type': 'Person', name: article.review.reviewer } }
      : {}),
  };

  return (
    <>
      <article className="pb-[clamp(56px,8vw,96px)]">
        <header className="border-b border-white/[0.07] bg-gradient-to-b from-forest to-void pb-12 pt-[calc(76px+56px)]">
          <div className="mx-auto max-w-[820px] px-5 sm:px-8">
            <nav aria-label="Breadcrumb" className="mb-6 text-[0.72rem] uppercase tracking-[0.18em] text-cream/45">
              <Link href="/" className="hover:text-cream">
                Home
              </Link>{' '}
              /{' '}
              <Link href="/knowledge" className="hover:text-cream">
                Knowledge
              </Link>{' '}
              / <span className="text-cream/70">{article.section}</span>
            </nav>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-amber">
                {article.section} · {article.species}
              </span>
              <span className={`tag ${reviewed ? 'tag-verified' : ''}`}>{reviewLabel(article)}</span>
            </div>

            <h1 className="display text-[clamp(2rem,4.2vw,3.4rem)] text-[#fcf8f1]">{article.title}</h1>
            <p className="lede mt-6">{article.summary}</p>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/[0.07] pt-5 text-[0.78rem] text-cream/60">
              <div className="flex gap-2">
                <dt>Updated</dt>
                <dd>
                  <time dateTime={article.updated}>
                    {new Date(article.updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt>Reading time</dt>
                <dd>{article.readingMinutes} minutes</dd>
              </div>
              <div className="flex gap-2">
                <dt>Review</dt>
                <dd>{reviewed ? `Veterinary review by ${article.review.reviewer ?? 'named reviewer'}` : 'Editorial review only'}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="mx-auto max-w-[820px] px-5 pt-12 sm:px-8">
          <div className="rounded-2xl border border-amber/30 bg-amber/[0.06] p-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-gold">Build status</p>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-cream/85">
              This is a working preview: the article record (title, summary, review status, dates) is live, but the full
              body text lives in the CMS table <code className="rounded bg-void/60 px-1.5 py-0.5 text-[0.85em]">articles.body</code>{' '}
              and is not seeded in this environment. Nothing here is invented to fill the page.
            </p>
          </div>

          <div className="prose-paw mt-10 space-y-6 text-[1.05rem] leading-[1.75] text-cream/85">
            <h2 className="font-serif text-2xl text-[#fcf8f1]">What this guide covers</h2>
            <p>
              {article.section === 'costs' &&
                'A line-by-line cost model, the regional spread, and the two variables that move the total most. Prices are re-checked quarterly and the last check date appears on every table.'}
              {article.section === 'health' &&
                'The clinical sign, the timeline that makes it urgent, what a vet will look at first, and the home interventions that make things worse.'}
              {article.section === 'nutrition' &&
                'Feeding amounts by weight and life stage, the label claims that mean nothing, and when a diet change needs veterinary supervision first.'}
              {article.section === 'training' &&
                'The behaviour mechanics behind the advice, welfare evidence for each tool, and a step-by-step alternative where the evidence discourages the popular choice.'}
              {article.section === 'setup' &&
                'What to buy, what to skip, and the order to buy it in — with sizing rules that hold across brands instead of one retailer’s chart.'}
              {article.section === 'safety' &&
                'Restraint, temperature and travel physics, written for the failure modes people actually run into.'}
              {article.section === 'behaviour' &&
                'Environment design first, training second. What the animal is telling you with the behaviour, and which fixes are welfare-neutral.'}
              {article.section === 'tech' &&
                'Latency, privacy defaults, subscription traps and the settings most owners never open.'}
            </p>

            <h2 className="font-serif text-2xl text-[#fcf8f1]">Editorial record</h2>
            <ul className="space-y-2 text-[0.95rem] text-cream/75">
              <li>• Sources: {article.sources.length ? `${article.sources.length} cited` : 'cited inline at publication — none attached to this preview record'}</li>
              <li>• Affiliate links in this guide: labelled inline and in the disclosure block below</li>
              <li>• Corrections: append-only log, visible on the article history in the admin dashboard</li>
            </ul>
          </div>

          <div className="mt-12 border-t border-white/[0.07] pt-8">
            <h2 className="mb-3 font-serif text-xl text-cream">Medical disclaimer</h2>
            <p className="text-[0.88rem] leading-relaxed text-cream/65">
              PawVerdi publishes educational information, not veterinary advice. It cannot diagnose your animal, and no
              article here replaces an examination. If an animal is not eating, is struggling to breathe, has pale gums
              or is collapsed, contact an emergency veterinary service now rather than reading further.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/knowledge" className="btn btn-ghost">
              ← All guides
            </Link>
            <Link href="/marketplace" className="btn btn-ghost">
              Marketplace standards
            </Link>
          </div>
        </div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
