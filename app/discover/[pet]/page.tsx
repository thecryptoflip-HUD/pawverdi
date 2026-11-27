import { notFound } from "next/navigation";
import Discovery, { type Filters } from "@/components/discovery";
import { collections } from "@/lib/discovery";
type Params = Promise<{ pet: string }>;
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Params }) {
  const { pet } = await params;
  const c = collections.find((x) => x.slug === pet);
  return c
    ? {
        title: c.name + " gear and buying guides",
        description: c.intro,
        alternates: { canonical: "/discover/" + pet },
      }
    : {};
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<Filters>;
}) {
  const { pet } = await params;
  const c = collections.find((x) => x.slug === pet);
  if (!c) notFound();
  return <Discovery collection={c} filters={await searchParams} />;
}
