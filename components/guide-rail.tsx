'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export interface RailItem {
  slug: string;
  title: string;
  section: string;
  species: string;
  image: string;
}

/**
 * 3D cover-flow rail. Pointer drag, arrow keys, dots and buttons all drive the
 * same index; every card stays a real link, so keyboard and no-JS users get a
 * plain list of articles underneath the deck.
 */
export default function GuideRail({ items }: { items: RailItem[] }) {
  const n = items.length;
  const [current, setCurrent] = useState(0);
  const [radius, setRadius] = useState(420);
  const [drag, setDrag] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const moved = useRef(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const step = 360 / Math.max(n, 1);

  useEffect(() => {
    const measure = () => {
      const el = stageRef.current;
      if (!el) return;
      const w = el.querySelector<HTMLElement>('[data-card]')?.getBoundingClientRect().width ?? 300;
      setRadius(Math.max(300, w * 1.32));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [n]);

  const go = (i: number) => setCurrent(((i % n) + n) % n);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        go(current + 1);
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        go(current - 1);
        e.preventDefault();
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [current, n]);

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const steps = Math.round(drag / step);
    setDrag(0);
    if (steps) go(current - steps);
  };

  return (
    <div>
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Featured guides"
        className={`relative h-[420px] cursor-grab touch-pan-y outline-offset-8 sm:h-[470px] ${dragging.current ? 'cursor-grabbing' : ''}`}
        style={{ perspective: '1900px', perspectiveOrigin: '50% 46%' }}
        onPointerDown={(e) => {
          dragging.current = true;
          moved.current = false;
          startX.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const dx = e.clientX - startX.current;
          if (Math.abs(dx) > 8) moved.current = true;
          setDrag(dx * 0.22);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            moved.current = false;
          }
        }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-cine"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(${-radius}px) rotateY(${-current * step + drag}deg)`,
            transitionDuration: dragging.current ? '0ms' : undefined,
          }}
        >
          {items.map((item, i) => {
            const dist = Math.min(Math.abs(i - current), n - Math.abs(i - current));
            const active = dist === 0;
            return (
              <div
                key={item.slug}
                data-card
                aria-hidden={!active}
                className="absolute left-1/2 top-0 h-full w-[min(78vw,320px)] -translate-x-1/2 transition-[opacity,filter] duration-700 sm:w-[clamp(250px,27vw,330px)]"
                style={{
                  transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                  opacity: active ? 1 : dist === 1 ? 0.55 : 0.28,
                  filter: active ? 'none' : `blur(${dist === 1 ? 1.4 : 2.6}px)`,
                }}
              >
                <Link
                  href={`/knowledge/${item.slug}`}
                  tabIndex={active ? 0 : -1}
                  className="flex h-full flex-col overflow-hidden rounded-[18px] border border-white/[0.07] bg-moss shadow-[0_24px_60px_-34px_rgba(0,0,0,.9)] transition-all duration-500 hover:border-amber/40"
                  style={{ transform: active ? 'scale(1.03)' : undefined }}
                >
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover saturate-[.85] brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-moss via-moss/10 to-transparent" />
                  </div>
                  <div className="px-5 pb-6 pt-4">
                    <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-amber">
                      {item.section} · {item.species}
                    </p>
                    <h3 className="font-serif text-[1.16rem] leading-tight text-[#fcf8f1]">{item.title}</h3>
                    <p className="mt-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-cream/80">Read →</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-5">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose a guide">
          {items.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-label={`Guide ${i + 1}: ${item.title}`}
              aria-current={i === current}
              onClick={() => go(i)}
              className={`h-[7px] w-[7px] rounded-full transition-transform ${i === current ? 'scale-150 bg-amber' : 'bg-cream/25 hover:bg-cream/50'}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden text-[0.72rem] uppercase tracking-[0.14em] text-cream/55 sm:block">Drag · arrows · ← →</p>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => go(current - 1)} aria-label="Previous guide" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream transition-colors hover:border-amber hover:bg-amber/10">
              ←
            </button>
            <button type="button" onClick={() => go(current + 1)} aria-label="Next guide" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream transition-colors hover:border-amber hover:bg-amber/10">
              →
            </button>
          </div>
        </div>
      </div>

      {/* no-JS / screen-reader path: a plain, complete list */}
      <noscript>
        <ul className="mt-6 space-y-2">
          {items.map((item) => (
            <li key={item.slug}>
              <Link href={`/knowledge/${item.slug}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
