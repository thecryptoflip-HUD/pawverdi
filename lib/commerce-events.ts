import "server-only";
import { analyticsAllowed, approvedCampaign } from "@/lib/campaign-attribution";
export { analyticsAllowed } from "@/lib/campaign-attribution";
import { type NextRequest } from "next/server";
import { adminClient } from "@/lib/supabase-admin";
export function siteOrigin(req: NextRequest) {
  // Next dev canonicalizes loopback addresses. Keep browser-visible host and port.
  return (
    req.nextUrl.protocol + "//" + (req.headers.get("host") || req.nextUrl.host)
  );
}
export async function recordEvent(
  req: NextRequest,
  kind: string,
  slug: string,
  merchant: string,
  event: "click" | "impression",
) {
  if (!analyticsAllowed(req)) return;
  const db = adminClient();
  if (!db) return;
  // Attribution uses only our own named campaign or collection, never visitor identifiers.
  let attribution = "direct";
  try {
    const referring = new URL(req.headers.get("referer") || "");
    if (referring.origin === siteOrigin(req)) {
      const section = referring.pathname.split("/")[1];
      attribution = [
        "shop",
        "discover",
        "products",
        "compare",
        "deals",
        "knowledge",
        "dogs",
        "cats",
        "marketplace",
      ].includes(section)
        ? section
        : "site";
    }
  } catch {
    /* referrers are optional */
  }
  try {
    const campaign = await approvedCampaign(
      req.cookies.get("pv_campaign")?.value,
    );
    const { error } = await db
      .from("tracking_events")
      .insert({ kind, slug, merchant, event, attribution, campaign });
    if (error) console.warn("Commerce event storage unavailable.");
  } catch {
    console.warn("Commerce event storage unavailable.");
  }
}
