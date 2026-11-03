import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminClient, isLive } from '@/lib/supabase';

const schema = z.object({ email: z.string().email().max(254) });

/**
 * Newsletter signup.
 *
 * Demo mode returns 202 with stored:false — it never claims a subscription it
 * did not create. Live mode writes to `newsletter_subscribers`, which is unique
 * on lower(email), and returns 200 only after the row is confirmed.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  const raw = contentType.includes('application/json')
    ? await request.json().catch(() => null)
    : Object.fromEntries((await request.formData()).entries());

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'A valid email address is required.' }, { status: 400 });
  }

  const supabase = adminClient();
  if (!isLive() || !supabase) {
    return NextResponse.json(
      {
        ok: true,
        stored: false,
        mode: 'demo',
        message: 'Validated, but no database is connected — nothing was stored. Connect Supabase to enable signups.',
      },
      { status: 202 },
    );
  }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email: parsed.data.email.toLowerCase(), source: 'site' }, { onConflict: 'email' });

  if (error) {
    return NextResponse.json({ ok: false, error: 'Could not store the subscription.', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true, mode: 'live', message: 'Check your inbox to confirm the subscription.' });
}
