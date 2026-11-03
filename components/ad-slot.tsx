import Link from 'next/link';

/**
 * Ad slot.
 *
 * Two rules the component enforces:
 *  1. Nothing is ever rendered that could be mistaken for editorial — the label
 *     is part of the component, not an optional prop.
 *  2. With no booked campaign the slot renders an honest empty state instead of
 *     a grey "lorem" box or a fake banner.
 */
export default function AdSlot({
  placement,
  sponsor,
  headline,
  body,
  href,
  format = 'inline',
}: {
  placement: string;
  sponsor?: string;
  headline?: string;
  body?: string;
  href?: string;
  format?: 'inline' | 'leaderboard';
}) {
  const booked = Boolean(sponsor && headline && href);

  return (
    <aside
      aria-label={`Sponsored content — ${placement}`}
      data-placement={placement}
      className={`relative rounded-2xl border border-white/[0.08] bg-moss/70 ${format === 'leaderboard' ? 'p-8' : 'p-6'}`}
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="tag tag-ad">Sponsored</span>
        <span className="text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">{placement}</span>
      </div>

      {booked ? (
        <div>
          <p className="mb-1 text-[0.68rem] uppercase tracking-[0.2em] text-cream/55">{sponsor}</p>
          <h3 className="font-serif text-xl text-cream">{headline}</h3>
          {body && <p className="mt-2 text-sm leading-relaxed text-cream/75">{body}</p>}
          <Link href={href!} className="mt-4 inline-block text-[0.78rem] font-bold uppercase tracking-[0.14em] text-gold underline underline-offset-4">
            Visit sponsor →
          </Link>
          <p className="mt-3 text-[0.68rem] text-cream/40">
            Paid placement. Editorial rankings are never for sale and this label cannot be removed by the advertiser.
          </p>
        </div>
      ) : (
        <div>
          <h3 className="font-serif text-lg text-cream/80">This slot is unsold.</h3>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-cream/60">
            PawVerdi does not fill empty inventory with house ads or placeholder brands. When a sponsor books this
            position it will be labelled exactly like this, above the fold of the unit.
          </p>
          <Link href="/advertise" className="mt-4 inline-block text-[0.78rem] font-bold uppercase tracking-[0.14em] text-gold underline underline-offset-4">
            Advertising standards →
          </Link>
        </div>
      )}
    </aside>
  );
}
