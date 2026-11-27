import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { mediaType } from "@/lib/media-file";
export async function serveMedia(
  db: SupabaseClient,
  path: string,
  request: Request,
) {
  const type = mediaType(path);
  if (!type) return new Response(null, { status: 404 });
  const { data, error } = await db.storage
    .from("publication-media")
    .createSignedUrl(path, 60);
  if (error || !data)
    return new Response("Media unavailable.", { status: 503 });
  const range = request.headers.get("range");
  if (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range))
    return new Response(null, { status: 416 });
  const upstream = await fetch(data.signedUrl, {
    cache: "no-store",
    headers: range ? { range } : {},
  });
  const headers = new Headers({
    "Content-Type": type,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  });
  for (const name of ["accept-ranges", "content-range", "content-length"]) {
    const v = upstream.headers.get(name);
    if (v) headers.set(name, v);
  }
  if (!upstream.ok) {
    return new Response(null, { status: upstream.status === 416 ? 416 : 502 });
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}
