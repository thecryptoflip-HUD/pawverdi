import { NextResponse } from 'next/server';
import { adminClient, isLive } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Deployment diagnostic (no secrets exposed).
 *
 * Reports the project the deployed app is actually talking to, which key role is
 * loaded (anon vs service_role — decoded from the JWT payload only, never the
 * signature), per-table reachability and a real write test.
 */
const TABLES = [
  'profiles', 'breeds', 'articles', 'article_sources', 'products',
  'seller_applications', 'sellers', 'listings', 'ads', 'ad_enquiries',
  'newsletter_subscribers', 'contact_messages', 'corrections', 'audit_log',
];

function jwtRole(key: string | undefined): string | null {
  if (!key) return null;
  const parts = key.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return typeof payload.role === 'string' ? payload.role : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const host = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : null;
  const ref = host ? host.split('.')[0] : null;
  const supabase = adminClient();
  const withWrite = new URL(request.url).searchParams.get('write') === '1';

  const base = {
    mode: isLive() ? 'live' : 'demo',
    host,
    ref,
    keyRoles: {
      anon: jwtRole(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      service: jwtRole(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
  };

  if (!isLive() || !supabase) {
    return NextResponse.json({ ...base, schemaReady: false, missing: TABLES }, { status: 200 });
  }

  const tables: Record<string, { ok: boolean; count?: number; error?: string }> = {};
  for (const table of TABLES) {
    // NOTE: `head: true` returns 200 even when the relation is absent, which made
    // an earlier version of this probe report "schema ready" on an empty database.
    // A real row fetch is the only trustworthy existence check.
    const { data, error } = await supabase.from(table).select('*').limit(1);
    tables[table] = error
      ? { ok: false, error: error.message }
      : { ok: true, count: data?.length ?? 0 };
  }
  const missing = TABLES.filter((t) => !tables[t].ok);

  let write: Record<string, unknown> | undefined;
  let plainInsert: Record<string, unknown> | undefined;
  if (withWrite) {
    const plainEmail = `plain-${Date.now()}@example.invalid`;
    const pi = await supabase.from('newsletter_subscribers').insert({ email: plainEmail, source: 'diagnostic' }).select('id').single();
    plainInsert = pi.error ? { ok: false, error: pi.error.message, code: pi.error.code, details: pi.error.details } : { ok: true, id: pi.data?.id };
    if (!pi.error && pi.data?.id) await supabase.from('newsletter_subscribers').delete().eq('id', pi.data.id);
  }
  if (withWrite) {
    const email = `diag-${Date.now()}@example.invalid`;
    const ins = await supabase.from('newsletter_subscribers').insert({ email, source: 'diagnostic' }).select('id').single();
    write = ins.error ? { ok: false, error: ins.error.message, code: ins.error.code } : { ok: true, id: ins.data?.id };
    if (!ins.error && ins.data?.id) {
      await supabase.from('newsletter_subscribers').delete().eq('id', ins.data.id);
      write.cleanedUp = true;
    }
  }

  return NextResponse.json(
    {
      ...base,
      schemaReady: missing.length === 0,
      tableCount: TABLES.length - missing.length,
      missing,
      tables,
      ...(write ? { write } : {}),
      ...(plainInsert ? { plainInsert } : {}),
    },
    { status: 200 },
  );
}
