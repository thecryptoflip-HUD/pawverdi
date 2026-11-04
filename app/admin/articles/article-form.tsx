import { sections, species, reviewStatuses, type ArticleRow } from '@/lib/articles-db';
import { saveArticleAction } from './actions';

export default function ArticleForm({ article }: { article?: ArticleRow }) {
  const inputClass = 'mt-1 block w-full rounded border border-white/25 bg-forest p-3 text-cream';
  return <form action={async (data) => { 'use server'; await saveArticleAction(data); }} className="grid max-w-3xl gap-5">
    {article && <input type="hidden" name="id" value={article.id} />}
    <label>Title<input className={inputClass} name="title" required minLength={4} maxLength={140} defaultValue={article?.title ?? ''} /></label>
    <label>Slug<input className={inputClass} name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={article?.slug ?? ''} /></label>
    <label>Summary<textarea className={inputClass} name="summary" required minLength={20} maxLength={320} rows={4} defaultValue={article?.summary ?? ''} /></label>
    <label>Body<textarea className={`${inputClass} font-mono`} name="body" maxLength={20000} rows={18} defaultValue={article?.body ?? ''} /></label>
    <label>Section<select className={inputClass} name="section" defaultValue={article?.section ?? 'health'}>{sections.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
    <label>Species<select className={inputClass} name="species" defaultValue={article?.species ?? 'both'}>{species.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
    <label>Review status<select className={inputClass} name="review_status" defaultValue={article?.review_status ?? 'unreviewed'}>{reviewStatuses.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
    <label>Reviewer name<input className={inputClass} name="reviewer_name" defaultValue={article?.reviewer_name ?? ''} /></label>
    <p className="text-sm text-cream/70">Editorial and vet-reviewed status require a reviewer name longer than one character.</p>
    <button type="submit" className="w-fit rounded border border-gold px-5 py-2">Save</button>
  </form>;
}
