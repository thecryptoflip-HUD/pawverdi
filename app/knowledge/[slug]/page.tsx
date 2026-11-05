import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GuideBody from '@/components/guide-body';
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
    robots: article.guide ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title: article.title, description: article.summary, type: 'article', modifiedTime: article.updated },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();
  const reviewed = article.review.status === 'vet-reviewed' && Boolean(article.review.reviewer);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.summary,
        dateModified: article.updated,
        author: { '@type': 'Organization', name: site.name },
        publisher: { '@type': 'Organization', name: site.name },
        mainEntityOfPage: `${site.url}/knowledge/${article.slug}`,
        isAccessibleForFree: true,
        ...(reviewed ? { reviewedBy: { '@type': 'Person', name: article.review.reviewer } } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Knowledge', item: `${site.url}/knowledge` },
          { '@type': 'ListItem', position: 3, name: article.title, item: `${site.url}/knowledge/${article.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <article className="pb-[clamp(56px,8vw,96px)]">
        <header className="border-b border-white/[0.07] bg-gradient-to-b from-forest to-void pb-12 pt-[calc(76px+56px)]">
          <div className="mx-auto max-w-[820px] px-5 sm:px-8">
            <nav aria-label="Breadcrumb" className="mb-6 text-[0.72rem] uppercase tracking-[0.18em] text-cream/65">
              <Link href="/" className="hover:text-cream">Home</Link> / <Link href="/knowledge" className="hover:text-cream">Knowledge</Link> / <span>{article.section}</span>
            </nav>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-amber">{article.section} · {article.species}</span>
              <span className={`tag ${reviewed ? 'tag-verified' : ''}`}>{reviewLabel(article)}</span>
            </div>
            <h1 className="display text-[clamp(2rem,4.2vw,3.4rem)] text-[#fcf8f1]">{article.title}</h1>
            <p className="lede mt-6">{article.summary}</p>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/[0.07] pt-5 text-[0.78rem] text-cream/70">
              <div className="flex gap-2"><dt>Updated</dt><dd><time dateTime={article.updated}>{new Date(`${article.updated}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time></dd></div>
              {article.guide && <div className="flex gap-2"><dt>Reading time</dt><dd>{article.readingMinutes} minutes</dd></div>}
              <div className="flex gap-2"><dt>Review</dt><dd>{reviewed ? `Veterinary review by ${article.review.reviewer}` : article.guide ? 'Research-based; not vet-reviewed' : 'In preparation'}</dd></div>
            </dl>
          </div>
        </header>
        <div className="mx-auto max-w-[820px] px-5 pt-10 sm:px-8">
          {article.guide ? (
            <>
              <aside className="mb-8 rounded-2xl border border-white/10 bg-moss/50 p-5 text-[0.88rem] leading-relaxed text-cream/75">
                Prepared with AI assistance from the published welfare guidance cited below. No independent veterinary review or hands-on product testing is claimed. Buying priorities are PawVerdi’s recommendations, not endorsements by the cited organisations.
              </aside>
              <GuideBody guide={article.guide} />
              <section aria-labelledby="sources-heading" className="mt-12 border-t border-white/10 pt-8">
                <h2 id="sources-heading" className="font-serif text-2xl text-cream">Sources</h2>
                <p className="mt-3 text-[0.85rem] text-cream/70">UK-based welfare guidance, read on {article.guide.updated}. Care arrangements and legal requirements can vary by location.</p>
                <ul className="mt-4 space-y-3 text-[0.9rem] leading-relaxed">
                  {article.sources.map((source) => <li id={`source-${source.id}`} key={source.id} className="scroll-mt-28"><a href={source.url} rel="noopener" className="text-gold underline underline-offset-4">[{source.id}] {source.label}</a></li>)}
                </ul>
              </section>
              <section className="mt-8 border-t border-white/10 pt-6 text-[0.85rem] leading-relaxed text-cream/70">
                <h2 className="mb-2 font-serif text-xl text-cream">Affiliate disclosure</h2>
                <p>This guide contains no paid retailer links. Merchant links in our <Link href="/shop" className="text-gold underline underline-offset-4">shop</Link> state whether they are affiliate or ordinary retailer links. As an Amazon Associate, PawVerdi earns from qualifying purchases.</p>
              </section>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-amber/30 bg-amber/[0.06] p-5">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-gold">Guide in preparation</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/85">The full guide is not available yet. This page is a topic preview, not a completed article or a recommendation.</p>
              </div>
              <h2 className="mt-8 font-serif text-2xl text-cream">What this guide covers</h2>
              <p className="mt-3 leading-relaxed text-cream/75">{article.summary} The finished guide will include the supporting sources. Until then, use the complete checklists in the knowledge center.</p>
            </>
          )}
          <section className="mt-10 border-t border-white/10 pt-6">
            <h2 className="mb-2 font-serif text-xl text-cream">Medical disclaimer</h2>
            <p className="text-[0.88rem] leading-relaxed text-cream/70">This is general preparation guidance, not a diagnosis or an individual treatment plan. Contact your vet about health concerns, vaccination protection, diet changes or care for a very young animal.</p>
          </section>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/knowledge" className="btn btn-ghost">← All guides</Link>
            <Link href="/shop" className="btn btn-ghost">Browse the gear shortlist</Link>
          </div>
        </div>
      </article>
      {article.guide && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />}
    </>
  );
}
