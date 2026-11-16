'use client';

import { useState, type FormEvent } from 'react';

export default function NewsletterForm({ id, placeholder = 'Your email address' }: { id:string; placeholder?:string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const email = String(new FormData(form).get('email') ?? '');
    setBusy(true); setMessage(''); setFailed(false);
    try {
      const response = await fetch('/api/newsletter', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({email}) });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setFailed(true); setMessage(response.status === 400 ? 'Please enter a valid email address.' : 'We could not save your signup. Please try again.');
      } else if (result.stored === true) {
        setMessage('Your email has been saved to the PawVerdi update list. Thank you!'); form.reset();
      } else {
        setFailed(true); setMessage('Signups are temporarily unavailable. Your email was not saved. Please try again later.');
      }
    } catch {
      setFailed(true); setMessage('We could not confirm your signup. Please check your connection and try again.');
    } finally { setBusy(false); }
  }
  return <>
    <form action="/api/newsletter" method="post" onSubmit={submit} aria-busy={busy}>
      <label className="sr-only" htmlFor={id}>Email address</label>
      <input id={id} name="email" type="email" required autoComplete="email" maxLength={254} placeholder={placeholder} aria-describedby={`${id}-status`}/>
      <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Subscribe →'}</button>
    </form>
    <p id={`${id}-status`} role="status" aria-live="polite" className={`pv-signup-status${failed?' pv-signup-error':''}`}>{message}</p>
  </>;
}
