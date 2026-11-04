import 'server-only';
import { timingSafeEqual } from 'node:crypto';
import { serverSupabase } from '@/lib/supabase-server';

export type Role = 'reader' | 'editor' | 'reviewer' | 'admin';
export const STAFF_ROLES: Role[] = ['editor', 'reviewer', 'admin'];
export type Session = { userId: string; email: string | null; role: Role; displayName: string | null };

export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await serverSupabase();
    if (!supabase) return null;
    // Validate the cookie credential with Auth rather than trusting getSession().
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    const { data, error: profileError } = await supabase.from('profiles')
      .select('role, display_name').eq('id', user.id).maybeSingle();
    if (profileError) return null;
    const role: Role = data && ['reader', ...STAFF_ROLES].includes(data.role) ? data.role : 'reader';
    return { userId: user.id, email: user.email ?? null, role, displayName: data?.display_name ?? null };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<Session | null> { return getSession(); }
export function isStaff(role: Role): boolean { return STAFF_ROLES.includes(role); }
export function isAdmin(role: Role): boolean { return role === 'admin'; }
export function hasDiagnosticsToken(request: Request): boolean {
  const expected = process.env.DIAGNOSTICS_TOKEN;
  if (!expected) return false;
  const header = request.headers.get('authorization') ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const actual = Buffer.from(provided);
  const target = Buffer.from(expected);
  return actual.length === target.length && timingSafeEqual(actual, target);
}
