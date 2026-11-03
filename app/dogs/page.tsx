import type { Metadata } from 'next';
import Link from 'next/link';
import CinematicHero from '@/components/cinematic-hero';
import Reveal from '@/components/reveal';
import ArticleCard from '@/components/article-card';
import AdSlot from '@/components/ad-slot';
import { articlesBySpecies, breedsBySpecies } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Dog Center — breeds, health, nutrition, training, grooming and puppy care',
  description:
    'Breed references, health guidance, feeding amounts, training tools and puppy setup for dog owners. Every article states whether it has been editorially or veterinary reviewed.',
  alternates: { canonical: '/dogs' },
};

const topics = [
  { key: 'health', label: 'Health', blurb: 'Symptoms, timelines and when to call a vet.' },
  { key: 'nutrition', label: 'Nutrition', blurb: 'Portion maths, ingredient claims, life-stage changes.' },
  { key: 'training', label: 'Training', blurb: 'Tools, welfare evidence and walking mechanics.' },
  { key: 'grooming', label: 'Grooming', blurb: 'Coat care by type, nail and ear routines.' },
  { key: 'setup', label: 'Puppy care', blurb: 'First-week setup, crates, beds, checklists.' },
] as const;

export default function DogsPage() {
  const dogArticles = articlesBySpecies('dog');
  const breeds = breedsBySpecies('dog');

  return (
    <>
      <CinematicHero variant="dog"
        kicker="Dog Center"
        title={<>Everything a dog actually needs — and the cost of getting it wrong.</>}
        intro="Breed references, feeding amounts, training tool evidence and puppy setup, written so you can decide in one read. Educational content is not a substitute for a veterinary examination."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/knowledge?species=dog" className="btn btn-solid">
            All dog guides
          </Link>
          <Link href="/knowledge/new-puppy-checklist" className="btn btn-ghost">
            New puppy checklist
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
                <Link href={`/knowledge?species=dog&section=${topic.key}`} className="card flex h-full flex-col p-6">
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
              <h2 className="display text-[clamp(1.7rem,3vw,2.4rem)] text-[#fcf8f1]">Know the default before you meet the dog.</h2>
            </div>
            <p className="max-w-[34ch] text-[0.82rem] leading-relaxed text-cream/55">
              Breed entries describe tendencies, not guarantees. Health notes link to kennel-club screening schemes
              rather than restating them as fact.
            </p>
          </Reveal>

          <div className="overflow-x-auto">
            <table className="table min-w-[720px]">
              <caption className="sr-only">Dog breed reference table</caption>
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
            <p className="kicker mb-4">Latest for dogs</p>
            <h2 className="display text-[clamp(1.7rem,3vw,2.4rem)] text-[#fcf8f1]">Dog guides</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {dogArticles.slice(0, 6).map((article, i) => (
              <Reveal key={article.slug} delay={i * 60}>
                <div className="relative h-full">
                  <ArticleCard article={article} image={['/brand/bed.jpg', '/brand/gear.jpg', '/brand/hero.jpg'][i % 3]} />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <AdSlot placement="dogs-inline-01" />
          </div>
        </div>
      </section>
    </>
  );
}
