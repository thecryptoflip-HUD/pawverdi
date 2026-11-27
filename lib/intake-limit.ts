import 'server-only';
import { createHmac } from 'node:crypto';
import { NextResponse } from 'next/server';
import { adminClient, serviceKeySource } from '@/lib/supabase-admin';

/** The optional IP header must be overwritten by the deployment's trusted edge. */
export async function checkIntake(request: Request, form: string, email: string) {
  const db = adminClient();
  const keySource = serviceKeySource();
  const key = keySource ? process.env[keySource] : null;
  if (!db || !key) return null;
  const buckets: [string, number][] = [['email:' + email.trim().toLowerCase(), 4]];
  const header = process.env.PAWVERDI_TRUSTED_IP_HEADER;
  const ip = header && request.headers.get(header)?.split(',')[0].trim();
  if (ip) buckets.unshift(['ip:' + ip, 18]);
  for (const [identifier, max] of buckets) {
    const digest = createHmac('sha256', key).update(form+'|'+identifier).digest('hex');
    const { data, error } = await db.rpc('claim_intake_slot', { p_key: digest, p_max: max });
    if (error) return NextResponse.json({ok:false, error:'Intake temporarily unavailable.'}, {status:503});
    if (!data) return NextResponse.json({ok:false, error:'Please wait before submitting again.'}, {status:429, headers:{'Retry-After':'900'}});
  }
  return null;
}
