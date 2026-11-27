import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, isStaff, isAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase-server";
import styles from "@/components/discovery.module.css";
import { addStatement } from "./actions";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Commerce performance",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const user = await getSession();
  if (!user || !isStaff(user.role)) redirect("/admin/login");
  const db = await serverSupabase();
  if (!db) redirect("/admin/login");
  const { status, page } = await searchParams;
  const index = Math.min(100000, Math.max(0, Math.floor(Number(page) || 0)));
  const size = 100;
  const [events, statements] = await Promise.all([
    db
      .from("commerce_performance")
      .select("*")
      .order("kind")
      .order("merchant")
      .order("slug")
      .order("attribution")
      .order("campaign")
      .range(index * size, index * size + size),
    db
      .from("merchant_statements")
      .select("merchant,reference,report_date,conversions,commission_cents")
      .order("report_date", { ascending: false })
      .order("merchant")
      .order("reference")
      .range(index * size, index * size + size),
  ]);
  const notices: Record<string, string> = {
    saved: "Statement saved.",
    duplicate: "This statement has already been recorded.",
    invalid: "Check the merchant, date, reference, and amounts.",
    unavailable: "Unable to save this statement.",
  };
  return (
    <section className={styles.wrap}>
      <Link href="/admin">Admin dashboard</Link>
      <h1>Commerce performance</h1>
      <h2>Clicks and impressions</h2>
      <p>
        Last 30 days. Counts include visitors who allowed analytics. Campaign
        click-through rate is clicks divided by viewable impressions.
      </p>
      {events.error ? (
        <p>Event reporting is unavailable.</p>
      ) : events.data?.length ? (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                {[
                  "Merchant",
                  "Type",
                  "Item",
                  "Source",
                  "Inbound campaign",
                  "Clicks",
                  "Impressions",
                  "CTR",
                ].map((x) => (
                  <th scope="col" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.data.slice(0, size).map((e) => (
                <tr
                  key={[
                    e.kind,
                    e.slug,
                    e.merchant,
                    e.attribution,
                    e.campaign,
                  ].join(":")}
                >
                  <th scope="row">{e.merchant}</th>
                  <td>{e.kind}</td>
                  <td>{e.slug}</td>
                  <td>{e.attribution}</td>
                  <td>{e.campaign || "—"}</td>
                  <td>{e.clicks}</td>
                  <td>{e.kind === "campaign" ? e.impressions : "—"}</td>
                  <td>
                    {e.kind === "campaign" && e.impressions
                      ? ((100 * e.clicks) / e.impressions).toFixed(1) + "%"
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No recorded events in this period.</p>
      )}
      <h2>Merchant statements</h2>
      <p>
        Conversions and commissions come from merchant statements and are
        independent of site click counts.
      </p>
      {statements.error ? (
        <p>Statement reporting is unavailable.</p>
      ) : statements.data?.length ? (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                {[
                  "Merchant",
                  "Report date",
                  "Reference",
                  "Conversions",
                  "Commission (USD)",
                ].map((x) => (
                  <th scope="col" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statements.data.slice(0, size).map((s) => (
                <tr key={[s.merchant, s.report_date, s.reference].join(":")}>
                  <th scope="row">{s.merchant}</th>
                  <td>{s.report_date}</td>
                  <td>{s.reference}</td>
                  <td>{s.conversions}</td>
                  <td>{(s.commission_cents / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No merchant statements recorded.</p>
      )}
      <nav className={styles.actions} aria-label="Report pages">
        {index > 0 && <Link href={"?page=" + (index - 1)}>Previous</Link>}
        {((events.data?.length || 0) > size ||
          (statements.data?.length || 0) > size) && (
          <Link href={"?page=" + (index + 1)}>Next</Link>
        )}
      </nav>
      {status && notices[status] && <p role="status">{notices[status]}</p>}
      {isAdmin(user.role) && (
        <>
          <h2>Record a merchant statement</h2>
          <p>
            Enter an aggregate USD total and the merchant’s report reference.
            Exclude buyer details.
          </p>
          <form className={styles.filters} action={addStatement}>
            <label>
              Merchant
              <input name="merchant" maxLength={100} required />
            </label>
            <label>
              Report date
              <input
                name="date"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                required
              />
            </label>
            <label>
              Report reference
              <input name="reference" maxLength={100} required />
            </label>
            <label>
              Conversions
              <input
                name="conversions"
                type="number"
                min="0"
                step="1"
                required
              />
            </label>
            <label>
              Commission (USD)
              <input
                name="commission"
                type="number"
                min="0"
                step=".01"
                required
              />
            </label>
            <button className={styles.button}>Save statement</button>
          </form>
        </>
      )}
    </section>
  );
}
