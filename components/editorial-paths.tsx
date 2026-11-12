import Link from 'next/link';

export type EditorialPath = {
  label: string; title: string; text: string; href: string; image: string;
};
export default function EditorialPaths({ kicker, heading, intro, items }: {
  kicker: string; heading: string; intro: string; items: EditorialPath[];
}) {
  return (
    <section className="pv-editorial-paths" aria-label={heading}>
      <div className="mx-auto max-w-wrap px-5 py-16 sm:px-8 lg:py-24">
        <div className="pv-section-heading mb-9">
          <div>
            <span className="pv-eyebrow">{kicker}</span>
            <h2 className="pv-display mt-3">{heading}</h2>
          </div>
          <p>{intro}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <Link href={item.href} key={item.title} className={`pv-editorial-tile pv-tile-${index % 3} group`}>
              <div className="pv-tile-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" width={600} height={360} loading="lazy" />
              </div>
              <div className="pv-tile-body">
                <span className="pv-tile-label">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="pv-tile-button">Explore <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
