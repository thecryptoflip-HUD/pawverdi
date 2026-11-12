'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, site } from '@/lib/site';

export default function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[#cae9da] bg-[#fffdf7]/95 backdrop-blur-xl transition-colors duration-500 ${
        stuck || open ? 'shadow-[0_8px_30px_-18px_rgba(6,66,44,.28)]' : ''
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-wrap items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
          <PawMark />
          <span className="font-serif text-[1.55rem] font-bold tracking-tight text-[#07543d]">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={`rounded-full px-3.5 py-2 text-[0.78rem] font-bold tracking-normal transition-colors ${
                pathname === item.href ? 'bg-[#c6f3df] text-[#07543d]' : 'text-[#24553f] hover:bg-[#e6f7ed] hover:text-[#07543d]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#badccb] lg:hidden"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" className="fill-[#07543d]">
            {open ? (
              <path d="M1.4 0.6 8 7.2 14.6.6 16 2 8 10 0 2z" />
            ) : (
              <>
                <rect y="0" width="16" height="1.6" rx=".8" />
                <rect y="5.2" width="16" height="1.6" rx=".8" />
                <rect y="10.4" width="16" height="1.6" rx=".8" />
              </>
            )}
          </svg>
        </button>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/knowledge" aria-label="Search pet guides" className="pv-header-icon" title="Search pet guides">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
          </Link>
          <Link href="/shop" aria-label="Explore pet gear" className="pv-header-icon" title="Explore pet gear">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19" aria-hidden="true"><path d="M3 4h2l2.2 11H19l2-8H6" /><circle cx="9" cy="20" r="1.1" /><circle cx="18" cy="20" r="1.1" /></svg>
          </Link>
          <Link href="/community" className="pv-header-join">Join PawVerdi</Link>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-[#badccb] bg-[#fffdf7] px-5 pb-6 pt-2 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className="block border-b border-[#e2eee5] py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-[#07543d]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function PawMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#ff704d]">
      <ellipse cx="6" cy="9" rx="2.4" ry="3" />
      <ellipse cx="18" cy="9" rx="2.4" ry="3" />
      <ellipse cx="10" cy="4.6" rx="2.2" ry="2.8" />
      <ellipse cx="14.6" cy="4.6" rx="2.2" ry="2.8" />
      <path d="M12 10.4c3.1 0 5.6 2.3 5.6 4.9 0 2-1.6 3.3-3.6 3.3-1 0-1.6-.5-2-.5s-1 .5-2 .5c-2 0-3.6-1.3-3.6-3.3 0-2.6 2.5-4.9 5.6-4.9z" />
    </svg>
  );
}
