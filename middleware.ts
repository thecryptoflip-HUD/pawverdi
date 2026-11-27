import {analyticsAllowed,approvedCampaign} from '@/lib/campaign-attribution';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path=request.nextUrl.pathname;
  const admin=path==='/admin' || path.startsWith('/admin/') || path==='/api/admin' || path.startsWith('/api/admin/');
  if(!admin) {
    if(request.method!=='GET' || path.startsWith('/api/') || path.startsWith('/go/') || !analyticsAllowed(request) ||
       request.headers.has('next-router-prefetch') || request.headers.get('purpose')==='prefetch') return response;
    try {
      const name=await approvedCampaign(request.nextUrl.searchParams.get('utm_campaign'));
      if(name) {
        response.cookies.set('pv_campaign',name,{path:'/',sameSite:'lax',secure:request.nextUrl.protocol==='https:'});
        response.headers.set('Cache-Control','private, no-store');
        response.headers.append('Vary','Cookie');
      }
    } catch { /* Attribution availability must never prevent navigation. */ }
    return response;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let validated = false;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          const previousCookies = response.cookies.getAll();
          response = NextResponse.next({ request });
          previousCookies.forEach((cookie) => response.cookies.set(cookie));
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      validated = !error && Boolean(user);
    } catch {
      // Route-level authorization remains authoritative when Auth is unavailable.
    }
  }
  if ((request.nextUrl.pathname === '/api/admin' || request.nextUrl.pathname.startsWith('/api/admin/')) && !validated) {
    const denied = NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
    response.cookies.getAll().forEach((cookie) => denied.cookies.set(cookie));
    response = denied;
  }
  if (!validated && request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    const login = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.getAll().forEach((cookie) => login.cookies.set(cookie));
    response = login;
  }
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Vary', 'Cookie');
  response.headers.set('Pragma', 'no-cache');
  return response;
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*', {source:'/((?!_next/).*)',has:[{type:'query',key:'utm_campaign'}]}] };
