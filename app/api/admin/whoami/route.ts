import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

export async function GET() {
  const session = await requireUser();
  if (!session) return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  return NextResponse.json({ ok: true, role: session.role, displayName: session.displayName });
}
