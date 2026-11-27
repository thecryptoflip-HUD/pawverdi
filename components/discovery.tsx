import Link from "next/link";
import {
  collections,
  getItems,
  speciesName,
  type Collection,
} from "@/lib/discovery";
import styles from "./discovery.module.css";

export type Filters = { q?: string; category?: string; sort?: string };
export default async function Discovery({
  collection,
  filters,
}: {
  collection?: Collection;
  filters: Filters;
}) {
  const all = (await getItems()).filter(
    (i) => !collection || [collection.code, "all", "both"].includes(i.species),
  );
  const categories = [...new Set(all.map((i) => i.category))].sort();
  const q = typeof filters.q === "string" ? filters.q.trim().slice(0, 100) : "";
  const category = categories.includes(filters.category || "")
    ? filters.category
    : "";
  const found = all.filter(
    (i) =>
      (!category || i.category === category) &&
      [i.title, i.summary, i.category, i.merchant, speciesName(i.species)]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  if (filters.sort === "az" || filters.sort === "za")
    found.sort(
      (a, b) =>
        a.title.localeCompare(b.title) * (filters.sort === "za" ? -1 : 1),
    );
  const path = collection ? "/discover/" + collection.slug : "/discover";
  return (
    <section className={styles.wrap}>
      <nav aria-label="Breadcrumb">
        <Link href="/">Home</Link> /{" "}
        {collection ? (
          <>
            <Link href="/discover">Discovery</Link> / {collection.name}
          </>
        ) : (
          "Discovery"
        )}
      </nav>
      <h1>{collection ? collection.name : "Pet discovery"}</h1>
      <p>
        {collection?.intro ||
          "Find gear for your pet. Compare category guides and explore published product listings."}
      </p>
      <nav className={styles.nav} aria-label="Pet collections">
        <Link href="/discover" aria-current={!collection ? "page" : undefined}>
          All pets
        </Link>
        {collections.map((c) => (
          <Link
            key={c.slug}
            href={"/discover/" + c.slug}
            aria-current={c === collection ? "page" : undefined}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      <form action={path} className={styles.filters}>
        <label>
          Search
          <input type="search" name="q" maxLength={100} defaultValue={q} />
        </label>
        <label>
          Category
          <select name="category" defaultValue={category}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select name="sort" defaultValue={filters.sort}>
            <option value="">Featured order</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>
        </label>
        <button className={styles.button}>Apply filters</button>
        {(q || category || filters.sort) && (
          <Link href={path}>Clear filters</Link>
        )}
      </form>
      <p role="status">
        {found.length} {found.length === 1 ? "result" : "results"}
      </p>
      {found.length > 0 ? (
        <form action="/compare">
          <div className={styles.grid}>
            {found.map((i) => (
              <article key={i.slug} className={styles.card}>
                <span className={styles.meta}>
                  {speciesName(i.species)} · {i.label}
                </span>
                <h3>
                  <Link href={"/products/" + i.slug}>{i.title}</Link>
                </h3>
                <p>{i.summary}</p>
                <label>
                  <input name="item" value={i.slug} type="checkbox" /> Compare{" "}
                  {i.title.toLowerCase()}
                </label>
              </article>
            ))}
          </div>
          <div className={styles.actions}>
            <button className={styles.button}>Compare selected</button>
            <Link href="/deals">Verified deals</Link>
          </div>
        </form>
      ) : (
        <p>Try a broader search or choose a different category.</p>
      )}
    </section>
  );
}
