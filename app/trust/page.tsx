import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/page-header';

export const metadata: Metadata = {
  title: 'Trust — editorial policy, affiliate disclosure and seller standards',
  description:
    'How PawVerdi sources information, when veterinary review is required, how paid content is labelled, and the standards sellers must meet.',
  alternates: { canonical: '/trust' },
};

const blocks = [
  {
    id: 'editorial',
    title: 'Editorial policy',
    points: [
      'Every factual claim in a guide is traceable to a primary source: peer-reviewed literature, regulator guidance, breed-club health schemes or a named manufacturer specification. A claim without a source is cut, not softened.',
      'Articles carry one of three review states — unreviewed, editorial, vet-reviewed. The badge shown publicly is generated from the record, never typed by hand.',
      'Corrections are append-only and dated. When we change a recommendation, the change and its reason stay on the record.',
      'Prices are re-checked on a schedule and each row shows the date it was last verified. Stale prices are removed rather than left to age.',
    ],
  },
  {
    id: 'medical',
    title: 'Medical and health information',
    points: [
      'Educational content only. Nothing on PawVerdi diagnoses an animal, prescribes a treatment, or replaces an examination by a licensed veterinarian.',
      'Clinical claims require veterinary review before publication. Until that review happens, the article says so at the top of the page.',
      'Emergency signs are separated from routine ones and always carry a "contact a vet now" action rather than a home-remedy suggestion.',
      'No dosage instructions are published: dosing is weight-, species- and formulation-specific, and a generic table is a safety hazard.',
    ],
  },
  {
    id: 'disclosure',
    title: 'Affiliate disclosure',
    points: [
      'PawVerdi earns a commission when you buy through a marked link. The price you pay is the same as buying directly.',
      'Every paid link carries rel="sponsored" and an inline marker. The disclosure block on each commercial page is rendered by the component itself and cannot be dropped by an editor.',
      'Commission rates never determine placement. When the cheaper product is the better one, we say so, including when it pays us nothing.',
      'No brand reviews copy before publication, and no brand has paid for a mention, a ranking, or a position in any comparison table.',
    ],
  },
  {
    id: 'sellers',
    title: 'Seller and listing standards',
    points: [
      'Sellers pass identity, licence, welfare-inspection, health-screening and disclosure review before a listing is visible. Each gate has a named owner.',
      'Every animal listing must state microchip status, vaccinations, worming, known health conditions, and the reason the animal is being placed.',
      'Animals are never shipped as cargo. Collection, or transport that a buyer arranges and supervises, is the only route.',
      'Deposits before a viewing are prohibited. Listings requesting one are removed and the account is barred.',
      'Shelter and rescue listings are free, always. No paid placement can outrank an adoption listing.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy and data',
    points: [
      'We collect the minimum needed to run the newsletter and seller review: an email address, and for sellers, the documents required by the verification gates.',
      'No third-party advertising pixels. Sponsor reporting is aggregate and does not identify individual readers.',
      'Seller identity documents are stored encrypted, access-logged, and deleted 12 months after a listing is withdrawn, or on request.',
      'You can request deletion of your data at any time; it is actioned within 30 days and confirmed in writing.',
    ],
  },
];

export default function TrustPage() {
  return (
    <>
      <PageHeader
        kicker="Trust & safety"
        title={<>The rules we publish are the rules we run on.</>}
        intro="This page is the contract: how information is sourced, when a veterinarian has to sign off, how paid content is labelled, and what a seller must prove before an animal appears on this site."
      >
        <div className="flex flex-wrap gap-2">
          {blocks.map((block) => (
            <Link
              key={block.id}
              href={`#${block.id}`}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-cream/70 hover:border-amber hover:text-gold"
            >
              {block.title}
            </Link>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-wrap px-5 py-16 sm:px-8">
        <div className="grid gap-0">
          {blocks.map((block) => (
            <section key={block.id} id={block.id} className="scroll-mt-28 border-t border-white/[0.07] py-10 first:border-t-0 first:pt-0">
              <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] text-[#fcf8f1]">{block.title}</h2>
              <ul className="mt-5 space-y-3.5">
                {block.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[0.97rem] leading-relaxed text-cream/80">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-amber" />
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-moss/50 p-7">
          <h2 className="font-serif text-xl text-cream">If we get it wrong</h2>
          <p className="mt-2 max-w-[70ch] text-[0.94rem] leading-relaxed text-cream/75">
            Email <a className="text-gold underline underline-offset-4" href="mailto:PawVerdi@hotmail.com">PawVerdi@hotmail.com</a>{' '}
            with the URL and the claim. Corrections that change a recommendation are published with a dated note; factual
            errors that affect animal safety are corrected within 24 hours and the correction is announced in the
            newsletter.
          </p>
        </div>
      </div>
    </>
  );
}
