/**
 * Server-only Supabase client. Bypasses Row Level Security.
 *
 * `server-only` is a build-time tripwire: if any client component ever imports
 * this module, the build fails instead of quietly shipping the privileged key
 * into a browser bundle. That is the guarantee worth having, not a comment.
 *
 * Key resolution accepts both Supabase naming schemes:
 *   SUPABASE_SERVICE_ROLE_KEY  legacy JWT   (`eyJ...`, role=service_role)
 *   SUPABASE_SECRET_KEY        secret key   (`sb_secret_...`, maps to service_role)
 *
 * Both resolve to the same Postgres role and bypass RLS identically, so the
 * application code does not need to know which one is in use.
 */
import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

const candidates: Array<[string, string | undefined]> = [
  ['SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY],
  ['SUPABASE_SECRET_KEY', process.env.SUPABASE_SECRET_KEY],
  ['SUPABASE_SERVICE_KEY', process.env.SUPABASE_SERVICE_KEY],
];
const resolved = candidates.find(([, value]) => Boolean(value));

/** Name of the env var supplying the privileged key — never the value. */
export function serviceKeySource(): string | null {
  return resolved ? resolved[0] : null;
}

/**
 * Privileged client for server code paths only (route handlers, server actions).
 * Returns null when the key is absent, so callers fall back to an honest
 * "not stored" response instead of pretending a write succeeded.
 */
export function adminClient(): SupabaseClient | null {
  if (!url || !resolved) return null;
  return createClient(url, resolved[1] as string, { auth: { persistSession: false } });
}
