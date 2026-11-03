import Link from 'next/link';
import { footerGroups, site } from '@/lib/site';
import { isLive } from '@/lib/supabase';

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-void pb-11 pt-16">
      <div className="mx-auto max-w-wrap px-5 sm:px-8">
        <div className="mb-11 flex flex-wrap justify-between gap-11">
          <div className="max-w-[370px]">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-amber">
                <ellipse cx="6" cy="9" rx="2.4" ry="3" />
                <ellipse cx="18" cy="9" rx="2.4" ry="3" />
                <ellipse cx="10" cy="4.6" rx="2.2" ry="2.8" />
                <ellipse cx="14.6" cy="4.6" rx="2.2" ry="2.8" />
                <path d="M12 10.4c3.1 0 5.6 2.3 5.6 4.9 0 2-1.6 3.3-3.6 3.3-1 0-1.6-.5-2-.5s-1 .5-2 .5c-2 0-3.6-1.3-3.6-3.3 0-2.6 2.5-4.9 5.6-4.9z" />
              </svg>
              <span className="font-serif text-lg font-bold text-cream">{site.name}</span>
            </Link>
            <p className="text-[0.88rem] leading-relaxed text-cream/60">
              Independent research on pet costs, health and gear. Written for people who would rather buy the right thing
              once — and who will not buy an animal from a stranger without paperwork.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2.5">
              <span className="mb-1 text-[0.64rem] uppercase tracking-[0.24em] text-cream/55">{group.title}</span>
              {group.links.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="text-[0.88rem] text-cream/80 hover:text-cream">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-6 border-t border-white/[0.07] pt-6 text-[0.78rem] leading-relaxed text-cream/60">
          <p className="max-w-[72ch]">
            {site.name} is reader-supported: we earn a commission when you buy through a marked link, at no extra cost to
            you. No brand has paid for a mention, a ranking, or a position in a comparison table. Educational content is
            not veterinary advice — for diagnosis or treatment, see a licensed veterinarian.{' '}
            <Link href="/trust" className="text-cream/80 underline">
              Full editorial and disclosure policy
            </Link>
            .
          </p>
          <p>
            © {new Date().getFullYear()} {site.name} · <span className="text-cream/45">content mode: {isLive() ? 'live' : 'demo'}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
