import Link from "next/link";
import { readPublicEntries } from "@/lib/publication";
export const dynamic = "force-dynamic";
type Props = { searchParams: Promise<{ page?: string }> };
const perPage = 24;
function pageFrom(value?: string) {
  return Math.min(100000, Math.max(1, Math.floor(Number(value) || 1)));
}
function href(page: number) {
  return "/discover/published" + (page === 1 ? "" : "?page=" + page);
}
export async function generateMetadata({ searchParams }: Props) {
  const page = pageFrom((await searchParams).page);
  const title =
    "From the publishing desk" + (page > 1 ? " · Page " + page : "");
  const description =
    "Browse the latest guides, product notes and commercial disclosures published by PawVerdi.";
  return {
    title,
    description,
    alternates: { canonical: href(page) },
    openGraph: { title, description, url: href(page) },
  };
}
export default async function Publications({ searchParams }: Props) {
  const page = pageFrom((await searchParams).page);
  const rows = await readPublicEntries(undefined, undefined, false, {
    offset: (page - 1) * perPage,
    limit: perPage + 1,
  });
  const entries = rows.slice(0, perPage);
  return (
    <section className="mx-auto max-w-wrap px-6 pb-20 pt-32">
      <h1 className="font-serif text-4xl">From the publishing desk</h1>
      {entries.length ? (
        <ul className="my-8 grid gap-5 sm:grid-cols-2">
          {entries.map((e) => (
            <li className="rounded border p-5" key={e.id}>
              <p>{e.kind}</p>
              <h2 className="text-2xl">
                <Link href={"/discover/published/" + e.slug}>{e.title}</Link>
              </h2>
              <p>{e.summary}</p>
              {e.disclosure && <p>{e.disclosure}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="my-8">
          There are no current publications in this collection.{" "}
          <Link href="/knowledge">Browse our existing guides.</Link>
        </p>
      )}
      <nav aria-label="Collection pages" className="mt-6 flex gap-4">
        {page > 1 && <Link href={href(page - 1)}>Previous page</Link>}
        {rows.length > perPage && <Link href={href(page + 1)}>Next page</Link>}
      </nav>
    </section>
  );
}
