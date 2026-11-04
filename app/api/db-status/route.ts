import { NextResponse } from 'next/server';
import { isLive } from '@/lib/supabase';
import { adminClient, serviceKeySource } from '@/lib/supabase-admin';

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

function jwtRole(key: string): string | null {
  const parts = key.split('.');
  if (parts.length < 3) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return typeof payload.role === 'string' ? payload.role : null;
  } catch {
    return null;
  }
}

/**
 * Classify a key by its shape only. Supabase now issues two kinds of key:
 * legacy JWTs (`eyJ...`) and short opaque keys (`sb_publishable_...`,
 * `sb_secret_...`). Neither the value nor any fragment of it is returned here —
 * only a label — so this endpoint stays safe to leave reachable in production.
 */
function keyKind(key: string | undefined): string | null {
  if (!key) return null;
  if (key.startsWith('sb_secret_')) return 'secret key (new format) → service_role';
  if (key.startsWith('sb_publishable_')) return 'publishable key (new format) → anon';
  if (key.startsWith('sbp_')) return 'personal access token — not an API key';
  if (key.startsWith('eyJ')) {
    const role = jwtRole(key);
    return role ? `legacy JWT → ${role}` : 'legacy JWT (payload unreadable)';
  }
  return 'unrecognised format';
}

export async function GET(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const host = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : null;
  const ref = host ? host.split('.')[0] : null;
  const supabase = adminClient();
  const params = new URL(request.url).searchParams;
  const withWrite = params.get('write') === '1';
  const withRoundTrip = params.get('roundtrip') === '1';
  const withPurge = params.get('purge') === '1';

  const base = {
    mode: isLive() ? 'live' : 'demo',
    host,
    ref,
    keyKinds: {
      anon: keyKind(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      service: keyKind(process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_KEY),
    },
    serviceKeySource: serviceKeySource(),
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

  // Insert → read-back → delete, through the same credential path the forms use.
  // An insert that returns an id only proves PostgREST accepted the write; the
  // read-back is what proves the row is actually queryable.
  let roundTrip: Record<string, unknown> | undefined;
  if (withRoundTrip) {
    const email = `roundtrip-${Date.now()}@example.invalid`;
    const ins = await supabase.from('newsletter_subscribers').insert({ email, source: 'roundtrip' }).select('id').single();
    if (ins.error) {
      roundTrip = { insert: { ok: false, error: ins.error.message, code: ins.error.code } };
    } else {
      const read = await supabase.from('newsletter_subscribers').select('id, email, source').eq('email', email).maybeSingle();
      const del = await supabase.from('newsletter_subscribers').delete().eq('email', email).select('id');
      roundTrip = {
        insert: { ok: true, id: ins.data?.id },
        read: read.error
          ? { ok: false, error: read.error.message }
          : { ok: Boolean(read.data), found: read.data ? { id: read.data.id, source: read.data.source } : null },
        delete: del.error ? { ok: false, error: del.error.message } : { ok: true, deleted: del.data?.length ?? 0 },
      };
    }
  }

  // Row counts for the four intake tables, so a form test can prove the row landed
  // without the caller ever holding a database credential.
  const INTAKE = ['newsletter_subscribers', 'contact_messages', 'seller_applications', 'ad_enquiries'] as const;
  const counts: Record<string, number | string> = {};
  for (const table of INTAKE) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    counts[table] = error ? `error: ${error.message}` : (count ?? 0);
  }

  // Removes only test rows this diagnostic created (example.invalid addresses).
  let purged: Record<string, number | string> | undefined;
  if (withPurge) {
    purged = {};
    for (const table of INTAKE) {
      // Both example.com and example.invalid are reserved for documentation and
      // testing (RFC 2606), so anything addressed there is test data by
      // definition — including the addresses the smoke suite submits.
      const { data, error } = await supabase
        .from(table)
        .delete()
        .or('email.like.*@example.com,email.like.*@example.invalid')
        .select('id');
      purged[table] = error ? `error: ${error.message}` : (data?.length ?? 0);
    }
  }

  return NextResponse.json(
    {
      ...base,
      counts,
      ...(roundTrip ? { roundTrip } : {}),
      ...(purged ? { purged } : {}),
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
