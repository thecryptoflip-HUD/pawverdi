'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Keep reference pages concise without removing their useful supporting content. */
export default function ReferenceDetails({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const revealTarget = () => {
      if (!window.location.hash) return;
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target && ref.current?.contains(target)) {
        ref.current.open = true;
        requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
      }
    };
    revealTarget();
    window.addEventListener('hashchange', revealTarget);
    return () => window.removeEventListener('hashchange', revealTarget);
  }, []);

  return <div className="pv-support-wrap"><details ref={ref} className="pv-support-details">
    <summary>{title}<span aria-hidden="true">＋</span></summary>
    <div className="pv-support-content">{children}</div>
  </details></div>;
}
