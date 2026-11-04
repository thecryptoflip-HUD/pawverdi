import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabase-server';
import { checkLoginLimit, recordLoginAttempt } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const redirect = (path: string) => {
    const response = NextResponse.redirect(new URL(path, request.url), 303);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  };
  let email = '';
  let password = '';
  try {
    const fields = request.headers.get('content-type')?.includes('application/json')
      ? await request.json() : Object.fromEntries(await request.formData());
    email = typeof fields.email === 'string' ? fields.email.trim().toLowerCase() : '';
    password = typeof fields.password === 'string' ? fields.password : '';
  } catch {
    return redirect('/admin/login?error=1');
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim() || 'unknown';
  const verdict = await checkLoginLimit(email, ip);
  if (!verdict.allowed) {
    const response = redirect('/admin/login?error=rate');
    response.headers.set('Retry-After', String(verdict.retryAfterSeconds));
    return response;
  }
  let ok = false;
  try {
    const supabase = await serverSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      ok = !error && Boolean(data.user);
    }
  } catch {
    // Authentication failures and outages have the same public response.
  }
  await recordLoginAttempt(email, ip, ok);
  return redirect(ok ? '/admin' : '/admin/login?error=1');
}

function methodNotAllowed() {
  return new Response(null, { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'private, no-store' } });
}
export { methodNotAllowed as GET, methodNotAllowed as HEAD, methodNotAllowed as OPTIONS,
  methodNotAllowed as PUT, methodNotAllowed as PATCH, methodNotAllowed as DELETE };
