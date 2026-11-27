import PublishedMedia from '@/components/published-media';
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, getItems, speciesName } from "@/lib/discovery";
import styles from "@/components/discovery.module.css";
type Params = Promise<{ slug: string }>;
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const i = (await getItems()).find((x) => x.slug === slug);
  return i
    ? {
        title: i.title,
        description: i.summary,
        alternates: { canonical: "/products/" + slug },
      }
    : {};
}
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const items = await getItems();
  const i = items.find((x) => x.slug === slug);
  if (!i) notFound();
  const collection = collections.find((c) => c.code === i.species);
  const related = items
    .filter((x) => x.slug !== slug && x.species === i.species)
    .slice(0, 3);
  return (
    <article className={styles.wrap}>
      <nav aria-label="Breadcrumb">
        <Link href="/discover">Discovery</Link> /{" "}
        {collection ? (
          <Link href={"/discover/" + collection.slug}>{collection.name}</Link>
        ) : (
          speciesName(i.species)
        )}
      </nav>
      <h1>{i.title}</h1>
      <div className={styles.meta}>
        {i.label} · {i.category}
      </div>
      <p>{i.summary}</p>
      {i.media && <PublishedMedia slug={i.slug} media={i.media} />}
      {i.brand && <p>Brand · {i.brand}</p>}
      {i.price && <p>{i.price.formatted} USD · Checked <time dateTime={i.price.checked}>{new Date(i.price.checked).toISOString().replace('T',' ').slice(0,16)} UTC</time></p>}
      {i.sourceUrl && <p><a href={i.sourceUrl}>Manufacturer specifications</a>{i.sourceChecked && <> · Checked <time dateTime={i.sourceChecked}>{i.sourceChecked}</time></>}</p>}
      {i.careSourceUrl && <p><a href={i.careSourceUrl}>Manufacturer care instructions</a></p>}
      {i.body && <p style={{ whiteSpace: "pre-line" }}>{i.body}</p>}
      {i.considerations.length > 0 && (
        <>
          <h2>What to compare</h2>
          <ul className={styles.facts}>
            {i.considerations.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      )}
      {i.route && (
        <>
          <h2>At the retailer</h2>
          <p>
            Check current price, specifications and availability directly with{" "}
            {i.merchant || "the retailer"}.
          </p>
          {i.disclosure && <p className={styles.disclosure}>{i.disclosure}</p>}
          <a
            href={i.route}
            rel={i.disclosure ? "sponsored nofollow" : "nofollow"}
            className={styles.button}
          >
            Browse {i.merchant || "retailer"}
          </a>
        </>
      )}
      {related.length > 0 && (
        <>
          <h2>Compare with another guide or product</h2>
          <ul className={styles.facts}>
            {related.map((x) => (
              <li key={x.slug}>
                <Link href={"/compare?item=" + slug + "&item=" + x.slug}>
                  {x.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
