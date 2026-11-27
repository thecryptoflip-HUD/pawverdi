import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession, isStaff } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase-server";
import { entryKinds, speciesValues, type Entry } from "@/lib/publication";
import { saveEntry, triageInquiry } from "./actions";

export const metadata: Metadata = {
  title: "Publishing desk",
  robots: { index: false, follow: false },
};
const messages: Record<string, string> = {
  "media-cleanup":
    "Media saved. The previous private file needs storage cleanup.",
  updated: "Inquiry status saved.",
  conflict: "The inquiry changed. Refresh and try again.",
  saved: "Entry saved.",
  invalid: "Check the required fields and dates.",
  unavailable: "Database connection unavailable.",
  rejected:
    "Could not save. Refresh the record and check its slug, review state, disclosure and expiration.",
};
const queues = [
  [
    "contact_messages",
    "Contact messages",
    "id, email, topic, message, status, created_at",
  ],
  [
    "ad_enquiries",
    "Advertising inquiries",
    "id, company, email, campaign, status, created_at",
  ],
  [
    "seller_applications",
    "Seller applications",
    "id, trading_name, country, email, status, created_at",
  ],
  [
    "newsletter_subscribers",
    "Newsletter subscribers",
    "email, source, confirmed_at, unsubscribed_at, created_at",
  ],
  ["audit_log", "Publishing audit", "entity, entity_id, action, created_at"],
] as const;
const field =
  "mt-1 block w-full rounded border border-current bg-white px-3 py-2 text-black";
