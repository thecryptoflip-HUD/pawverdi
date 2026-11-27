import PublishedMedia from '@/components/published-media';
import { notFound } from "next/navigation";
import Link from "next/link";
import { readPublicEntries } from "@/lib/publication";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
async function load({ params }: Props) {
  const { slug } = await params;
  const [item] = await readPublicEntries(undefined, slug);
  if (!item) notFound();
  return item;
}
export async function generateMetadata(props: Props) {
  const item = await load(props);
  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      url: "/discover/published/" + item.slug,
    },
    alternates: { canonical: (item.kind === "product" ? "/products/" : "/discover/published/") + item.slug },
  };
}
export default async function Detail(props: Props) {
  const item = await load(props);
  const commercial = ["deal", "product", "campaign"].includes(item.kind);
  return (
    <article className="mx-auto max-w-3xl space-y-5 px-6 pb-20 pt-32">
      <Link href="/discover/published">Publishing desk</Link>
      <p>
        {item.kind} · PawVerdi editorial desk ·{" "}
        <time dateTime={item.updated_at}>{item.updated_at.slice(0, 10)}</time>
      </p>
      <h1 className="font-serif text-4xl">{item.title}</h1>
      <p>{item.summary}</p>
      {item.media_path && <PublishedMedia slug={item.slug} media={{ path: item.media_path, description: item.media_description, credit: item.media_credit }} />}
      <div className="whitespace-pre-wrap">{item.body}</div>
      {item.disclosure && <p>{item.disclosure}</p>}
      {item.expires_at && (
        <p>
          Expires{" "}
          <time dateTime={item.expires_at}>
            {new Date(item.expires_at).toUTCString()}
          </time>
        </p>
      )}
      {item.destination_url && (
        <a
          href={
            commercial
              ? "/go/" + item.kind + "/" + item.slug
              : item.destination_url
          }
          rel={commercial ? "sponsored noopener" : "noopener"}
        >
          Visit {item.merchant || "source"}
        </a>
      )}
    </article>
  );
}
