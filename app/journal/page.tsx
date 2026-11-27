import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { readPublicEntries } from '@/lib/publication';
import { journalStories } from '@/lib/journal';

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: 'Pet lifestyle journal', description: 'Practical stories about travel, grooming and seasonal life with pets.', alternates: { canonical: '/journal' } };
export default async function Journal() {
  const articles = await readPublicEntries('article');
  const stories = [...articles.map(a => ({slug:a.slug,title:a.title,section:a.category || 'Editorial',summary:a.summary,href:'/discover/published/'+a.slug})), ...journalStories.map(s => ({...s,href:'/journal/'+s.slug}))];
  return <div className="vibrant-page"><PageHeader kicker="The journal" title="Living with pets" intro="Small preparations and routines for the home you share." />
    <div className="mx-auto max-w-[820px] px-5 py-12">{stories.map(story => <article className="mb-8" key={story.href}><p className="kicker">{story.section}</p><h2 className="my-2 font-serif text-2xl"><Link className="underline" href={story.href}>{story.title}</Link></h2><p>{story.summary}</p></article>)}</div></div>;
}
