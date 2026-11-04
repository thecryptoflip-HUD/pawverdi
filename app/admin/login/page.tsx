import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AdminLoginForm } from '@/components/admin-login-form';

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getSession()) redirect('/admin');
  return <div className="mx-auto max-w-lg px-5 pb-20 pt-[calc(76px+48px)]">
    <h1 className="font-serif text-3xl text-cream">Sign in</h1>
    <AdminLoginForm />
  </div>;
}
