import Link from 'next/link';
import type { Article } from '@/lib/content';
import { reviewLabel } from '@/lib/content';

const sectionTone: Record<string, string> = {
  costs: 'Costs',
  health: 'Health',
  nutrition: 'Nutrition',
  training: 'Training',
  grooming: 'Grooming',
  safety: 'Safety',
  setup: 'Setup',
  behaviour: 'Behaviour',
  tech: 'Tech',
};

export default function ArticleCard({ article, image }: { article: Article; image?: string }) {
  const reviewed = article.review.status === 'vet-reviewed';
  return (
    <article className="card group flex flex-col">
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover saturate-[.85] brightness-90 transition-transform duration-700 group-hover:scale-105 group-hover:saturate-100 group-hover:brightness-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-moss via-moss/25 to-transparent" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-amber">
            {sectionTone[article.section] ?? article.section} · {article.species}
          </span>
          <span className={`tag ${reviewed ? 'tag-verified' : ''}`}>{reviewLabel(article)}</span>
        </div>
        <h3 className="font-serif text-[1.28rem] leading-snug text-[#fcf8f1]">
          <Link href={`/knowledge/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2.5 flex-1 text-[0.94rem] leading-relaxed text-cream/80">{article.summary}</p>
        <div className="mt-5 flex items-center justify-between text-[0.72rem] uppercase tracking-[0.14em] text-cream/55">
          <span>{article.readingMinutes} min read</span>
          <time dateTime={article.updated}>
            Updated{' '}
            {new Date(article.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </time>
        </div>
      </div>
    </article>
  );
}
