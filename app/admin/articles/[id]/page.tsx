import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/articles-db';
import ArticleForm from '../article-form';
import { publishAction, unpublishAction } from '../actions';
import { hasArticleAccess, AccessNotice, Feedback } from '../access';

export const metadata: Metadata = { title: 'Edit article — Admin', robots: { index: false, follow: false } };
export default async function EditArticlePage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  if (!await hasArticleAccess()) return <AccessNotice />;
  const { id } = await params;
  let article;
  try { article = await getArticle(id); } catch {
    return <main className="mx-auto max-w-wrap px-5 pb-20 pt-[calc(76px+48px)]"><Link href="/admin/articles">Articles</Link><p role="alert">Unable to load article. Check the database connection and try again.</p></main>;
  }
  if (!article) notFound();
  const canPublish = article.review_status === 'vet-reviewed' && Boolean(article.reviewer_name?.trim());
  return <main className="mx-auto max-w-wrap px-5 pb-20 pt-[calc(76px+48px)]">
    <Link href="/admin/articles" className="text-gold">Articles</Link>
    <h1 className="my-6 font-serif text-4xl">Edit article</h1>
    <Feedback {...await searchParams} />
    <ArticleForm article={article} />
    <section aria-label="Publication" className="mt-8 space-y-4">
      <p>Published: {article.published_at ?? 'Draft'}</p><p>Updated: {article.updated_at}</p>
      {!canPublish && <p id="publish-gate">Publish requires vet-reviewed status and a named reviewer</p>}
      <form action={async (data) => { 'use server'; await publishAction(data); }}>
        <input type="hidden" name="id" value={article.id} />
        <button type="submit" disabled={!canPublish} aria-describedby={!canPublish ? 'publish-gate' : undefined} className="rounded border border-gold px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40">Publish</button>
      </form>
      <form action={async (data) => { 'use server'; await unpublishAction(data); }}>
        <input type="hidden" name="id" value={article.id} />
        <button type="submit" disabled={!article.published_at} className="rounded border border-gold px-4 py-2 disabled:opacity-40">Unpublish</button>
      </form>
    </section>
  </main>;
}
