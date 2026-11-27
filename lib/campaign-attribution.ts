import { type NextRequest } from "next/server";
import { publicClient } from "@/lib/supabase";

export function analyticsAllowed(req: NextRequest) {
  return (
    req.cookies.get("pv_analytics")?.value === "allow" &&
    req.headers.get("sec-gpc") !== "1" &&
    req.headers.get("dnt") !== "1"
  );
}

// Compare locally to a list of public, approved names. Unknown tracking values
// never become database filters, cookies or recorded event dimensions.
export async function approvedCampaign(
  candidate: string | null | undefined,
): Promise<string | null> {
  if (
    !candidate ||
    candidate.length > 100 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate)
  )
    return null;
  const db = publicClient();
  if (!db) return null;
  const size = 100;
  for (let offset = 0; ; offset += size) {
    const now = new Date().toISOString();
    const { data, error } = await db
      .from("publication_entries")
      .select("slug,expires_at,verified_at")
      .eq("kind", "campaign")
      .eq("state", "published")
      .lte("verified_at", now)
      .gt("expires_at", now)
      .order("slug")
      .range(offset, offset + size - 1);
    if (error || !data) return null;
    if (
      data.some(
        (row) =>
          row.slug === candidate &&
          row.verified_at &&
          row.verified_at <= now &&
          row.expires_at > now,
      )
    )
      return candidate;
    if (data.length < size) return null;
  }
}
