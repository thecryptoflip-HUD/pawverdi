import { checkIntake } from '@/lib/intake-limit';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isLive } from '@/lib/supabase';
import { adminClient } from '@/lib/supabase-admin';

const schema = z.object({
  company: z.string().min(2).max(120),
  email: z.string().email().max(254),
  partnership: z.enum(['Advertising placement','Affiliate programme','Brand collaboration','Newsletter sponsorship']).optional(),
  campaign: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  const raw = contentType.includes('application/json')
    ? await request.json().catch(() => null)
    : await request.formData().then(data => Object.fromEntries(data.entries())).catch(() => null);

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

  const limited = await checkIntake(request, 'advertise', parsed.data.email);
  if (limited) return limited;

  const { partnership, campaign, ...contact } = parsed.data;
  const { error } = await supabase.from('ad_enquiries').insert({ ...contact, campaign: partnership ? partnership + '\n' + campaign : campaign, status: 'new' });
  if (error) {
    return NextResponse.json({ ok: false, error: 'Could not record the enquiry.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: true, mode: 'live', message: 'Enquiry received. You will get the rate card after the category check.' });
}
