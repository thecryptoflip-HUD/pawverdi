import type { Metadata } from 'next';
import Link from 'next/link';
import { articles, products, reviewLabel } from '@/lib/content';
import { isLive } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Admin — content, marketplace and advertising operations',
  description: 'Internal operations dashboard for PawVerdi.',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const live = isLive();
  const vetReviewed = articles.filter((a) => a.review.status === 'vet-reviewed').length;
  const recent = [...articles].sort((a, b) => (a.updated < b.updated ? 1 : -1)).slice(0, 8);

  return (
    <div className="mx-auto max-w-wrap px-5 pb-20 pt-[calc(76px+48px)] sm:px-8">
      <header className="mb-9">
        <p className="kicker mb-4">Operations</p>
        <h1 className="display text-[clamp(1.9rem,3.4vw,2.8rem)] text-[#fcf8f1]">Admin dashboard</h1>
        <p className="lede mt-4 max-w-[62ch]">
          Content, marketplace and advertising operations in one place. Every destructive action is gated behind a review
          status, and nothing can be published while the review requirement is unmet.
        </p>
      </header>

      <div
        role="status"
        className={`mb-8 rounded-2xl border p-5 ${live ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-amber/40 bg-amber/10'}`}
      >
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-gold">
          Content mode: {live ? 'live (Supabase connected)' : 'demo (no database)'}
        </p>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-cream/80">
          {live
            ? 'Reads and writes hit Supabase Postgres under row-level security. Publishing requires an authenticated editor session.'
            : 'No Supabase credentials are set, so this dashboard is read-only over seed content. Writes return a clear "not stored" response instead of appearing to succeed. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY to switch modes.'}
        </p>
      </div>

      <section aria-label="Key metrics" className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] lg:grid-cols-4">
        {[
          { label: 'Articles', value: articles.length, note: `${vetReviewed} vet-reviewed` },
          { label: 'Products tracked', value: products.length, note: '0 scored' },
          { label: 'Listings', value: 0, note: 'verification gate closed' },
          { label: 'Ad campaigns', value: 0, note: '2 placements unsold' },
        ].map((metric) => (
          <div key={metric.label} className="bg-forest px-6 py-7">
            <p className="text-[0.64rem] uppercase tracking-[0.2em] text-cream/50">{metric.label}</p>
            <p className="mt-2 font-serif text-[2rem] leading-none text-gold">{metric.value}</p>
            <p className="mt-2 text-[0.76rem] text-cream/55">{metric.note}</p>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-2xl text-cream">Content queue</h2>
          <div className="flex flex-wrap gap-2">
            {['All', 'Needs vet review', 'Needs editorial', 'Published'].map((filter, i) => (
              <span
                key={filter}
                className={`rounded-full border px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${
                  i === 0 ? 'border-amber text-gold' : 'border-white/15 text-cream/60'
                }`}
              >
                {filter}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-moss/40">
          <table className="table min-w-[820px]">
            <caption className="sr-only">Most recently updated articles and their review state</caption>
            <thead>
              <tr>
                <th scope="col">Article</th>
                <th scope="col">Section</th>
                <th scope="col">Updated</th>
                <th scope="col">Review</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((article) => {
                const needsVet = article.review.status !== 'vet-reviewed';
                return (
                  <tr key={article.slug}>
                    <th scope="row" className="max-w-[34ch] text-left font-normal text-cream">
                      <Link href={`/knowledge/${article.slug}`} className="hover:text-gold">
                        {article.title}
                      </Link>
                    </th>
                    <td className="capitalize text-cream/70">{article.section}</td>
                    <td className="text-cream/60">
                      <time dateTime={article.updated}>
                        {new Date(article.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </time>
                    </td>
                    <td>
                      <span className={`tag ${article.review.status === 'vet-reviewed' ? 'tag-verified' : ''}`}>
                        {reviewLabel(article)}
                      </span>
                    </td>
                    <td>
                      <span
                        aria-disabled="true"
                        title={needsVet ? 'Blocked: veterinary review required before publish' : 'Requires an authenticated editor session'}
                        className="cursor-not-allowed text-[0.78rem] text-cream/35"
                      >
                        {needsVet ? 'Publish (blocked)' : 'Publish'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[0.78rem] text-cream/50">
          Publish is disabled by design: the same rule the public site states — no article ships without a named review —
          is enforced here in the UI, and enforced again by a database policy when Supabase is connected.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Marketplace intake',
            body: '0 applications in review. Verification is a manual queue: each gate has an owner, and a rejected application records the gate that failed.',
            cta: 'Open queue',
          },
          {
            title: 'Advertising',
            body: '2 placements unsold. Booking requires a category check against the refusal list before a rate card is issued.',
            cta: 'View placements',
          },
          {
            title: 'Corrections log',
            body: 'Append-only. Every correction records the original claim, the correction, the source and the reviewer.',
            cta: 'Open log',
          },
        ].map((panel) => (
          <div key={panel.title} className="rounded-2xl border border-white/[0.08] bg-moss/40 p-6">
            <h3 className="font-serif text-xl text-cream">{panel.title}</h3>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-cream/70">{panel.body}</p>
            <button
              type="button"
              disabled
              className="mt-4 cursor-not-allowed rounded-full border border-white/15 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-cream/35"
            >
              {panel.cta}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
