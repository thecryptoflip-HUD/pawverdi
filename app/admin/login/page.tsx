import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (await getSession()) redirect('/admin');
  return <div className="mx-auto max-w-lg px-5 pb-20 pt-[calc(76px+48px)]">
    <h1 className="font-serif text-3xl text-cream">Sign in</h1>
    <form method="post" action="/api/auth/signin" className="mt-6 grid gap-4">
      <label>Email<input className="mt-1 block w-full rounded p-3 text-forest" name="email" type="email" autoComplete="email" required /></label>
      <label>Password<input className="mt-1 block w-full rounded p-3 text-forest" name="password" type="password" autoComplete="current-password" required /></label>
      {error === '1' && <p role="alert">Email or password is incorrect.</p>}
      {error === 'rate' && <p role="alert">Too many attempts. Try again in a few minutes.</p>}
      <button className="rounded border border-gold px-4 py-3" type="submit">Sign in</button>
    </form>
  </div>;
}
