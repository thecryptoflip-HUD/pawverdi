import type { Metadata } from 'next';
import Link from 'next/link';
import CinematicHero from '@/components/cinematic-hero';
import Reveal from '@/components/reveal';
import AdSlot from '@/components/ad-slot';

export const metadata: Metadata = {
  title: 'Marketplace — verified sellers, health disclosures and adoption',
  description:
    'How PawVerdi verifies sellers, what a listing must disclose, why the marketplace launches empty, and how adoption listings work.',
  alternates: { canonical: '/marketplace' },
};

const verificationSteps = [
  {
    step: '01',
    title: 'Identity and business legitimacy',
    body: 'Government ID matched to the trading name, company registration or sole-trader record, and a verifiable address. Licences required by local animal-sale law are checked against the issuing authority, not a screenshot the seller supplies.',
  },
  {
    step: '02',
    title: 'Welfare inspection record',
    body: 'Breeders must supply a current inspection or registration record from a recognised body (kennel club, breed council or municipal animal welfare authority). Where no scheme exists locally, the application is rejected rather than waved through.',
  },
  {
    step: '03',
    title: 'Health screening evidence',
    body: 'Breed-relevant screening results for the dam and sire, dated within their validity window. We state which scheme each result comes from so a buyer can verify it independently.',
  },
  {
    step: '04',
    title: 'Disclosure review by a human',
    body: 'Every listing must complete a structured health disclosure: vaccinations, worming, microchip, known conditions, and the reason the animal is being placed. A reviewer checks it against the seller record before publication.',
  },
  {
    step: '05',
    title: 'Scam and trafficking pattern checks',
    body: 'Reverse-image search on all photos, deposit-request analysis, cross-marketplace duplicate detection and refusal of any listing that requires payment before a viewing. Repeat attempts are barred permanently.',
  },
];

