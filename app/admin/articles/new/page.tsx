import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleForm from '../article-form';
import { hasArticleAccess, AccessNotice } from '../access';

export const metadata: Metadata = { title: 'New article — Admin', robots: { index: false, follow: false } };
export default async function NewArticlePage() {
  if (!await hasArticleAccess()) return <AccessNotice />;
  return <main className="mx-auto max-w-wrap px-5 pb-20 pt-[calc(76px+48px)]">
    <Link href="/admin/articles" className="text-gold">Articles</Link>
    <h1 className="my-6 font-serif text-4xl">New article</h1>
    <ArticleForm />
  </main>;
}
