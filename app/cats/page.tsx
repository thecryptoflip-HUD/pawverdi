import type { Metadata } from 'next';
import Link from 'next/link';
import CinematicHero from '@/components/cinematic-hero';
import Reveal from '@/components/reveal';
import ArticleCard from '@/components/article-card';
import AdSlot from '@/components/ad-slot';
import { articlesBySpecies, breedsBySpecies } from '@/lib/content';

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
  const catArticles = articlesBySpecies('cat');
  const breeds = breedsBySpecies('cat');

  return (
    <>
      <CinematicHero variant="cat"
        kicker="Cat Center"
        title={<>Cats hide illness early. The reading list should not.</>}
        intro="Appetite, litter habits, weight and dental health are the four channels cats use to tell you something is wrong. These guides cover what each signal means and when it becomes urgent."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/knowledge?species=cat" className="btn btn-solid">
            All cat guides
          </Link>
          <Link href="/knowledge/new-kitten-checklist" className="btn btn-ghost">
            New kitten checklist
          </Link>
        </div>
      </CinematicHero>

      <section className="py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-9">
            <p className="kicker mb-4">Topics</p>
            <h2 className="display text-[clamp(1.7rem,3vw,2.4rem)] text-[#fcf8f1]">Five doors into the same evidence.</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {topics.map((topic, i) => (
              <Reveal key={topic.key} delay={i * 60}>
                <Link href={`/knowledge?species=cat&section=${topic.key}`} className="card flex h-full flex-col p-6">
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-amber">0{i + 1}</span>
                  <h3 className="mt-3 font-serif text-lg text-[#fcf8f1]">{topic.label}</h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-cream/70">{topic.blurb}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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

      <section className="py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-9">
            <p className="kicker mb-4">Latest for cats</p>
            <h2 className="display text-[clamp(1.7rem,3vw,2.4rem)] text-[#fcf8f1]">Cat guides</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {catArticles.slice(0, 6).map((article, i) => (
              <Reveal key={article.slug} delay={i * 60}>
                <div className="relative h-full">
                  <ArticleCard article={article} image={['/brand/carrier.jpg', '/brand/hero.jpg', '/brand/bed.jpg'][i % 3]} />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <AdSlot placement="cats-inline-01" />
          </div>
        </div>
      </section>
    </>
  );
}
