'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { site } from '@/lib/site';

export default function EnquiryForm({ action, className, children, id }: { action: string; className: string; children: ReactNode; id?: string }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    setBusy(true);
    setStatus('');
    try {
      const response = await fetch(action, { method: 'POST', body: new FormData(form) });
      const result = await response.json();
      if (response.ok && result.stored === true) {
        setStatus('Thank you. PawVerdi received your enquiry.');
        form.reset();
      } else if (response.status === 400) {
        setStatus(result.error || 'Please check the fields and try again.');
      } else if (response.status === 429) {
        setStatus('Please wait before sending another enquiry.');
      } else {
        setStatus('We could not confirm receipt. Your entries are still here. You can email ' + site.email + '.');
      }
    } catch { setStatus('We could not confirm receipt. Check your connection or email ' + site.email + '.'); }
    finally { setBusy(false); }
  }
  return <form id={id} action={action} method="post" className={className} onSubmit={submit} aria-busy={busy}>
    {children}<button type="submit" disabled={busy} className="btn btn-solid w-full justify-center">{busy ? 'Sending…' : 'Send enquiry'}</button>
    <p role="status" className="text-sm text-cream/85">{status}</p>
  </form>;
}
