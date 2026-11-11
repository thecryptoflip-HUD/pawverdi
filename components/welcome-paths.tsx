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
    <section aria-label={heading} className="border-y border-white/[0.08] bg-gradient-to-b from-forest via-[#182a24] to-forest py-[clamp(54px,8vw,104px)]">
      <div className="mx-auto max-w-wrap px-5 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[740px]">
            <p className="kicker mb-4">{kicker}</p>
            <h2 className="display text-[clamp(2rem,4vw,3.25rem)] leading-tight text-cream">{heading}</h2>
          </div>
          <p className="max-w-[38ch] text-[0.98rem] leading-relaxed text-cream/80">{intro}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href + item.title}
              href={item.href}
              className="group relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[24px] border border-white/15 bg-moss p-7 shadow-[0_30px_60px_-35px_rgba(0,0,0,.9)] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
            >
              {/* Decorative art is already licensed/generated for PawVerdi. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" loading="lazy" width={640} height={520} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-80 transition-transform duration-700 motion-safe:group-hover:scale-[1.035]" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050807] via-[#050807]/80 to-[#050807]/10" />
              <span className="mb-4 inline-flex self-start rounded-full border border-white/25 bg-[#050807]/60 px-3 py-1.5 text-[0.67rem] font-bold uppercase tracking-[0.15em] text-gold">{item.eyebrow}</span>
              <h3 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] leading-tight text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/85">{item.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-gold">{item.action} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
