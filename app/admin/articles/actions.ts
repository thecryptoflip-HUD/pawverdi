'use server';
import 'server-only';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession, isStaff } from '@/lib/auth';
import { saveArticle, setPublished, importSeedArticles, type ArticleInput } from '@/lib/articles-db';
import { adminClient } from '@/lib/supabase-admin';

function finish(path: string, result: { ok: boolean; error?: string }): never {
  if (result.ok) {
    revalidatePath('/admin/articles');
    revalidatePath('/admin');
  }
  redirect(`${path}?${result.ok ? 'saved=1' : `error=${encodeURIComponent(result.error ?? 'mutation_failed')}`}`);
}
export async function saveArticleAction(formData: FormData) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) return { ok: false, error: 'Not authorised' };
  const text = (key: string) => typeof formData.get(key) === 'string' ? String(formData.get(key)).trim() : '';
  const id = text('id');
  const result = await saveArticle({
    id: id || undefined, title: text('title'), slug: text('slug'), summary: text('summary'), body: text('body'),
    section: text('section'), species: text('species'), review_status: text('review_status'), reviewer_name: text('reviewer_name'),
  } as ArticleInput);
  finish(result.ok ? `/admin/articles/${result.id}` : '/admin/articles', result);
}
async function publication(formData: FormData, publish: boolean) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) return { ok: false, error: 'Not authorised' };
  const id = String(formData.get('id') ?? '').trim();
  const result = await setPublished(id, publish);
  if (result.ok) {
    try {
      await adminClient()?.from('audit_log').insert({ actor: session.userId, action: publish ? 'article.publish' : 'article.unpublish', entity: 'article', entity_id: id });
    } catch { /* Audit availability must not fail the completed user action. */ }
  }
  finish('/admin/articles', result);
}
export async function publishAction(formData: FormData) { return publication(formData, true); }
export async function unpublishAction(formData: FormData) { return publication(formData, false); }
export async function importSeedAction() {
  const session = await getSession();
  if (!session || !isStaff(session.role)) return { ok: false, error: 'Not authorised' };
  finish('/admin/articles', await importSeedArticles());
}
