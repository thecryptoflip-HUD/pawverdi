import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isLive } from '@/lib/supabase';
import { adminClient } from '@/lib/supabase-admin';

const schema = z.object({
  email: z.string().email().max(254),
  topic: z.string().min(1).max(60),
  message: z.string().min(10).max(4000),
});

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  const raw = contentType.includes('application/json')
    ? await request.json().catch(() => null)
    : Object.fromEntries((await request.formData()).entries());

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Please include an email, a topic and at least 10 characters of detail.' }, { status: 400 });
  }

  const supabase = adminClient();
  if (!isLive() || !supabase) {
    return NextResponse.json(
      { ok: true, stored: false, mode: 'demo', message: 'Validated your message but did not store or send it — no database or mail provider is configured in demo mode.' },
      { status: 202 },
    );
  }

  const { error } = await supabase.from('contact_messages').insert({ ...parsed.data, status: 'new' });
  if (error) {
    return NextResponse.json({ ok: false, error: 'Could not record the message.', detail: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: true, mode: 'live', message: 'Message received. We reply within the stated window for that topic.' });
}
