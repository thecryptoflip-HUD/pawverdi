import Link from "next/link";
import { getItems, speciesName } from "@/lib/discovery";
import styles from "@/components/discovery.module.css";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Compare pet gear",
  robots: { index: false, follow: true },
  alternates: { canonical: "/compare" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ item?: string | string[] }>;
}) {
  const { item } = await searchParams;
  const all = await getItems();
  const requested = [
    ...new Set(Array.isArray(item) ? item : item ? [item] : []),
  ];
  const valid = requested
    .map((id) => all.find((i) => i.slug === id))
    .filter((i) => i !== undefined);
  const selected = valid.slice(0, 4);
  return (
    <section className={styles.wrap}>
      <Link href="/discover">Pet discovery</Link>
      <h1>Compare pet gear</h1>
      {valid.length > 4 && (
        <p role="status">Showing your first four selections.</p>
      )}
      {selected.length > 0 ? (
        <div
          className={styles.table}
          tabIndex={0}
          role="region"
          aria-label="Gear comparison"
        >
          <table>
            <caption className="sr-only">Side-by-side gear details</caption>
            <thead>
              <tr>
                <th scope="col">Details</th>
                {selected.map((i) => (
                  <th scope="col" key={i.slug}>
                    <Link href={"/products/" + i.slug}>{i.title}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Pet", "Listing", "Category", "What to check", "Retailer", "Brand", "Recently checked price"].map(
                (label, idx) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {selected.map((i) => (
                      <td key={i.slug}>
                        {
                          [
                            speciesName(i.species),
                            i.label,
                            i.category,
                            i.considerations.length
                              ? i.considerations.join(" · ")
                              : i.summary,
                            i.merchant || "Editorial guide",
                            i.brand || "—",
                            i.price ? i.price.formatted + " USD · " + i.price.checked.slice(0,10) : "Check retailer",
                          ][idx]
                        }
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p>
          Select up to four guides or products in discovery to see them side by
          side.
        </p>
      )}
      <div className={styles.actions}>
        <Link className={styles.button} href="/discover">
          Choose gear
        </Link>
      </div>
    </section>
  );
}
