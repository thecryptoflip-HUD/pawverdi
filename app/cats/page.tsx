import type { Metadata } from 'next';
import Link from 'next/link';
import BreedSpotlight from '@/components/breed-spotlight';
import CinematicHero from '@/components/cinematic-hero';
import Reveal from '@/components/reveal';
import ReferenceDetails from '@/components/reference-details';
import PawVerdiShowcase from '@/components/pawverdi-seven-page-showcase';
import { breedsBySpecies } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Cat Center — breeds, health, nutrition, behaviour, grooming and kitten care',
  description:
    'Breed references, appetite and feeding guidance, behaviour explainers, travel safety and kitten setup for cat owners. Educational content, clearly labelled where veterinary review is pending.',
  alternates: { canonical: '/cats' },
};

const topics = [
  { key: 'health', label: 'Health', blurb: 'Appetite loss, dental care and the timelines that matter.' },
  { key: 'nutrition', label: 'Nutrition', blurb: 'Wet vs dry, water intake, portion maths.' },
  { key: 'behaviour', label: 'Behaviour', blurb: 'Litter box counts, stress signals, environment design.' },
  { key: 'grooming', label: 'Grooming', blurb: 'Coat type routines and the mats people miss.' },
  { key: 'setup', label: 'Kitten care', blurb: 'First-week setup, vaccination timing, safe spaces.' },
] as const;

export default function CatsPage() {
  const breeds = breedsBySpecies('cat');

  return (
    <div className="vibrant-page">
      <CinematicHero variant="cat"
        kicker="Cat Center"
        title={<>Make every day<br /><em>a happy cat day.</em></>}
        intro="Explore kitten essentials, enrichment, behaviour, and everyday health. Every guide states its review status and cannot replace veterinary care."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/knowledge?species=cat" className="btn btn-solid">
            Explore cat care
          </Link>
          <Link href="/shop?species=cat#gear-types" className="btn btn-ghost">
            Shop cat gear
          </Link>
        </div>
      </CinematicHero>

      <BreedSpotlight species="cat" />

      <PawVerdiShowcase variant="cat">
        <ReferenceDetails title="Cat breed reference">
      <section className="border-y border-white/[0.07] bg-forest py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="kicker mb-4">Breed reference</p>
              <h2 className="display text-[clamp(1.7rem,3vw,2.4rem)] text-[#fcf8f1]">What the label does and does not promise.</h2>
            </div>
            <p className="max-w-[34ch] text-[0.82rem] leading-relaxed text-cream/55">
              Most cats are domestic shorthairs. Temperament is individual — a breed page is a starting point for
              questions, not a personality guarantee.
            </p>
          </Reveal>

          <div className="overflow-x-auto">
            <table className="table min-w-[720px]">
              <caption className="sr-only">Cat breed reference table</caption>
              <thead>
                <tr>
                  <th scope="col">Breed</th>
                  <th scope="col">Size</th>
                  <th scope="col">Lifespan</th>
                  <th scope="col">Energy</th>
                  <th scope="col">Grooming</th>
                  <th scope="col">Note</th>
                </tr>
              </thead>
              <tbody>
                {breeds.map((breed) => (
                  <tr key={breed.slug}>
                    <th scope="row" className="text-left font-serif text-base font-normal text-cream">
                      {breed.name}
                    </th>
                    <td className="capitalize text-cream/80">{breed.size}</td>
                    <td className="text-cream/80">
                      {breed.lifespanYears[0]}–{breed.lifespanYears[1]} yrs
                    </td>
                    <td className="capitalize text-cream/80">{breed.energy}</td>
                    <td className="capitalize text-cream/80">{breed.grooming}</td>
                    <td className="max-w-[42ch] text-cream/65">{breed.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

        </ReferenceDetails>
      </PawVerdiShowcase>
    </div>
  );
}
