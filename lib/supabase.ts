/**
 * Supabase clients.
 *
 * The site is designed to run in two modes:
 *  - "demo"   : no env vars set. All reads come from lib/content.ts, writes are
 *               disabled and the UI says so. This is how it runs today.
 *  - "live"   : NEXT_PUBLIC_SUPABASE_URL + keys set. Reads/writes hit Postgres
 *               with row-level security from supabase/migrations.
 *
 * Nothing here falls back silently: `isLive()` is surfaced in the admin UI so an
 * operator can always tell which mode is active.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isLive(): boolean {
  return Boolean(url && anonKey);
}

/** Browser / public client — subject to RLS. Never pass the service key here. */
export function publicClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

/*
 * The privileged client lives in lib/supabase-admin.ts, which imports
 * `server-only`. It is deliberately absent from this module: this file is
 * imported by a server component (SiteFooter) and could plausibly be pulled
 * into a client bundle later, so it must never touch the service key.
 */
