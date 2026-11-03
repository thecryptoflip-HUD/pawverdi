import { NextResponse } from 'next/server';
import { isLive } from '@/lib/supabase';
import { articles } from '@/lib/content';

export const dynamic = 'force-dynamic';

/** Liveness + mode probe used by the deploy smoke test. */
export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'pawverdi',
    mode: isLive() ? 'live' : 'demo',
    content: { articles: articles.length },
    time: new Date().toISOString(),
  });
}
