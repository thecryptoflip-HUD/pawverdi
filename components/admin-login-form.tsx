'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { browserSupabase } from '@/lib/supabase-browser';

export function AdminLoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    setPending(true);
    setError(false);
    try {
      const supabase = browserSupabase();
      if (!supabase) throw new Error('Unavailable');
      const { error } = await supabase.auth.signInWithPassword({
        email: String(fields.get('email') ?? ''), password: String(fields.get('password') ?? ''),
      });
      if (error) throw new Error('Authentication failed');
      router.replace('/admin');
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }
  return <form onSubmit={submit} className="mt-6 grid gap-4">
    <label>Email<input className="mt-1 block w-full rounded p-3 text-forest" name="email" type="email" autoComplete="email" required /></label>
    <label>Password<input className="mt-1 block w-full rounded p-3 text-forest" name="password" type="password" autoComplete="current-password" required /></label>
    {error && <p role="alert">Email or password is incorrect.</p>}
    <button className="rounded border border-gold px-4 py-3 disabled:opacity-50" disabled={pending} type="submit">{pending ? 'Signing in…' : 'Sign in'}</button>
  </form>;
}
