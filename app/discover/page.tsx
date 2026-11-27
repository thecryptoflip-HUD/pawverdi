import Discovery, { type Filters } from "@/components/discovery";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pet discovery",
  description:
    "Browse six pet collections and compare gear by practical needs.",
  alternates: { canonical: "/discover" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  return <Discovery filters={await searchParams} />;
}
