"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession, isStaff } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase-server";
import { entryKinds, speciesValues } from "@/lib/publication";

const schema = z.object({
  kind: z.enum(entryKinds),
  species: z.enum(speciesValues),
  title: z.string().trim().min(1).max(160),
  slug: z
    .string()
    .max(100)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  summary: z.string().trim().min(1).max(400),
  body: z.string().max(30000),
  category: z.string().trim().max(100),
  merchant: z.string().trim().max(160),
  brand: z.string().trim().max(160),
  price_cents: z.union([
    z.literal(""),
    z
      .string()
      .regex(/^\d{1,10}$/)
      .transform(Number)
      .pipe(z.number().int().nonnegative().max(2147483647)),
  ]),
  price_checked_at: z.union([z.literal(""), z.string().datetime()]),
  disclosure: z.string().trim().max(400),
  destination_url: z.union([
    z.literal(""),
    z
      .string()
      .max(2048)
      .url()
      .regex(/^https:\/\/[A-Za-z0-9.-]+(:[0-9]+)?([/?#][^\s]*)?$/),
  ]),
  expires_at: z.union([z.literal(""), z.string().datetime()]),
  state: z.enum(["draft", "review", "published", "archived"]),
});
export async function saveEntry(form: FormData) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) redirect("/admin/login");
  const db = await serverSupabase();
  if (!db) redirect("/admin?result=unavailable");
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) redirect("/admin?result=invalid");
  const item = parsed.data;
  const values = {
    ...item,
    price_cents: item.price_cents === "" ? null : item.price_cents,
    price_checked_at: item.price_checked_at || null,
    featured: form.get("featured") === "on",
    expires_at: item.expires_at || null,
    destination_url: item.destination_url || null,
  };
  const id = form.get("id");
  let query;
  if (id) {
    if (
      !z.string().uuid().safeParse(id).success ||
      !z.coerce.number().int().positive().safeParse(form.get("revision"))
        .success
    )
      redirect("/admin?result=invalid");
    query = db
      .from("publication_entries")
      .update(values)
      .eq("id", String(id))
      .eq("revision", Number(form.get("revision")));
  } else {
    query = db.from("publication_entries").insert(values);
  }
  const { data, error } = await query.select("id").maybeSingle();
  if (error || !data) redirect("/admin?result=rejected");
  redirect("/admin?result=saved");
}

export async function triageInquiry(form: FormData) {
  const input = z
    .object({
      queue: z.enum([
        "contact_messages",
        "ad_enquiries",
        "seller_applications",
      ]),
      id: z.string().regex(/^(?:[1-9][0-9]*|[a-f0-9-]{36})$/),
      previous: z.enum(["new", "triaged", "closed"]),
      status: z.enum(["new", "triaged", "closed"]),
    })
    .safeParse(Object.fromEntries(form));
  const session = await getSession();
  if (!session || !isStaff(session.role)) redirect("/admin/login");
  if (!input.success) redirect("/admin?result=invalid");
  const db = await serverSupabase();
  if (!db) redirect("/admin?result=unavailable");
  const { queue, id, previous, status } = input.data;
  const { data, error } = await db
    .from(queue)
    .update({ status })
    .eq("id", id)
    .eq("status", previous)
    .select("id")
    .maybeSingle();
  redirect(
    "/admin?queue=" +
      queue +
      "&result=" +
      (data && !error ? "updated" : "conflict") +
      "#inbox",
  );
}
