import type { Metadata } from 'next';
import Link from 'next/link';
import { listArticles, type ArticleRow } from '@/lib/articles-db';
import { importSeedAction } from './actions';
import { hasArticleAccess, AccessNotice, Feedback } from './access';

export const metadata: Metadata = { title: 'Articles — Admin', robots: { index: false, follow: false } };
export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  if (!await hasArticleAccess()) return <AccessNotice />;
  const params = await searchParams;
  let rows: ArticleRow[] = [];
  let loadError = '';
  try { rows = await listArticles(); } catch { loadError = 'Unable to load articles. Check the database connection and try again.'; }
  return <main className="mx-auto max-w-wrap px-5 pb-20 pt-[calc(76px+48px)]">
    <Link href="/admin" className="text-gold">Admin dashboard</Link>
    <h1 className="my-6 font-serif text-4xl">Articles</h1>
    <div className="mb-6 flex flex-wrap gap-5">
      <Link href="/admin/articles/new" className="rounded border border-gold px-4 py-2">New article</Link>
      <form action={async () => { 'use server'; await importSeedAction(); }}><button className="rounded border border-gold px-4 py-2" type="submit">Import seed articles</button></form>
    </div>
    <Feedback {...params} />
    {loadError ? <p role="alert">{loadError}</p> : <>
      <p className="mb-6">{rows.length} total / {rows.filter((a) => a.published_at).length} published / {rows.filter((a) => a.review_status !== 'vet-reviewed' || !a.reviewer_name?.trim()).length} awaiting review</p>
      {!rows.length ? <p>The articles table is empty. Use “Import seed articles” above to add the seed guides, or create a new article.</p> : <div className="overflow-x-auto">
        <table className="table min-w-[850px]">
          <caption className="sr-only">Articles ordered by most recently updated</caption>
          <thead><tr>{['Title', 'Section', 'Species', 'Review', 'Published', 'Updated', 'Action'].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead>
          <tbody>{rows.map((a) => <tr key={a.id}>
            <th scope="row" className="text-left font-normal">{a.title}</th><td>{a.section}</td><td>{a.species}</td>
            <td><span className={`tag ${a.review_status === 'vet-reviewed' ? 'tag-verified' : ''}`}>{a.review_status}</span></td>
            <td>{a.published_at ? <time dateTime={a.published_at}>{new Date(a.published_at).toLocaleDateString('en-US', { timeZone: 'UTC' })}</time> : 'Draft'}</td>
            <td><time dateTime={a.updated_at}>{new Date(a.updated_at).toLocaleDateString('en-US', { timeZone: 'UTC' })}</time></td>
            <td><Link href={`/admin/articles/${a.id}`} className="text-gold">Edit<span className="sr-only"> {a.title}</span></Link></td>
          </tr>)}</tbody>
        </table>
      </div>}
    </>}
  </main>;
}
