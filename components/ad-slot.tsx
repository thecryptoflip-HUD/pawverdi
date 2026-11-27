import Link from "next/link";
import { connection } from "next/server";
import { isLive } from "@/lib/supabase";
import { readPublicEntries } from "@/lib/publication";
import { validMerchantUrl } from "@/lib/discovery";
import AdImpression from "./ad-impression";
export default async function AdSlot({
  placement,
  format = "inline",
}: {
  placement: string;
  format?: "inline" | "leaderboard";
}) {
  if (isLive()) await connection();
  const campaign = (await readPublicEntries("campaign")).find(
    (c) =>
      c.category === placement &&
      c.merchant &&
      c.disclosure &&
      c.verified_at &&
      c.expires_at &&
      Date.parse(c.expires_at) > Date.now() &&
      validMerchantUrl(c.destination_url),
  );
  if (!campaign)
    return (
      <aside
        className="pv-empty-ad"
        aria-label="Advertising availability"
        data-placement={placement}
      >
        <span>
          <span className="pv-empty-label">Advertising</span> · This slot is
          unsold.
        </span>
        <Link href="/advertise">Advertising standards →</Link>
      </aside>
    );
  return (
    <AdImpression slug={campaign.slug}>
      <aside
        aria-label={"Sponsored content — " + placement}
        data-placement={placement}
        className={
          "rounded-2xl bg-moss text-cream " +
          (format === "leaderboard" ? "p-8" : "p-6")
        }
      >
        <span className="tag tag-ad">Sponsored</span>
        <p>{campaign.merchant}</p>
        <h3 className="font-serif text-xl">{campaign.title}</h3>
        <p>{campaign.summary}</p>
        <p>{campaign.disclosure}</p>
        <a
          href={"/go/campaign/" + campaign.slug}
          rel="sponsored nofollow"
          className="underline"
        >
          Visit sponsor →
        </a>
      </aside>
    </AdImpression>
  );
}
