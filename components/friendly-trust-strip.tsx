import Link from 'next/link';
export default function FriendlyTrustStrip() {
  return (
    <section className="pv-trust-strip">
      <div className="mx-auto grid max-w-wrap gap-7 px-5 py-10 sm:px-8 md:grid-cols-3">
        <div><span aria-hidden="true">♡</span><h2>Pet-first content</h2><p>Useful guidance for real everyday decisions.</p></div>
        <div><span aria-hidden="true">✓</span><h2>Clear disclosures</h2><p>Affiliate and sponsored links are marked.</p></div>
        <div><span aria-hidden="true">✦</span><h2>Research transparency</h2><p>Each guide shows its sources and review status.</p></div>
      </div>
      <p className="pb-6 text-center text-sm"><Link href="/trust">Read our editorial standards and affiliate disclosures →</Link></p>
    </section>
  );
}
