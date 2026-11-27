import { readPublicEntries } from "@/lib/publication";
import { publicClient } from "@/lib/supabase";
import { serveMedia } from "@/lib/media-response";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const [entry] = await readPublicEntries(undefined, (await params).slug);
  if (!entry?.media_path) return new Response(null, { status: 404 });
  const db = publicClient();
  if (!db) return new Response(null, { status: 503 });
  return serveMedia(db, entry.media_path, request);
}
