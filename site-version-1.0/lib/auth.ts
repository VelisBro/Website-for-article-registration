import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'iu5_admin_session';
const SESSION_TTL_DAYS = 14;

function sha256(input: string) {
  return createHash('sha256').update(input).digest('hex');
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error('SESSION_SECRET is not configured');
  }

  return secret;
}

function signToken(token: string) {
  return createHash('sha256')
    .update(`${token}.${getSessionSecret()}`)
    .digest('hex');
}

function serializeCookieValue(token: string) {
  return `${token}.${signToken(token)}`;
}

function parseCookieValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [token, signature] = value.split('.');

  if (!token || !signature) {
    return null;
  }

  const expected = signToken(token);

  if (expected.length !== signature.length) {
    return null;
  }

  const isValid = timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  return isValid ? token : null;
}

export async function createAdminSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.adminSession.create({
    data: {
      tokenHash,
      expiresAt,
      userId,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, serializeCookieValue(token), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = parseCookieValue(cookieStore.get(SESSION_COOKIE)?.value);

  if (token) {
    await prisma.adminSession.deleteMany({
      where: {
        tokenHash: sha256(token),
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = parseCookieValue(cookieStore.get(SESSION_COOKIE)?.value);

  if (!token) {
    return null;
  }

  const session = await prisma.adminSession.findUnique({
    where: {
      tokenHash: sha256(token),
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt <= new Date()) {
    cookieStore.delete(SESSION_COOKIE);

    if (session) {
      await prisma.adminSession.delete({
        where: { id: session.id },
      });
    }

    return null;
  }

  return session.user;
}

export async function requireAdmin() {
  const user = await getCurrentAdmin();

  if (!user) {
    redirect('/login');
  }

  return user;
}

export async function authenticateAdmin(username: string, password: string) {
  const user = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  return isValid ? user : null;
}
