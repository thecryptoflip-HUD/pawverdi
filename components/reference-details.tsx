'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Keep reference pages concise without removing their useful supporting content. */
export default function ReferenceDetails({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const revealHash = (hash: string) => {
      if (!hash) return;
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target && ref.current?.contains(target)) {
        ref.current.open = true;
        requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
      }
    };
    const revealTarget = () => revealHash(window.location.hash);
    // Next Link uses history.pushState for fragments, which does not emit hashchange.
    const onLinkClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname) revealHash(destination.hash);
    };
    revealTarget();
    window.addEventListener('hashchange', revealTarget);
    window.addEventListener('popstate', revealTarget);
    document.addEventListener('click', onLinkClick, true);
    return () => {
      window.removeEventListener('hashchange', revealTarget);
      window.removeEventListener('popstate', revealTarget);
      document.removeEventListener('click', onLinkClick, true);
    };
  }, []);

  return <div className="pv-support-wrap"><details ref={ref} className="pv-support-details">
    <summary>{title}<span aria-hidden="true">＋</span></summary>
    <div className="pv-support-content">{children}</div>
  </details></div>;
}
