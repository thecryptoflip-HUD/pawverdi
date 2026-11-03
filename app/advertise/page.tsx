import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/page-header';
import Reveal from '@/components/reveal';

export const metadata: Metadata = {
  title: 'Advertise — standards, formats and inventory',
  description:
    'PawVerdi advertising standards: labelling requirements, refused categories, placement inventory and how to enquire. Editorial rankings are never for sale.',
  alternates: { canonical: '/advertise' },
};

const formats = [
  {
    name: 'Leaderboard unit',
    placement: 'Top of section pages and the homepage body',
    detail: '728×90 or fluid. Label sits above the creative, inside the unit. Cannot be styled to resemble editorial.',
  },
  {
    name: 'Inline unit',
    placement: 'Between article cards and within guides',
    detail: 'Fluid, max 640px. Contextual categories only: nutrition, gear, insurance, training.',
  },
  {
    name: 'Featured listing',
    placement: 'Marketplace results',
    detail: 'Only available to sellers who have passed all five verification gates. Always marked "Featured" and can never outrank a shelter listing.',
  },
  {
    name: 'Newsletter slot',
    placement: 'Monthly digest',
    detail: 'One sponsor per send, text-only, clearly prefixed "Paid message". No list rental, no third-party tracking pixels.',
  },
];

const refused = [
  'Puppy or kitten mills, brokers, or any seller who cannot evidence a welfare inspection',
  'Banned or restricted breed sales, and any listing offering docked ears or tails',
  'Unproven medical claims, supplements promising to treat or cure disease',
  'Weight-loss or "raw only" diets targeting anxious new owners',
  'Anything that requires a deposit before a viewing',
  'Gambling, payday lending and anything aimed at children',
];

export default function AdvertisePage() {
  return (
    <>
      <PageHeader
        kicker="Advertising"
        title={<>The label is not negotiable. The ranking is not for sale.</>}
        intro="PawVerdi runs on labelled advertising and affiliate commissions. Both are capped by editorial independence: an advertiser cannot buy a place in a comparison table, cannot review copy before publication, and cannot remove the sponsored label."
      />

      <section className="py-[clamp(48px,7vw,88px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-9 max-w-[640px]">
            <p className="kicker mb-4">Inventory</p>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.5rem)] text-[#fcf8f1]">Four formats, four rules.</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {formats.map((format, i) => (
              <Reveal key={format.name} delay={i * 60}>
                <div className="h-full rounded-2xl border border-white/[0.08] bg-moss/50 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-serif text-xl text-cream">{format.name}</h3>
                    <span className="tag tag-ad">Unsold</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.18em] text-cream/45">{format.placement}</p>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-cream/70">{format.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-forest py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto grid max-w-wrap gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="kicker mb-4">Refusals</p>
            <h2 className="display text-[clamp(1.7rem,3vw,2.4rem)] text-[#fcf8f1]">What we will not take money for.</h2>
            <ul className="mt-6 space-y-3 text-[0.95rem] leading-relaxed text-cream/80">
              {refused.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-amber" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.85rem] leading-relaxed text-cream/55">
              Refusal decisions are recorded with the category that triggered them. A refused advertiser can ask for the
              reason in writing — and can appeal once, to a reviewer who does not handle sales.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <form action="/api/advertise" method="post" className="grid gap-4 rounded-2xl border border-white/[0.08] bg-moss/70 p-7">
              <h3 className="font-serif text-xl text-cream">Enquire about inventory</h3>
              <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
                Company
                <input required name="company" className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" />
              </label>
              <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
                Work email
                <input required type="email" name="email" className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" />
              </label>
              <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
                What are you advertising?
                <textarea required name="campaign" rows={3} className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" />
              </label>
              <button type="submit" className="btn btn-solid mt-1 w-full justify-center">
                Send enquiry
              </button>
              <p className="text-[0.74rem] leading-relaxed text-cream/50">
                Enquiries route to <code className="text-cream/70">/api/advertise</code>; in demo mode the endpoint confirms
                validation but does not store data. Rate card is sent after the category check, not before.
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="py-[clamp(48px,7vw,84px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <div className="rounded-2xl border border-white/[0.08] bg-moss/40 p-8">
            <p className="kicker mb-3">Disclosure</p>
            <h2 className="font-serif text-2xl text-cream">How paid content is marked</h2>
            <p className="mt-3 max-w-[70ch] text-[0.94rem] leading-relaxed text-cream/75">
              Every commercial unit carries a <span className="tag tag-ad ml-1">Sponsored</span> label rendered by the
              component itself, above the creative. Affiliate links inside editorial carry{' '}
              <code className="text-cream/80">rel=&quot;sponsored&quot;</code> and an inline marker. Newsletter sponsorship
              is prefixed &ldquo;Paid message&rdquo; in the subject line as well as the body.{' '}
              <Link href="/trust#disclosure" className="text-gold underline underline-offset-4">
                Read the full disclosure policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
