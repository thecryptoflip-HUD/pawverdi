'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Progressive reveal. The element is rendered visible in HTML and only hidden
 * once JS confirms IntersectionObserver support — so no content is ever lost when
 * scripts fail, are blocked, or the visitor prefers reduced motion.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window) || !ref.current) return;
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSeen(true);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const Tagged = Tag as ElementType;
  return (
    <Tagged
      ref={ref as never}
      className={`${className} ${armed ? 'reveal' : ''} ${seen ? 'in' : ''}`}
      style={seen && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tagged>
  );
}
