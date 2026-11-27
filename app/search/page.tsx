import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { completeArticles } from '@/lib/content';
import { readerPages } from '@/lib/reader-pages';
import { journalStories } from '@/lib/journal';
import { readPublicEntries } from '@/lib/publication';
import { getItems } from '@/lib/discovery';

export const metadata: Metadata = { title: 'Search PawVerdi', description: 'Search guides, shopping categories and reader information.', robots: { index: false, follow: true }, alternates: { canonical: '/search' } };

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = (typeof params.q === 'string' ? params.q : '').trim().slice(0, 120);
  const [items, articles] = await Promise.all([getItems(), readPublicEntries('article')]);
  const records = [
    ...articles.map(a => ({ title: a.title, description: a.summary || '', group: 'Article', href: '/discover/published/'+a.slug })),
    ...completeArticles.map(a => ({ title: a.title, description: a.summary, group: 'Guide', href: '/knowledge/'+a.slug })),
    ...journalStories.map(a => ({ title: a.title, description: a.summary, group: a.section, href: '/journal/'+a.slug })),
    ...Object.entries(readerPages).map(([slug,page]) => ({ title: page.title, description: page.intro, group: 'Information', href: '/'+slug })),
    ...items.map(item => ({ title: item.title, description: item.summary, group: 'Shopping', href: '/products/'+item.slug })),
  ];
  const terms = query.toLowerCase().split(/\s+/);
  const results = query ? records.filter(item => terms.every(term => (item.title+' '+item.description+' '+item.group).toLowerCase().includes(term))) : [];
  return <div className="vibrant-page"><PageHeader kicker="PawVerdi" title="Search PawVerdi" intro="Find care guides, shopping categories and information about the site.">
    <form action="/search" role="search" className="flex flex-wrap gap-3"><label className="sr-only" htmlFor="q">Search terms</label><input id="q" name="q" type="search" maxLength={120} defaultValue={query} placeholder="Search PawVerdi" className="rounded-lg border border-emerald-800 bg-white p-3 text-black"/><button className="btn btn-solid">Search</button></form>
  </PageHeader><div className="mx-auto max-w-[820px] px-5 py-12">
    {query && <h2 className="mb-5 font-serif text-2xl">{results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”</h2>}
    {query && !results.length && <p>Try a pet, topic or item such as “cat”, “carrier” or “travel”.</p>}
    {results.map(result => <article key={result.href} className="mb-6"><p className="kicker">{result.group}</p><h3 className="my-2 font-serif text-xl"><Link href={result.href} className="underline">{result.title}</Link></h3><p>{result.description}</p></article>)}
    {!query && <Link href="/knowledge" className="underline">Browse care guides</Link>}</div></div>;
}
