import 'server-only';
import { createHash } from 'node:crypto';
import { adminClient } from '@/lib/supabase-admin';

export type LimitVerdict = { allowed: boolean; retryAfterSeconds: number };
const WINDOW_MS = 15 * 60 * 1000;
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const hashes = (email: string, ip: string) => ({ email_hash: hash(email.trim().toLowerCase()), ip_hash: hash(ip) });

export async function checkLoginLimit(email: string, ip: string): Promise<LimitVerdict> {
  try {
    const client = adminClient();
    if (!client) return { allowed: true, retryAfterSeconds: 0 };
    const now = Date.now();
    const since = new Date(now - WINDOW_MS).toISOString();
    const keys = hashes(email, ip);
    const waits = await Promise.all(([['email_hash', 5], ['ip_hash', 20]] as const).map(async ([field, limit]) => {
      const query = () => client.from('audit_log').select('id', { count: 'exact', head: true })
        .eq('entity', 'auth').eq('action', 'auth.login_failed').gte('created_at', since).eq(`detail->>${field}`, keys[field]);
      const { count, error } = await query();
      if (error || count === null) throw new Error('Rate limit store unavailable');
      if (count < limit) return 0;
      // With more than limit failures, enough failures must expire to fall below the limit.
      const { data, error: oldestError } = await client.from('audit_log').select('created_at')
        .eq('entity', 'auth').eq('action', 'auth.login_failed').gte('created_at', since)
        .eq(`detail->>${field}`, keys[field]).order('created_at', { ascending: true }).range(count - limit, count - limit);
      if (oldestError || !data?.[0]) throw new Error('Rate limit store unavailable');
      const expires = Date.parse(data[0].created_at) + WINDOW_MS;
      if (!Number.isFinite(expires)) throw new Error('Invalid rate limit timestamp');
      return Math.max(1, Math.ceil((expires - now) / 1000));
    }));
    const retryAfterSeconds = Math.max(...waits);
    return { allowed: retryAfterSeconds === 0, retryAfterSeconds };
  } catch {
    console.warn('Login rate limit store unavailable; allowing credential verification.');
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

export async function recordLoginAttempt(email: string, ip: string, ok: boolean): Promise<void> {
  try {
    const client = adminClient();
    if (!client) return;
    const { error } = await client.from('audit_log').insert({
      entity: 'auth', action: ok ? 'auth.login_success' : 'auth.login_failed', detail: hashes(email, ip),
    });
    if (error) throw new Error('Audit store unavailable');
  } catch {
    console.warn('Login audit store unavailable.');
  }
}
