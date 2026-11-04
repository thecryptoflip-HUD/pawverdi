import { redirect } from 'next/navigation';
import { getSession, isStaff } from '@/lib/auth';

export async function hasArticleAccess() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return isStaff(session.role);
}
export function AccessNotice() {
  return <div className="mx-auto max-w-wrap px-5 pb-20 pt-[calc(76px+48px)]">
    <p className="mb-4">This account has no administrative access.</p>
    <form action="/api/auth/signout" method="post"><button className="rounded border border-gold px-4 py-2" type="submit">Sign out</button></form>
  </div>;
}
export function Feedback({ saved, error }: { saved?: string; error?: string }) {
  return <>{saved && <p role="status" className="my-4">Changes saved.</p>}{error && <p role="alert" className="my-4">{error}</p>}</>;
}
