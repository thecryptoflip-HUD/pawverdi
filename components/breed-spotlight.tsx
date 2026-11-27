const akc2026 = 'https://www.akc.org/expert-advice/dog-breeds/newly-recognized-breeds-2026/';

const profiles = {
  dog: [
    {
      name: 'Basset Fauve de Bretagne',
      status: 'AKC Hound Group · January 2026',
      description: 'A short-legged French scent hound with a rough, fawn-colored coat. Its history as a hunting dog makes scent games and secure places to explore good topics to discuss with a rescue or breeder.',
      source: akc2026,
      sourceName: 'AKC breed announcement',
    },
    {
      name: 'Russian Tsvetnaya Bolonka',
      status: 'AKC Toy Group · January 2026',
      description: 'A small Russian companion dog with a long, wavy or curly coat. Ask what regular brushing and professional grooming look like for the coat you’ll be caring for.',
      source: akc2026,
      sourceName: 'AKC breed announcement',
    },
    {
      name: 'Teddy Roosevelt Terrier',
      status: 'AKC Terrier Group · January 2026',
      description: 'A compact American terrier with roots as a farm ratter. Ask how the individual dog behaves around small animals and what kind of play and training keeps them engaged.',
      source: akc2026,
      sourceName: 'AKC breed announcement',
    },
    {
      name: 'Cockapoo',
      status: 'Domestic crossbreed · Cocker Spaniel × Poodle',
      description: 'This name describes the parent breeds. Size and coat can vary between dogs. Meet the individual dog and ask about grooming and the health history of both parents.',
      source: 'https://www.akc.org/wp-content/uploads/2021/08/AKC_InSession_Aug_2021.pdf',
      sourceName: 'AKC crossbreed reference (PDF)',
    },
  ],
  cat: [
    {
      name: 'Toybob',
      status: 'CFA Championship · 2025',
      description: 'A small domestic cat with a naturally short tail. The CFA accepted Toybobs for registration in 2019 and advanced them to Championship in 2025.',
      source: 'https://cfa.org/breed/toybob/',
      sourceName: 'CFA Toybob profile',
    },
    {
      name: 'Tennessee Rex',
      status: 'TICA Championship · May 2024',
      description: 'A domestic cat with a curly coat and a distinctive sheen. TICA’s standard includes both shorthaired and longhaired cats.',
      source: 'https://tica.org/breed/tennessee-rex/',
      sourceName: 'TICA Tennessee Rex profile',
    },
    {
      name: 'Savannah',
      status: 'TICA Championship breed · Hybrid ancestry',
      description: 'The first documented Savannah came from a domestic cat and an African serval. If you’re considering adopting one, ask about its generation and care needs, and check local rules before making plans.',
      source: 'https://tica.org/breed/savannah/',
      sourceName: 'TICA Savannah profile',
    },
  ],
};

export default function BreedSpotlight({ species }: { species: keyof typeof profiles }) {
  return (
    <section id="breed-spotlight" aria-labelledby="breed-spotlight-title" className="scroll-mt-28 border-y border-white/10 bg-forest py-12">
      <div className="mx-auto max-w-wrap px-5 sm:px-8">
        <h2 id="breed-spotlight-title" className="display text-[clamp(1.7rem,3vw,2.4rem)] text-cream">
          Recently recognized {species} breeds and crosses
        </h2>
        <p className="mt-3 max-w-[65ch] text-cream/75">
          The dates show when each named registry changed a breed’s status. Crosses and breeds with hybrid ancestry include examples you may come across.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {profiles[species].map((profile) => (
            <article key={profile.name} className="rounded-2xl border border-white/10 bg-moss/50 p-5">
              <p className="text-sm font-semibold text-gold">{profile.status}</p>
              <h3 className="mt-2 font-serif text-2xl text-cream">{profile.name}</h3>
              <p className="mt-2 leading-relaxed text-cream/80">{profile.description}</p>
              <a className="mt-4 inline-block text-sm text-gold underline underline-offset-4" href={profile.source}>
                {profile.sourceName}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
