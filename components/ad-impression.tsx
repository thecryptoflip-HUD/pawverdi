"use client";
import { useEffect, useRef } from "react";
export default function AdImpression({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.intersectionRatio >= 0.5)) return;
        observer.disconnect();
        if (
          document.cookie
            .split(";")
            .map((x) => x.trim())
            .includes("pv_analytics=allow")
        )
          void fetch("/api/impressions/" + encodeURIComponent(slug), {
            method: "POST",
            keepalive: true,
          }).catch(() => {});
      },
      { threshold: 0.5 },
    );
    observer.observe(element.current);
    return () => observer.disconnect();
  }, [slug]);
  return <div ref={element}>{children}</div>;
}
