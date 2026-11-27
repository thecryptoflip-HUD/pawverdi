import "server-only";
import { publicClient } from "@/lib/supabase";

export const entryKinds = [
  "article",
  "deal",
  "product",
  "campaign",
  "category",
  "merchant",
  "media",
  "homepage",
] as const;
export const speciesValues = [
  "all",
  "dog",
  "cat",
  "bird",
  "small-animal",
  "fish",
  "reptile",
] as const;
export type Kind = (typeof entryKinds)[number];
export type Entry = {
  id: string;
  kind: Kind;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  species: string;
  merchant: string;
  brand: string;
  price_cents: number | null;
  price_checked_at: string | null;
  destination_url: string | null;
  disclosure: string;
  featured: boolean;
  expires_at: string | null;
  updated_at: string;
  verified_at: string | null;
  state: "draft" | "review" | "published" | "archived";
  media_path: string | null;
  media_credit: string;
  media_description: string;
  revision: number;
};
type Window = { offset: number; limit: number };
export async function readPublicEntries(
  kind?: Kind,
  slug?: string,
  featuredOnly = false,
  window?: Window,
): Promise<Entry[]> {
  const db = publicClient();
  if (!db) return [];
  let query = db
    .from("publication_entries")
    .select("*")
    .eq("state", "published")
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
  if (featuredOnly) query = query.eq("featured", true);
  if (kind) query = query.eq("kind", kind);
  if (slug) query = query.eq("slug", slug);
  const order = query
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false })
    .order("id");
  const size = window?.limit ?? (slug ? 1 : featuredOnly ? 6 : 100);
  let start = window?.offset ?? 0;
  const rows: Entry[] = [];
  while (true) {
    const { data, error } = await order.range(start, start + size - 1);
    if (error)
      throw new Error("The publication catalogue is temporarily unavailable.");
    rows.push(...(data ?? []));
    if (window || slug || featuredOnly || !data || data.length < size)
      return rows;
    start += size;
  }
}
