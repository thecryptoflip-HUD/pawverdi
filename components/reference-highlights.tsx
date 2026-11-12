import Link from 'next/link';
type Highlight = { eyebrow:string; title:string; body:string; href:string; image:string; action?:string };
export default function ReferenceHighlights({ eyebrow, heading, subtitle, items }: {
 eyebrow:string; heading:string; subtitle:string; items:Highlight[];
}) {
 return <section className="pv-reference-highlights" aria-label={heading}>
    <div className="mx-auto max-w-wrap px-5 py-14 sm:px-8 lg:py-20">
      <div className="pv-reference-section-heading"><div><p>{eyebrow}</p><h2>{heading}</h2></div><span>{subtitle}</span></div>
      <div className="pv-reference-highlight-grid">
      {items.map((item,i)=><Link href={item.href} key={item.href+item.title} className={`pv-reference-highlight-card pv-ref-hi-${i%3}`}>
        <div className="pv-reference-highlight-picture">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} width={600} height={380} loading="lazy" alt="" />
        </div>
        <div className="pv-reference-highlight-content"><span className="pv-reference-smalltag">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.body}</p><span className="pv-reference-highlight-link">{item.action || 'Explore'} <span aria-hidden="true">→</span></span></div>
      </Link>)}
      </div>
    </div>
  </section>;
}
