import 'server-only';
import { cookies } from 'next/headers';
import { LOCALE_COOKIE, type Locale } from '../i18n/config';

export const SESSION_COOKIE = 'rasmi_session';
const secure = process.env.NODE_ENV === 'production';

export async function readSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function setLocaleCookie(locale: Locale) {
  (await cookies()).set(LOCALE_COOKIE, locale, {
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}
