'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const motion = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = motion.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || /2g/.test(connection?.effectiveType ?? '')) return;
    const onReady = () => { video.classList.add('pv-video-ready'); video.play().catch(() => {}); };
    const onError = () => video.remove();
    video.addEventListener('canplay', onReady, { once: true });
    video.addEventListener('error', onError, { once: true });
    video.load();
    return () => { video.pause(); video.removeEventListener('canplay', onReady); video.removeEventListener('error', onError); };
  }, []);

  return (
    <section className="pv-home-hero hero" aria-labelledby="pv-home-title">
      <div className="pv-home-hero-inner mx-auto max-w-wrap px-5 sm:px-8">
        <div className="pv-home-hero-copy">
          <span className="pv-eyebrow"><span aria-hidden="true">✦</span> Welcome to PawVerdi</span>
          <h1 id="pv-home-title" className="pv-display">
            More joy, color and <em>confidence</em> for you and your pet.
          </h1>
          <p className="pv-hero-description">
            Explore practical dog and cat care guides, everyday ideas and pet gear you can compare with confidence.
            Our content labels its review status and every commercial link is clearly disclosed.
          </p>
          <div className="pv-hero-actions">
            <Link href="/knowledge" className="pv-action pv-action-coral">Explore guides <span aria-hidden="true">→</span></Link>
            <Link href="/shop" className="pv-action pv-action-light">Browse pet gear <span aria-hidden="true">→</span></Link>
          </div>
          <div className="pv-trust-pills" aria-label="Our standards">
            <span>♡ Pet-first guidance</span><span>✓ Clear disclosures</span><span>✦ Practical checklists</span>
          </div>
        </div>
        <div className="pv-home-hero-art">
          <div className="pv-picture-frame">
            {/* Real site artwork; video is decorative and always has a still fallback. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/home-hero.jpg" alt="Dog and cat together in warm light" width={1920} height={834} fetchPriority="high" className="pv-picture-fill" />
            <video ref={motion} className="pv-picture-fill pv-picture-motion" aria-hidden="true" tabIndex={-1} muted loop playsInline preload="none" poster="/brand/home-hero.jpg">
              <source src="/brand/hero-loop.webm" type="video/webm" />
              <source src="/brand/hero-loop.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="pv-floating-note" aria-hidden="true">A happier world for pets <span>♥</span></div>
        </div>
      </div>
    </section>
  );
}
