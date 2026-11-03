import { NextResponse } from 'next/server';
import { adminClient, isLive } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Deployment diagnostic. Reports, per table, whether PostgREST can see it.
 *
 * Purpose: after connecting a fresh Supabase project it is otherwise impossible
 * to tell "migration not applied" from "migration applied but schema cache is
 * stale" without a database console. This answers that from outside.
 *
 * Exposes only: the project ref (public part of the URL), and per-table
 * ok/count/error. No rows, no keys, no user data.
 */
const TABLES = [
  'profiles',
  'breeds',
  'articles',
  'article_sources',
  'products',
  'seller_applications',
  'sellers',
  'listings',
  'ads',
  'ad_enquiries',
  'newsletter_subscribers',
  'contact_messages',
  'corrections',
  'audit_log',
];

export async function GET() {
  const supabase = adminClient();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const ref = url ? url.replace(/^https?:\/\//, '').split('.')[0] : null;

  if (!isLive() || !supabase) {
    return NextResponse.json({ mode: 'demo', ref, tables: {}, missing: TABLES }, { status: 200 });
  }

  const results: Record<string, { ok: boolean; count?: number; error?: string }> = {};

  for (const table of TABLES) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    results[table] = error ? { ok: false, error: error.message } : { ok: true, count: count ?? 0 };
  }

  const missing = TABLES.filter((t) => !results[t].ok);

  return NextResponse.json(
    {
      mode: 'live',
      ref,
      schemaReady: missing.length === 0,
      tableCount: TABLES.length - missing.length,
      missing,
      tables: results,
    },
    { status: 200 },
  );
}
