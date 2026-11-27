import { NextRequest, NextResponse } from "next/server";
import { analyticsAllowed, recordEvent, siteOrigin } from "@/lib/commerce-events";
import { readPublicEntries } from "@/lib/publication";
export const dynamic = "force-dynamic";
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (req.headers.get("origin") !== siteOrigin(req))
    return new NextResponse(null, { status: 403 });
  if (!analyticsAllowed(req)) return new NextResponse(null, { status: 204 });
  const { slug } = await params;
  const [campaign] = await readPublicEntries("campaign", slug);
  if (
    !campaign ||
    !campaign.verified_at ||
    !campaign.expires_at ||
    Date.parse(campaign.expires_at) <= Date.now()
  )
    return new NextResponse(null, { status: 404 });
  await recordEvent(req, "campaign", slug, campaign.merchant, "impression");
  return new NextResponse(null, { status: 204 });
}
