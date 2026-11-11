import Link from 'next/link';

export type WelcomePath = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image: string;
  action: string;
};

export default function WelcomePaths({ kicker, heading, intro, items }: {
  kicker: string;
  heading: string;
  intro: string;
  items: WelcomePath[];
}) {
  return (
    <section aria-label={heading} className="welcome-paths border-y border-[#dbede6] py-[clamp(54px,8vw,104px)]">
      <div className="mx-auto max-w-wrap px-5 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[740px]">
            <p className="kicker mb-4">{kicker}</p>
            <h2 className="display text-[clamp(2rem,4vw,3.25rem)] leading-tight text-cream">{heading}</h2>
          </div>
          <p className="max-w-[38ch] text-[0.98rem] leading-relaxed text-cream/80">{intro}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <Link
              key={item.href + item.title}
              href={item.href}
              className={`vibrant-discovery-card group isolate flex h-full flex-col overflow-hidden rounded-[26px] border border-[#d6e7de] shadow-[0_20px_45px_-25px_rgba(9,72,52,.32)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075b43] vibrant-card-${index % 3}`}
            >
              <div className="relative h-[190px] overflow-hidden sm:h-[215px]">
                {/* Existing PawVerdi-controlled brand artwork, not generated mockup screenshots. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" loading="lazy" width={640} height={380} className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]" />
                <span className="absolute bottom-3 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#07513b] shadow-sm">{item.eyebrow}</span>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] leading-tight text-[#093e2c]">{item.title}</h3>
                <p className="mt-3 flex-1 text-[0.96rem] leading-relaxed text-[#174c3b]">{item.description}</p>
                <span className="mt-6 inline-flex self-start items-center gap-2 rounded-full bg-[#07553d] px-5 py-3 text-[0.76rem] font-bold text-white transition-colors group-hover:bg-[#007f64]">{item.action} <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
