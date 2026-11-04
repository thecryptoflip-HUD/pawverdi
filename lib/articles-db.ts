import 'server-only';
import { z } from 'zod';
import { articles } from '@/lib/content';
import { serverSupabase } from '@/lib/supabase-server';

export const sections = ['costs', 'health', 'nutrition', 'training', 'grooming', 'safety', 'setup', 'behaviour', 'tech'] as const;
export const species = ['dog', 'cat', 'both'] as const;
export const reviewStatuses = ['unreviewed', 'editorial', 'vet-reviewed'] as const;
export type ArticleRow = {
  id: string; slug: string; title: string; summary: string; body: string | null;
  section: typeof sections[number]; species: typeof species[number];
  review_status: typeof reviewStatuses[number]; reviewer_name: string | null;
  reviewed_at: string | null; published_at: string | null; updated_at: string;
};
const columns = 'id,slug,title,summary,body,section,species,review_status,reviewer_name,reviewed_at,published_at,updated_at';
const schema = z.object({
  id: z.string().trim().uuid().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens for the slug.'),
  title: z.string().trim().min(4).max(140), summary: z.string().trim().min(20).max(320),
  body: z.string().trim().max(20000).nullish(), section: z.enum(sections), species: z.enum(species),
  review_status: z.enum(reviewStatuses), reviewer_name: z.string().trim().nullish(),
}).refine((v) => v.review_status === 'unreviewed' || (v.reviewer_name?.length ?? 0) > 1,
  { message: 'Editorial and vet-reviewed articles require a reviewer name longer than one character.' });
export type ArticleInput = z.input<typeof schema>;
type Failure = { ok: false; error: string };
const unavailable: Failure = { ok: false, error: 'Database unavailable; changes were not stored.' };
export async function listArticles(): Promise<ArticleRow[]> {
  const db = await serverSupabase();
  if (!db) throw new Error('Database unavailable.');
  const { data, error } = await db.from('articles').select(columns).order('updated_at', { ascending: false });
  if (error) throw new Error('Unable to load articles.');
  return data as ArticleRow[];
}
export async function getArticle(id: string): Promise<ArticleRow | null> {
  if (!z.string().uuid().safeParse(id).success) return null;
  const db = await serverSupabase();
  if (!db) throw new Error('Database unavailable.');
  const { data, error } = await db.from('articles').select(columns).eq('id', id).maybeSingle();
  if (error) throw new Error('Unable to load article.');
  return data as ArticleRow | null;
}
export async function saveArticle(input: ArticleInput): Promise<{ ok: true; id: string } | Failure> {
  try {
    const parsed = schema.safeParse(input);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
    const { id, ...values } = parsed.data;
    const db = await serverSupabase();
    if (!db) return unavailable;
    const row = { ...values, body: values.body || null, reviewer_name: values.reviewer_name || null, updated_at: new Date().toISOString() };
    const query = id ? db.from('articles').update(row).eq('id', id) : db.from('articles').insert(row);
    const { data, error } = await query.select('id').single();
    if (error) return { ok: false, error: error.code === '23505' ? 'An article with this slug already exists.' : 'Unable to save article. Check your access and review details.' };
    return { ok: true, id: data.id };
  } catch { return { ok: false, error: 'Unable to save article.' }; }
}
export async function setPublished(id: string, publish: boolean): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!z.string().uuid().safeParse(id).success) return { ok: false, error: 'Invalid article ID.' };
    const db = await serverSupabase();
    if (!db) return unavailable;
    const article = await getArticle(id);
    if (!article) return { ok: false, error: 'Article not found.' };
    if (publish && (article.review_status !== 'vet-reviewed' || !article.reviewer_name?.trim())) {
      return { ok: false, error: 'Publish requires vet-reviewed status and a named reviewer' };
    }
    const now = new Date().toISOString();
    const values = publish ? { published_at: now, reviewed_at: article.reviewed_at ?? now, updated_at: now } : { published_at: null, updated_at: now };
    let query = db.from('articles').update(values).eq('id', id);
    if (publish) {
      // Match the checked review values so a concurrent edit cannot bypass the gate.
      query = query.eq('review_status', 'vet-reviewed').eq('reviewer_name', article.reviewer_name!);
    }
    const { error } = await query.select('id').single();
    return error ? { ok: false, error: 'Unable to change publication status. Reload and check review details.' } : { ok: true };
  } catch { return { ok: false, error: 'Unable to change publication status.' }; }
}
export async function importSeedArticles(): Promise<{ ok: true; inserted: number; updated: number } | Failure> {
  try {
    const db = await serverSupabase();
    if (!db) return unavailable;
    const { data, error } = await db.from('articles').select('slug').in('slug', articles.map((a) => a.slug));
    if (error) return { ok: false, error: 'Unable to check existing articles.' };
    const existing = new Set(data.map((a) => a.slug));
    const rows = articles.filter((a) => !existing.has(a.slug)).map((a) => ({
      slug: a.slug, title: a.title, summary: a.summary, section: a.section, species: a.species,
      review_status: 'unreviewed', reviewer_name: null, body: null,
      // The DB guard trigger refuses published_at on unreviewed rows, and these seed
      // guides have no named reviewer — importing them as published would require
      // inventing one. They land as drafts for a human to review and publish.
      published_at: null, updated_at: a.updated,
    }));
    if (!rows.length) return { ok: true, inserted: 0, updated: 0 };
    const { error: writeError } = await db.from('articles').upsert(rows, { onConflict: 'slug', ignoreDuplicates: false });
    if (writeError) return { ok: false, error: 'Unable to import seed articles.' };
    return { ok: true, inserted: rows.length, updated: 0 };
  } catch { return { ok: false, error: 'Unable to import seed articles.' }; }
}
