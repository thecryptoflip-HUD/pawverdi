import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/page-header';
import { journalStories, journalDate } from '@/lib/journal';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return journalStories.map(({slug}) => ({slug})); }
async function readStory({ params }: Props) {
  const {slug} = await params;
  return journalStories.find(story => story.slug === slug) ?? notFound();
}
export async function generateMetadata(props: Props): Promise<Metadata> {
  const story = await readStory(props);
  return { title: story.title, description: story.summary, alternates: { canonical: '/journal/'+story.slug }, openGraph: { type: 'article', title: story.title, description: story.summary, publishedTime: journalDate } };
}
export default async function Story(props: Props) {
  const story = await readStory(props);
  return <article className="vibrant-page"><PageHeader kicker={story.section} title={story.title} intro={story.summary}/>
    <div className="mx-auto max-w-[820px] px-5 py-12"><p className="mb-8">PawVerdi editorial · <time dateTime={journalDate}>November 27, 2026</time></p>
      {story.paragraphs.map(([title, body]) => <section key={title} className="mb-7"><h2 className="mb-2 font-serif text-2xl">{title}</h2><p className="leading-relaxed">{body}</p></section>)}
      <p className="mb-8 text-sm">Prepared with AI assistance. This story contains no paid retailer links.</p><h2 className="font-serif text-xl">More from the journal</h2>
      <ul>{journalStories.filter(other => other.slug !== story.slug).map(other => <li key={other.slug}><Link className="underline" href={'/journal/'+other.slug}>{other.title}</Link></li>)}</ul></div></article>;
}
