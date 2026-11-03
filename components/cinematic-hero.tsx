import type { ReactNode } from 'react';
import { treatments, type CinematicVariant } from '@/lib/cinematic';

/**
 * Section hero with per-variant cinematic treatment.
 *
 * Server-rendered and CSS-animated: no client JS, no hydration risk, and the
 * headline is styled (not hidden) before paint. Motion is disabled under
 * prefers-reduced-motion by the global media query.
 */
export default function CinematicHero({
  variant,
  kicker,
  title,
  intro,
  children,
}: {
  variant: CinematicVariant;
  kicker: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  const t = treatments[variant];

  return (
    <section
      className="cine relative isolate overflow-hidden border-b border-white/[0.07] bg-forest"
      data-variant={variant}
      style={{ ['--accent' as string]: t.accent }}
    >
      <div className="cine-plate" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.image}
          alt=""
          width={1920}
          height={1280}
          fetchPriority="high"
          className={`cine-img cine-${t.motion}`}
          style={{ filter: t.filter, objectPosition: t.position }}
        />
      </div>

      <div className="cine-scrim" aria-hidden="true" style={{ background: t.scrim }} />
      {t.letterbox && <div className="cine-letterbox" aria-hidden="true" />}
      {t.spotlight && <div className="cine-spotlight" aria-hidden="true" />}
      {t.bokeh && <div className="cine-bokeh" aria-hidden="true" />}
      <div className="cine-beam" aria-hidden="true" />

      <div className={`relative mx-auto flex min-h-[68svh] max-w-wrap flex-col justify-center px-5 pb-16 pt-[calc(76px+72px)] sm:px-8 ${t.align === 'end' ? 'justify-end pb-[clamp(48px,7vw,84px)]' : ''}`}>
        <div className="cine-copy max-w-[720px]">
          <p className="cine-kicker mb-5">{kicker}</p>
          <h1 className="display text-[clamp(2.1rem,4.6vw,3.9rem)] text-[#fcf8f1]">{title}</h1>
          {intro && <p className="lede mt-6 max-w-[56ch]">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>

      <div className="cine-rule" aria-hidden="true" />
    </section>
  );
}
