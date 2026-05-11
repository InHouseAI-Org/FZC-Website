// Admin authentication utilities
import { cookies } from 'next/headers';

export const ADMIN_CREDENTIALS = {
  username: 'Inmarco',
  password: 'Inmarco@123',
};

export const SESSION_COOKIE_NAME = 'admin_session';

export function generateSessionToken(): string {
  return btoa(`${Date.now()}-${Math.random()}`);
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

export async function createSession(): Promise<string> {
  const token = generateSessionToken();
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}
