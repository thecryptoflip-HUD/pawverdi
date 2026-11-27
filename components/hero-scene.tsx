'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Motion is decorative. Links, artwork and copy are also server rendered. */
export default function HeroScene({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const device = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (device.connection?.saveData || (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 2)) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    function paint() {
      frame = 0;
      element!.style.setProperty('--scene-x', x.toFixed(3));
      element!.style.setProperty('--scene-y', y.toFixed(3));
    }
    function move(event: PointerEvent) {
      if (reduced.matches || !event.isPrimary) return;
      const rect = element!.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, 2 * (event.clientX - rect.left) / rect.width - 1));
      y = Math.max(-1, Math.min(1, 2 * (event.clientY - rect.top) / rect.height - 1));
      if (!frame) frame = requestAnimationFrame(paint);
    }
    function reset() {
      cancelAnimationFrame(frame);
      x = y = 0;
      paint();
    }
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    element.addEventListener('pointerup', reset);
    reduced.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      element.removeEventListener('pointercancel', reset);
      element.removeEventListener('pointerup', reset);
      reduced.removeEventListener('change', reset);
    };
  }, []);

  return <section ref={section} className="pv-reference-homehero pv-hero-scene" aria-labelledby="pv-home-heading">{children}</section>;
}
