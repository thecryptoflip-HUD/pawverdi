import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/page-header';
import { readerPages } from '@/lib/reader-pages';

type Props = { params: Promise<{ information: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(readerPages).map(information => ({ information }));
}

async function readPage({ params }: Props) {
  const { information } = await params;
  if (!Object.hasOwn(readerPages, information)) notFound();
  return { information, page: readerPages[information] };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { information, page } = await readPage(props);
  return { title: page.title, description: page.intro, alternates: { canonical: '/' + information }, openGraph: { title: page.title, description: page.intro, url: '/' + information } };
}

export default async function InformationPage(props: Props) {
  const { page } = await readPage(props);
  return <div className="vibrant-page"><PageHeader kicker="PawVerdi" title={page.title} intro={page.intro} />
    <div className="mx-auto max-w-[820px] px-5 py-14 sm:px-8">
      {page.sections.map(([heading, body]) => <section key={heading} className="mb-8">
        <h2 className="font-serif text-2xl text-cream">{heading}</h2>
        <p className="mt-3 leading-relaxed text-cream/85">{body}</p>
      </section>)}
      <nav aria-label="Related pages" className="flex flex-wrap gap-3">{page.links.map(([label, href]) => <Link key={href} href={href} className="rounded-full border border-emerald-800 px-5 py-2 font-semibold text-emerald-900 hover:bg-emerald-50">{label}</Link>)}</nav>
    </div></div>;
}
