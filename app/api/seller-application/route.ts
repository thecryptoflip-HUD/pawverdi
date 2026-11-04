import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isLive } from '@/lib/supabase';
import { adminClient } from '@/lib/supabase-admin';

const schema = z.object({
  trading_name: z.string().min(2).max(140),
  country: z.string().min(2).max(80),
  email: z.string().email().max(254),
  licence: z.string().min(2).max(80),
  schemes: z.string().max(1000).optional().default(''),
});

/**
 * Seller intake. Deliberately the most conservative endpoint in the app: a
 * submission never creates a live listing, it only opens a verification case.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  const raw = contentType.includes('application/json')
    ? await request.json().catch(() => null)
    : Object.fromEntries((await request.formData()).entries());

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Trading name, country, email and licence number are required.' }, { status: 400 });
  }

  const supabase = adminClient();
  if (!isLive() || !supabase) {
    return NextResponse.json(
      {
        ok: true,
        stored: false,
        mode: 'demo',
        message: 'Validated the application; not stored. Seller verification opens when Supabase and the reviewer rota are connected.',
      },
      { status: 202 },
    );
  }

  const { data, error } = await supabase
    .from('seller_applications')
    .insert({ ...parsed.data, status: 'received', gate: 'identity' })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: 'Could not open the application.', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    stored: true,
    caseId: data?.id ?? null,
    message: 'Application received. A reviewer responds within five working days with the gate outcome.',
  });
}
