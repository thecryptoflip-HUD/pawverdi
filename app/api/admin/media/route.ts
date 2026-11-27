import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { getSession, isStaff } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase-server";
import { adminClient } from "@/lib/supabase-admin";
import { serveMedia } from "@/lib/media-response";
import { identifyMedia, maxMediaBytes } from "@/lib/media-file";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !isStaff(session.role))
    return new Response("Staff access required.", { status: 403 });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response("Origin check failed.", { status: 403 });
  const size = Number(request.headers.get("content-length"));
  if (!Number.isSafeInteger(size) || size <= 0 || size > maxMediaBytes + 16384)
    return new Response("Upload a file of 4 MiB or less.", { status: 413 });
  const db = await serverSupabase(),
    service = adminClient();
  if (!db || !service)
    return new Response("Storage is not configured.", { status: 503 });
  const data = await request.formData().catch(() => null);
  if (!data) return new Response("Invalid upload.", { status: 400 });
  const parsed = z
    .object({
      id: z.string().uuid(),
      revision: z.coerce.number().int().positive(),
      description: z.string().trim().min(1).max(500),
      credit: z.string().trim().min(1).max(250),
      rights: z.literal("on"),
    })
    .safeParse(Object.fromEntries(data));
  const file = data.get("file");
  if (
    !parsed.success ||
    !file ||
    typeof file === "string" ||
    !file.size ||
    file.size > maxMediaBytes
  )
    return new Response(
      "Check the file, credit, description and rights confirmation.",
      { status: 400 },
    );
  const { id, revision, description, credit } = parsed.data;
  const { data: draft, error: readError } = await db
    .from("publication_entries")
    .select("id,media_path")
    .eq("id", id)
    .eq("revision", revision)
    .eq("state", "draft")
    .maybeSingle();
  if (readError || !draft)
    return new Response("Reopen the latest draft before uploading.", {
      status: 409,
    });
  const format = identifyMedia(
    new Uint8Array(await file.slice(0, 256).arrayBuffer()),
    file.type,
  );
  if (!format)
    return new Response("Use a valid JPEG, PNG, WebP, MP4 or WebM file.", {
      status: 415,
    });
  const path = id + "/" + randomUUID() + "." + format.extension;
  const bucket = service.storage.from("publication-media");
  const { error: uploadError } = await bucket.upload(path, file, {
    contentType: format.mime,
    upsert: false,
  });
  if (uploadError)
    return new Response("Could not store the file.", { status: 502 });
  const { data: updated, error } = await db
    .from("publication_entries")
    .update({
      media_path: path,
      media_credit: credit,
      media_description: description,
    })
    .eq("id", id)
    .eq("state", "draft")
    .eq("revision", revision)
    .select("id")
    .maybeSingle();
  if (error || !updated) {
    // Only clear an unreferenced object after a confirmed check; a network error may follow a committed write.
    const { data: referenced, error: lookup } = await db
      .from("publication_entries")
      .select("id")
      .eq("media_path", path)
      .maybeSingle();
    if (!lookup && !referenced) await bucket.remove([path]);
    return new Response(
      "Upload could not be linked. Reopen the draft to check its latest revision.",
      { status: 409 },
    );
  }
  // Concurrent uploads compare the draft revision before replacing its pointer.
  // Old object names are never reused by the upload route.
  let result = "saved";
  if (draft.media_path) {
    const { error: cleanupError } = await bucket.remove([draft.media_path]);
    if (cleanupError) result = "media-cleanup";
  }
  return NextResponse.redirect(
    new URL("/admin?edit=" + id + "&result=" + result + "#media", request.url),
    303,
  );
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || !isStaff(session.role))
    return new Response(null, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!z.string().uuid().safeParse(id).success)
    return new Response(null, { status: 400 });
  const db = await serverSupabase();
  if (!db) return new Response(null, { status: 503 });
  const { data, error } = await db
    .from("publication_entries")
    .select("media_path")
    .eq("id", id)
    .maybeSingle();
  if (error || !data?.media_path) return new Response(null, { status: 404 });
  return serveMedia(db, data.media_path, request);
}
