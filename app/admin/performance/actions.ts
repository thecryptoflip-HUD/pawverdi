"use server";
import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase-server";
export async function addStatement(form: FormData) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) redirect("/admin/login");
  const db = await serverSupabase();
  if (!db) redirect("/admin/performance?status=unavailable");
  const field = (k: string) => String(form.get(k) || "").trim();
  const merchant = field("merchant"),
    reference = field("reference"),
    report_date = field("date"),
    count = field("conversions"),
    amount = field("commission");
  if (
    !merchant ||
    !reference ||
    merchant.length > 100 ||
    reference.length > 100 ||
    !/^\d{4}-\d\d-\d\d$/.test(report_date) ||
    report_date > new Date().toISOString().slice(0, 10) ||
    !/^\d{1,9}$/.test(count) ||
    !/^\d{1,7}(\.\d{1,2})?$/.test(amount)
  )
    redirect("/admin/performance?status=invalid");
  const { error } = await db
    .from("merchant_statements")
    .insert({
      merchant,
      reference,
      report_date,
      conversions: Number(count),
      commission_cents: Math.round(Number(amount) * 100),
    });
  redirect(
    "/admin/performance?status=" +
      (error
        ? error.code === "23505"
          ? "duplicate"
          : "unavailable"
        : "saved"),
  );
}
