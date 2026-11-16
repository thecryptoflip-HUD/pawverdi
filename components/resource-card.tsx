import Link from 'next/link';

/** A real navigation resource, clearly distinguished from a published article. */
export default function ResourceCard({ title, body, href, image, label = 'Helpful resource' }: {
  title:string; body:string; href:string; image:string; label?:string;
}) {
  return <Link href={href} className="pv-seven-resource pv-resource-card">
    <div className="pv-seven-resource-image"><img src={image} alt="" width={720} height={480} loading="lazy"/></div>
    <div className="pv-seven-resource-copy"><span>{label}</span><h3>{title}</h3><p>{body}</p><b>Explore this resource →</b></div>
  </Link>;
}