function TextField({
  name,
  label,
  value = "",
  required = false,
  max = 160,
}: {
  name: string;
  label: string;
  value?: string;
  required?: boolean;
  max?: number;
}) {
  return (
    <label>
      {label}
      <input
        className={field}
        name={name}
        defaultValue={value}
        maxLength={max}
        required={required}
      />
    </label>
  );
}
function Editor({ entry, approver }: { entry?: Entry; approver: boolean }) {
  const states = entry
    ? entry.state === "published"
      ? ["draft", "archived"]
      : entry.state === "archived"
        ? ["draft"]
        : [
            "draft",
            "review",
            ...(approver
              ? ["archived", ...(entry.state === "review" ? ["published"] : [])]
              : []),
          ]
    : ["draft"];
  return (
    <form action={saveEntry} className="grid max-w-3xl gap-4">
      {entry && (
        <>
          <input type="hidden" name="id" value={entry.id} />
          <input type="hidden" name="revision" value={entry.revision} />
        </>
      )}
      <label>
        Content type
        <select name="kind" className={field} defaultValue={entry?.kind}>
          {entryKinds.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <TextField name="title" label="Title" value={entry?.title} required />
      <TextField
        name="slug"
        label="URL slug (lowercase words separated by hyphens)"
        value={entry?.slug}
        max={100}
        required
      />
      <TextField
        name="summary"
        label="Summary and search description"
        value={entry?.summary}
        max={400}
        required
      />
      <label>
        Body
        <textarea
          className={field}
          rows={7}
          name="body"
          defaultValue={entry?.body}
          maxLength={30000}
        />
      </label>
      <label>
        Pet category
        <select className={field} name="species" defaultValue={entry?.species}>
          {speciesValues.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <TextField
        name="category"
        label="Subcategory or campaign placement"
        value={entry?.category}
        max={100}
      />
      <TextField name="brand" label="Product brand" value={entry?.brand} />
      <TextField
        name="price_cents"
        label="Verified product price in US cents"
        value={entry?.price_cents?.toString()}
      />
      <TextField
        name="price_checked_at"
        label="Price checked at (UTC, e.g. 2026-11-27T14:00:00Z)"
        value={
          entry?.price_checked_at
            ? new Date(entry.price_checked_at).toISOString()
            : ""
        }
      />
      <TextField
        name="merchant"
        label="Merchant or sponsor"
        value={entry?.merchant}
      />
      <TextField
        name="destination_url"
        label="Approved destination (HTTPS)"
        value={entry?.destination_url ?? ""}
        max={2048}
      />
      <TextField
        name="disclosure"
        label="Commercial disclosure"
        value={entry?.disclosure}
        max={400}
      />
      <TextField
        name="expires_at"
        label="Expires at (UTC, e.g. 2026-12-31T23:59:00Z)"
        value={
          entry?.expires_at ? new Date(entry.expires_at).toISOString() : ""
        }
      />
      <label>
        <input
          type="checkbox"
          name="featured"
          defaultChecked={entry?.featured}
        />{" "}
        Feature on the publication index
      </label>
      <label>
        Save as
        <select
          className={field}
          name="state"
          defaultValue={
            states.includes(entry?.state ?? "draft") ? entry?.state : "draft"
          }
        >
          {states.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <button className="rounded bg-white p-3 text-black" type="submit">
        Save entry
      </button>
    </form>
  );
}
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string;
    result?: string;
    queue?: string;
    page?: string;
  }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const params = await searchParams;
  const db = await serverSupabase();
  const staff = isStaff(session.role);
  const page = Math.max(
    1,
    Math.min(100000, Math.floor(Number(params.page) || 1)),
  );
  const data =
    staff && db
      ? await db
          .from("publication_entries")
          .select("id,title,kind,state")
          .order("updated_at", { ascending: false })
          .range((page - 1) * 40, page * 40)
      : null;
  const editing =
    staff && db && params.edit
      ? await db
          .from("publication_entries")
          .select("*")
          .eq("id", params.edit)
          .maybeSingle()
      : null;
  const allowed = queues.filter(
    (q) => session.role === "admin" || q[0] !== "audit_log",
  );
  const queue = allowed.find((q) => q[0] === params.queue);
  const inbox =
    queue && staff && db
      ? await db
          .from(queue[0])
          .select(queue[2])
          .order("created_at", { ascending: false })
          .range((page - 1) * 40, page * 40)
      : null;
  return (
    <div className="mx-auto max-w-wrap space-y-7 px-6 pb-16 pt-32">
      <h1 className="font-serif text-4xl">Publishing desk</h1>
      <p>
        {session.email} · {session.role}
      </p>
      <form method="post" action="/api/auth/signout">
        <button>Sign out</button>
      </form>
      {!staff ? (
        <p>This account has no administrative access.</p>
      ) : (
        <>
          {params.result && <p role="status">{messages[params.result]}</p>}
          <p>
            <Link href="/admin/performance">
              View campaign and merchant performance
            </Link>
          </p>
          <h2 className="text-2xl">Content library</h2>
          {data?.error ? (
            <p>
              Content could not be loaded. Check the publishing migration and
              database connection.
            </p>
          ) : (
            <ul>
              {data?.data?.slice(0, 40).map((row) => (
                <li key={row.id}>
                  <Link href={"/admin?edit=" + row.id}>{row.title}</Link> ·{" "}
                  {row.kind} · {row.state}
                </li>
              ))}
            </ul>
          )}
          {!data?.error && !data?.data?.length && (
            <p>No entries on this page.</p>
          )}
          <p>
            <Link href="/admin#entry">Create entry</Link> ·{" "}
            <Link href="/discover/published">View published content</Link>
          </p>
          <h2 id="entry" className="text-2xl">
            {params.edit ? "Edit entry" : "Create draft"}
          </h2>
          {params.edit && !editing?.data ? (
            <p>Entry unavailable.</p>
          ) : (
            <Editor
              entry={editing?.data ?? undefined}
              approver={session.role === "reviewer" || session.role === "admin"}
            />
          )}
          {editing?.data?.media_path && (
            <p>
              <a href={"/api/admin/media?id=" + editing.data.id}>
                Preview the attached media
              </a>
            </p>
          )}
          {editing?.data?.state === "draft" && (
            <form
              id="media"
              className="grid max-w-3xl gap-3 rounded border p-5"
              action="/api/admin/media"
              method="post"
              encType="multipart/form-data"
            >
              <h2 className="text-2xl">Draft media</h2>
              {editing.data.media_path && (
                <p>
                  Attached: {editing.data.media_description} ·{" "}
                  {editing.data.media_credit}
                </p>
              )}
              <input type="hidden" name="id" value={editing.data.id} />
              <input
                type="hidden"
                name="revision"
                value={editing.data.revision}
              />
              <label>
                Image or silent video, up to 4 MiB
                <input
                  className={field}
                  type="file"
                  name="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                  required
                />
              </label>
              <TextField
                name="description"
                label="Describe the image or video for visitors"
                max={500}
                required
              />
              <TextField
                name="credit"
                label="Source and visual credit"
                max={250}
                required
              />
              <label>
                <input type="checkbox" name="rights" required /> I verified the
                source, usage rights and asset against the PawVerdi visual
                brief.
              </label>
              <button className="rounded bg-white p-3 text-black">
                Attach to draft
              </button>
            </form>
          )}
          <h2 className="text-2xl">Operations inbox</h2>
          <nav aria-label="Operations inbox" className="flex flex-wrap gap-4">
            {allowed.map((q) => (
              <Link key={q[0]} href={"/admin?queue=" + q[0] + "#inbox"}>
                {q[1]}
              </Link>
            ))}
          </nav>
          {queue && (
            <section id="inbox">
              <h3>{queue[1]}</h3>
              {inbox?.error ? (
                <p>Queue unavailable.</p>
              ) : inbox?.data?.length ? (
                <ul>
                  {inbox.data.slice(0, 40).map((row, i) => (
                    <li key={i} className="my-4 border-b pb-3">
                      <dl>
                        {Object.entries(row)
                          .filter(([name]) => name !== "id")
                          .map(([key, value]) => (
                            <div key={key}>
                              <dt className="inline font-bold">
                                {key.replaceAll("_", " ")}{" "}
                              </dt>
                              <dd className="inline">{String(value ?? "—")}</dd>
                            </div>
                          ))}
                      </dl>
                      {"status" in row && "id" in row && (
                        <form
                          action={triageInquiry}
                          className="my-2 flex flex-wrap gap-3"
                        >
                          <input type="hidden" name="queue" value={queue[0]} />
                          <input
                            type="hidden"
                            name="id"
                            value={String(row.id)}
                          />
                          <input
                            type="hidden"
                            name="previous"
                            value={String(row.status)}
                          />
                          <label>
                            Inquiry status{" "}
                            <select
                              name="status"
                              defaultValue={String(row.status)}
                              className="rounded px-2 text-black"
                            >
                              {["new", "triaged", "closed"].map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </label>
                          <button type="submit">Save status</button>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No records on this page.</p>
              )}
            </section>
          )}
          <nav aria-label="Record pages" className="flex gap-4">
            {page > 1 && (
              <Link
                href={
                  "/admin?page=" +
                  (page - 1) +
                  (queue ? "&queue=" + queue[0] + "#inbox" : "")
                }
              >
                Previous page
              </Link>
            )}
            {(queue ? inbox?.data : data?.data)?.length === 41 && (
              <Link
                href={
                  "/admin?page=" +
                  (page + 1) +
                  (queue ? "&queue=" + queue[0] + "#inbox" : "")
                }
              >
                Next page
              </Link>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
