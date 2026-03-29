'use server';

import { redirect } from 'next/navigation';
import { authenticateAdmin, createAdminSession } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');

  if (!username || !password) {
    redirect('/login?error=empty');
  }

  const user = await authenticateAdmin(username, password);

  if (!user) {
    redirect('/login?error=invalid');
  }

  await createAdminSession(user.id);
  redirect('/admin');
}