export default function MarketplacePage() {
  return (
    <>
      <CinematicHero variant="marketplace"
        kicker="Marketplace"
        title={<>A listing here has to survive five checks before a stranger sees it.</>}
        intro="PawVerdi is an education platform that also hosts listings — not a classifieds board with a logo. Sellers are verified by a person, animals are never shipped as cargo, and adoption is presented alongside purchase at the same level of detail."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="#sellers" className="btn btn-solid">
            Seller requirements
          </Link>
          <Link href="#adoption" className="btn btn-ghost">
            Adoption first
          </Link>
        </div>
      </CinematicHero>

      <section className="py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-10 max-w-[640px]">
            <p className="kicker mb-4">Current state</p>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.6rem)] text-[#fcf8f1]">0 listings published.</h2>
            <p className="lede mt-4">
              That number is real. Launch inventory is limited to sellers who have completed verification, and no animal
              is listed before its disclosure is reviewed. We would rather open with an empty marketplace than seed it
              with invented puppies to look established.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Applications in review', '0', 'A seller appears here only after submitting the full document set.'],
              ['Verified sellers', '0', 'Verification includes an on-record welfare inspection, not a self-declaration.'],
              ['Listings rejected', '0', 'Rejections are logged with a reason code for audit.'],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-2xl border border-white/[0.08] bg-moss/60 p-6">
                <p className="text-[0.66rem] uppercase tracking-[0.2em] text-cream/50">{label}</p>
                <p className="mt-2 font-serif text-[2.2rem] leading-none text-gold">{value}</p>
                <p className="mt-3 text-[0.84rem] leading-relaxed text-cream/60">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sellers" className="border-y border-white/[0.07] bg-forest py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-10 max-w-[640px]">
            <p className="kicker mb-4">Verification</p>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.6rem)] text-[#fcf8f1]">The five gates.</h2>
          </Reveal>
          <ol className="grid gap-4 lg:grid-cols-2">
            {verificationSteps.map((item, i) => (
              <Reveal key={item.step} delay={i * 60}>
                <li className="h-full rounded-2xl border border-white/[0.08] bg-moss/50 p-6">
                  <span className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-amber">Gate {item.step}</span>
                  <h3 className="mt-2 font-serif text-xl text-cream">{item.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-cream/70">{item.body}</p>
                </li>
              </Reveal>
            ))}
            <Reveal delay={300}>
              <li className="h-full rounded-2xl border border-white/[0.08] bg-moss/50 p-6">
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-amber">Never acceptable</span>
                <h3 className="mt-2 font-serif text-xl text-cream">Refusal list</h3>
                <ul className="mt-3 space-y-2 text-[0.9rem] leading-relaxed text-cream/70">
                  {[
                    'Animals shipped as air cargo or by unaccompanied courier',
                    'Deposits requested before a viewing, in any form',
                    'Listings without microchip, vaccination and worming records',
                    'Breeders selling litters under eight weeks old',
                    'Any listing that presents a banned breed or procedure as available on request',
                  ].map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-1.5 h-1 w-1 flex-none rounded-full bg-amber" />
                      {line}
                    </li>
                  ))}
                </ul>
              </li>
            </Reveal>
          </ol>
        </div>
      </section>

      <section id="adoption" className="py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto grid max-w-wrap gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="kicker mb-4">Adoption</p>
            <h2 className="display text-[clamp(1.7rem,3vw,2.4rem)] text-[#fcf8f1]">Shelters list free. Forever.</h2>
            <p className="lede mt-4">
              Rescue and municipal shelter listings carry no fee to the organisation and no commission to us. They sit in
              the same search results as breeder listings, with the same disclosure detail — there is no paid boost that
              can push a breeder above a shelter animal.
            </p>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-cream/70">
              If a buyer is a good fit for a rescue animal, a listing here will say so. That is a commercial cost we accept:
              the platform exists to place animals well, not to maximise transaction value.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl border border-white/[0.08] bg-moss/60 p-7">
              <h3 className="font-serif text-xl text-cream">Adoption listings</h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-cream/70">
                Empty until partner organisations are onboarded. Application requires charity or municipal registration
                plus a named welfare contact who can answer buyer questions.
              </p>
              <dl className="mt-5 space-y-3 border-t border-white/[0.07] pt-4 text-[0.86rem]">
                {[
                  ['Partner organisations', '0'],
                  ['Adoption listings live', '0'],
                  ['Fee to shelters', '£0 / $0'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-cream/60">{k}</dt>
                    <dd className="font-semibold text-cream">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/contact" className="btn btn-ghost mt-6 w-full justify-center">
                Apply as a shelter
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/[0.07] bg-forest py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-8 max-w-[640px]">
            <p className="kicker mb-4">Seller application</p>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.5rem)] text-[#fcf8f1]">Start the verification.</h2>
            <p className="lede mt-4">
              Submit the form and a reviewer responds within five working days. Applications that fail a gate are told
              which gate, and what evidence would change the decision.
            </p>
          </Reveal>

          <Reveal>
            <form className="grid max-w-[720px] gap-4 rounded-2xl border border-white/[0.08] bg-moss/60 p-7" aria-describedby="seller-note">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
                  Trading name
                  <input required name="trading_name" className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" />
                </label>
                <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
                  Country
                  <input required name="country" className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" />
                </label>
                <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
                  Contact email
                  <input required type="email" name="email" className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" />
                </label>
                <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
                  Licence or registration number
                  <input required name="licence" className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
                Which schemes can you evidence?
                <textarea name="schemes" rows={3} className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" placeholder="Kennel club registration, breed health screening, municipal inspection…" />
              </label>
              <button type="submit" className="btn btn-solid mt-2 w-full justify-center sm:w-auto">
                Submit application
              </button>
              <p id="seller-note" className="text-[0.74rem] leading-relaxed text-cream/50">
                In this build the form is wired to <code className="text-cream/70">/api/seller-application</code>, which
                validates input and writes to Supabase when it is connected. In demo mode it returns a clear
                &ldquo;not stored&rdquo; response instead of pretending to save your data.
              </p>
            </form>
          </Reveal>

          <div className="mt-10">
            <AdSlot placement="marketplace-inline-01" />
          </div>
        </div>
      </section>
    </>
  );
}
