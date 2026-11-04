import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const supabase = await serverSupabase();
  if (supabase) await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/admin/login', request.url), 303);
}

function methodNotAllowed() {
  return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}
export { methodNotAllowed as GET, methodNotAllowed as HEAD, methodNotAllowed as OPTIONS,
  methodNotAllowed as PUT, methodNotAllowed as PATCH, methodNotAllowed as DELETE };
