'use client';

import { useState, type FormEvent, type ReactNode } from 'react';

export default function SellerApplicationForm({ children }: { children:ReactNode }) {
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(busy)return;
    const form=event.currentTarget;
    const values=Object.fromEntries(new FormData(form).entries());
    setBusy(true);setMessage('Submitting your application…');
    try {
      const response=await fetch('/api/seller-application',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(values)});
      const result=await response.json();
      if(!response.ok||!result.ok) setMessage(response.status===400?'Please check the required fields and enter a valid contact email.':'We could not save your application. Please try again.');
      else if(result.stored===true){setMessage('Your application has been saved for review. This does not verify a seller or publish a listing.');form.reset();}
      else setMessage('Applications are temporarily unavailable. Your information was not saved. Please try again later.');
    } catch {setMessage('We could not confirm your application. Please check your connection and try again.');}
    finally{setBusy(false);}
  }
  return <form action="/api/seller-application" method="post" onSubmit={submit} aria-busy={busy} aria-describedby="seller-note seller-application-status" className="grid max-w-[720px] gap-4 rounded-2xl border border-[#cce3d2] bg-white p-7">
    <fieldset disabled={busy} className="contents">{children}</fieldset>
    <p id="seller-application-status" role="status" aria-live="polite" className="pv-application-status">{message}</p>
  </form>;
}
