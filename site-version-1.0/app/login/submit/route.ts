import { NextResponse } from 'next/server';
import { authenticateAdmin, createAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');

  if (!username || !password) {
    return NextResponse.redirect(new URL('/login?error=empty', request.url), 303);
  }

  const user = await authenticateAdmin(username, password);

  if (!user) {
    return NextResponse.redirect(new URL('/login?error=invalid', request.url), 303);
  }

  await createAdminSession(user.id);

  return NextResponse.redirect(new URL('/admin', request.url), 303);
}
