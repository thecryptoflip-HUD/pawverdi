import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const supabase = await serverSupabase();
  if (supabase) await supabase.auth.signOut();
  const response = NextResponse.redirect(new URL('/admin/login', request.url), 303);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

function methodNotAllowed() {
  return new Response(null, { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'private, no-store' } });
}
export { methodNotAllowed as GET, methodNotAllowed as HEAD, methodNotAllowed as OPTIONS,
  methodNotAllowed as PUT, methodNotAllowed as PATCH, methodNotAllowed as DELETE };
