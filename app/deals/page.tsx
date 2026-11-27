import Link from "next/link";
import { readPublicEntries } from "@/lib/publication";
import { collections, validMerchantUrl } from "@/lib/discovery";
import styles from "@/components/discovery.module.css";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Verified pet deals",
  description:
    "Current merchant offers checked by the PawVerdi editorial team.",
  alternates: { canonical: "/deals" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ pet?: string }>;
}) {
  const { pet } = await searchParams;
  const deals = (await readPublicEntries("deal")).filter(
    (d) =>
      d.verified_at &&
      Date.parse(d.verified_at) <= Date.now() &&
      d.expires_at &&
      Date.parse(d.expires_at) > Date.now() &&
      validMerchantUrl(d.destination_url) &&
      (!pet || d.species === pet || d.species === "all"),
  );
  return (
    <section className={styles.wrap}>
      <Link href="/discover">Pet discovery</Link>
      <h1>Verified deals</h1>
      <p>
        Browse current merchant offers. Each listing includes the date checked
        and when the offer ends.
      </p>
      <form className={styles.filters}>
        <label>
          Pet
          <select name="pet" defaultValue={pet}>
            <option value="">All pets</option>
            {collections.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button className={styles.button}>Filter deals</button>
      </form>
      {deals.length === 0 ? (
        <>
          <h2>No current verified offers</h2>
          <p>
            <Link href="/discover">Browse gear guides</Link> while our team
            checks offers.
          </p>
        </>
      ) : (
        <div className={styles.grid}>
          {deals.map((d) => (
            <article key={d.id} className={styles.card}>
              <span className={styles.meta}>{d.merchant}</span>
              <h2>{d.title}</h2>
              <p>{d.summary}</p>
              <p>{d.disclosure}</p>
              <p>
                Checked {new Date(d.verified_at!).toISOString().slice(0, 10)} ·
                Ends{" "}
                {new Date(d.expires_at!)
                  .toISOString()
                  .replace("T", " ")
                  .slice(0, 16)}{" "}
                UTC
              </p>
              <a href={"/go/deal/" + d.slug} rel="sponsored nofollow">
                View offer at {d.merchant}
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
