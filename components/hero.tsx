'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

/**
 * Cinematic hero.
 *
 * Motion model: CSS keyframes for the copy (so the headline is styled, not
 * hidden, before JS runs) and a pointer listener that only writes two custom
 * properties for the parallax layer. Nothing in the hero depends on React state,
 * which means a failed hydration can never leave the headline invisible.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // depth parallax — decorative only, skipped for reduced motion / touch
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty('--px', x.toFixed(3));
        el.style.setProperty('--py', y.toFixed(3));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // film loads after paint, never on save-data / 2G / reduced motion
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /2g/.test(conn?.effectiveType ?? '')) return;

    v.src = '/brand/at-home.webm';
    v.load();
    const onReady = () => {
      v.classList.remove('opacity-0');
      v.play().catch(() => {});
    };
    v.addEventListener('canplay', onReady, { once: true });
    return () => v.pause();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero relative isolate flex min-h-[100svh] items-center overflow-hidden bg-forest"
      style={{ ['--px' as string]: '0', ['--py' as string]: '0' }}
    >
      <div
        className="absolute inset-[-6%_-3%] -z-30"
        style={{ transform: 'translate3d(calc(var(--px) * 16px), calc(var(--py) * 16px), 0)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/hero.jpg"
          alt=""
          fetchPriority="high"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-[70%_48%] saturate-[.96] contrast-[1.04]"
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster="/brand/hero.jpg"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(96deg, rgba(5,8,7,.95) 0%, rgba(5,8,7,.80) 32%, rgba(5,8,7,.18) 64%, rgba(5,8,7,.50) 100%), linear-gradient(to top, #050807 1%, rgba(5,8,7,.24) 26%, transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -z-10 h-[52vw] w-[52vw] max-h-[720px] max-w-[720px] rounded-full blur-3xl"
        style={{
          right: '2%',
          top: '8%',
          background: 'radial-gradient(circle, rgba(227,165,117,.22), transparent 64%)',
          transform: 'translate3d(calc(var(--px) * 30px), calc(var(--py) * 30px), 0)',
        }}
      />

      <div
        className="relative mx-auto w-full max-w-wrap px-5 pb-32 pt-[152px] sm:px-8"
        style={{ transform: 'translate3d(calc(var(--px) * 7px), calc(var(--py) * 7px), 0)' }}
      >
        <div className="max-w-[760px]">
          <p className="kicker hero-fade mb-7" style={{ ['--d' as string]: '80ms' }}>
            Independent · Vet-review in progress
          </p>

          <h1 className="display text-[clamp(2.7rem,6.2vw,5.8rem)] text-[#fcf8f1]">
            <span className="hero-line">
              <span>What your pet</span>
            </span>
            <span className="hero-line" style={{ ['--d' as string]: '90ms' }}>
              <span>
                <em className="italic text-gold">actually</em> needs.
              </span>
            </span>
            <span className="hero-line" style={{ ['--d' as string]: '180ms' }}>
              <span>And what it costs.</span>
            </span>
          </h1>

          <p className="lede hero-fade mt-8 max-w-[50ch]" style={{ ['--d' as string]: '420ms' }}>
            A knowledge platform for dog and cat owners — costs, health, nutrition, training and gear, plus a marketplace
            where every seller is verified before a single listing goes live.
          </p>

          <div className="hero-fade mt-10 flex flex-wrap gap-3.5" style={{ ['--d' as string]: '520ms' }}>
            <Link href="/knowledge" className="btn btn-solid">
              Explore the knowledge center <span aria-hidden="true">→</span>
            </Link>
            <Link href="/marketplace" className="btn btn-ghost">
              How we verify sellers
            </Link>
          </div>

          <p className="hero-fade mt-9 max-w-[44ch] text-[0.875rem] leading-relaxed text-cream/70" style={{ ['--d' as string]: '620ms' }}>
            Reader-supported. Every paid link is marked, every sponsored slot is labelled, and no brand has ever paid for a
            ranking.{' '}
            <Link href="/trust" className="text-cream/85 underline underline-offset-2">
              How that works
            </Link>
            .
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-cream/60 sm:flex"
      >
        <span className="h-14 w-px bg-gradient-to-b from-amber to-transparent" />
        Scroll
      </div>
    </section>
  );
}
