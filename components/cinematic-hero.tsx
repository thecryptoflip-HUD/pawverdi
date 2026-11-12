import type { ReactNode } from 'react';
import { treatments, type CinematicVariant } from '@/lib/cinematic';

const animalLabel: Record<CinematicVariant, string> = {
  dog: 'Dog care', cat: 'Cat care', knowledge: 'Knowledge and care', marketplace: 'Responsible pet connections',
  shop: 'Shop thoughtfully', community: 'For pet people',
};
export default function CinematicHero({
  variant, kicker, title, intro, children,
}: {
  variant: CinematicVariant;
  kicker: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  const t = treatments[variant];
  return (
    <section className={`pv-section-hero cine pv-hero-${variant}`} data-variant={variant} aria-label={kicker}>
      <div className="mx-auto grid max-w-wrap items-center gap-7 px-5 pb-12 pt-[calc(76px+48px)] sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-14 lg:pb-20 lg:pt-[calc(76px+72px)]">
        <div className="pv-section-hero-copy">
          <span className="pv-eyebrow"><span aria-hidden="true">✦</span> {kicker}</span>
          <h1 className="pv-display mt-5">{title}</h1>
          {intro && <p className="pv-hero-description mt-6">{intro}</p>}
          {children && <div className="pv-hero-actions mt-8">{children}</div>}
          <p className="pv-mini-note mt-7">Practical information. Thoughtful choices. Clear disclosures.</p>
        </div>
        <div className="pv-section-hero-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.image} alt={`PawVerdi ${animalLabel[variant]} artwork`} width={1920} height={1280} className="pv-section-hero-photo" fetchPriority="high" style={{ objectPosition: t.position }} />
          <span className="pv-art-spark pv-art-spark-one" aria-hidden="true">✦</span>
          <span className="pv-art-spark pv-art-spark-two" aria-hidden="true">♥</span>
        </div>
      </div>
    </section>
  );
}
