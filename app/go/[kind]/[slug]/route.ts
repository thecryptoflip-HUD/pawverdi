import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/shop";
import { readPublicEntries } from "@/lib/publication";
import { validMerchantUrl } from "@/lib/discovery";
import { recordEvent } from "@/lib/commerce-events";
export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ kind: string; slug: string }> },
) {
  const { kind, slug } = await params;
  let href: string | null = null;
  let merchant = "";
  if (kind === "guide") {
    const guide = products.find((p) => p.id === slug);
    if (guide) {
      href = guide.href;
      merchant = guide.merchant;
    }
  } else if (kind === "product" || kind === "deal" || kind === "campaign") {
    const [item] = await readPublicEntries(kind, slug);
    if (
      item &&
      (kind === "product" ||
        (item.verified_at &&
          Date.parse(item.verified_at) <= Date.now() &&
          item.expires_at &&
          Date.parse(item.expires_at) > Date.now()))
    ) {
      href = item.destination_url;
      merchant = item.merchant;
    }
  }
  if (!href || !validMerchantUrl(href))
    return new NextResponse("This destination is unavailable.", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  if (
    !req.headers.has("next-router-prefetch") &&
    req.headers.get("purpose") !== "prefetch"
  )
    await recordEvent(req, kind, slug, merchant, "click");
  const response = NextResponse.redirect(href, 302);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex");
  return response;
}
