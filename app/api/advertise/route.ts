import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminClient, isLive } from '@/lib/supabase';

const schema = z.object({
  company: z.string().min(2).max(120),
  email: z.string().email().max(254),
  campaign: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  const raw = contentType.includes('application/json')
    ? await request.json().catch(() => null)
    : Object.fromEntries((await request.formData()).entries());

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Company, a work email and a campaign description are required.' }, { status: 400 });
  }

  const supabase = adminClient();
  if (!isLive() || !supabase) {
    return NextResponse.json(
      { ok: true, stored: false, mode: 'demo', message: 'Validated the enquiry; not stored. Advertising intake is disabled until the database is connected.' },
      { status: 202 },
    );
  }

  const { error } = await supabase.from('ad_enquiries').insert({ ...parsed.data, status: 'new' });
  if (error) {
    return NextResponse.json({ ok: false, error: 'Could not record the enquiry.', detail: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: true, mode: 'live', message: 'Enquiry received. You will get the rate card after the category check.' });
}
