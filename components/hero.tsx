import Link from 'next/link';

/**
 * PawVerdi editorial home: responsive, real HTML and links matching
 * the approved sunny pet-care design, never a pasted mockup.
 */
export default function Hero() {
  return (
    <section className="pv-reference-homehero" aria-labelledby="pv-home-heading">
      <div className="pv-reference-homehero-image" aria-hidden="true" />
      <div className="pv-reference-homehero-overlay" aria-hidden="true" />
      <div className="mx-auto flex min-h-[440px] max-w-wrap items-center px-5 pb-20 pt-[calc(76px+68px)] sm:px-8 lg:min-h-[550px]">
        <div className="pv-reference-homehero-copy">
          <span className="pv-reference-overline">Welcome to PawVerdi · A happier world for pets</span>
          <h1 id="pv-home-heading">Make every day<br /><em>a good pet day.</em></h1>
          <p>Helpful dog and cat care guides, everyday ideas, and thoughtfully researched gear — together in one welcoming place. Every guide shows its review status.</p>
          <div className="pv-reference-hero-links">
            <Link href="/dogs" className="pv-reference-hero-button pv-reference-hero-coral">Explore Dog Care <span aria-hidden="true">→</span></Link>
            <Link href="/cats" className="pv-reference-hero-button pv-reference-hero-cream">Explore Cat Care <span aria-hidden="true">→</span></Link>
          </div>
          <div className="pv-reference-homehero-facts">
            <span>♡ Pet-first care</span><span>✓ Clear disclosures</span><span>✦ Real published guides</span>
          </div>
        </div>
      </div>
      <span className="pv-reference-star" aria-hidden="true">✦</span>
      <span className="pv-reference-heart" aria-hidden="true">♡</span>
    </section>
  );
}
