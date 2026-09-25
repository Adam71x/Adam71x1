'use server';

import { redirect } from 'next/navigation';
import { getDb } from '../db/client';
import { getEnv } from '../env';
import { getMailer, loginCodeEmail } from '../email';
import { isLocale } from '../i18n/config';
import { interpolate } from '../i18n/format';
import { getI18n } from '../i18n/server';
import { logger } from '../log';
import { findOrCreateUser } from '../users';
import { isValidEmail, issueLoginCode, normalizeEmail, verifyLoginCode } from './codes';
import { clearSessionCookie, readSessionToken, setLocaleCookie, setSessionCookie } from './cookies';
import { createSession, deleteSession } from './sessions';

export type SignInState = {
  step: 'email' | 'code';
  email: string;
  error?: string;
  notice?: string;
};

async function requestCode(form: FormData): Promise<SignInState> {
  const { locale, t } = await getI18n();
  const email = normalizeEmail(String(form.get('email') ?? ''));
  if (!isValidEmail(email)) return { step: 'email', email, error: t.signIn.errors.email };

  const env = getEnv();
  const db = await getDb();
  const issued = await issueLoginCode(db, { email, secret: env.AUTH_SECRET });
  if (!issued.ok) {
    const error =
      issued.reason === 'cooldown'
        ? interpolate(t.signIn.errors.cooldown, { seconds: issued.retryAfterSec })
        : interpolate(t.signIn.errors.tooMany, { minutes: Math.ceil(issued.retryAfterSec / 60) });
    // A cooldown after a code was just sent should keep the user on the code step.
    return { step: form.get('intent') === 'resend' ? 'code' : 'email', email, error };
  }
  await getMailer().send({ to: email, ...loginCodeEmail(locale, issued.code) });
  logger.info('Sign-in code sent', { email });
  return { step: 'code', email, notice: interpolate(t.signIn.codeSent, { email }) };
}

async function verifyCode(prev: SignInState, form: FormData): Promise<SignInState> {
  const { locale, t } = await getI18n();
  const email = normalizeEmail(String(form.get('email') ?? prev.email));
  const code = String(form.get('code') ?? '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) return { step: 'code', email, error: t.signIn.errors.code };

  const db = await getDb();
  const result = await verifyLoginCode(db, { email, code, secret: getEnv().AUTH_SECRET });
  if (!result.ok) {
    const error = {
      invalid: t.signIn.errors.invalid,
      expired: t.signIn.errors.expired,
      too_many_attempts: t.signIn.errors.tooManyAttempts,
    }[result.reason];
    return { step: 'code', email, error };
  }

  const user = await findOrCreateUser(db, email, locale);
  const session = await createSession(db, user.id);
  await setSessionCookie(session.token, session.expiresAt);
  if (isLocale(user.locale)) await setLocaleCookie(user.locale);
  logger.info('User signed in', { userId: user.id });
  redirect('/');
}

/** The sign-in form posts every step here; `intent` says which one. */
export async function signInAction(prev: SignInState, form: FormData): Promise<SignInState> {
  const intent = form.get('intent');
  if (intent === 'verify') return verifyCode(prev, form);
  if (intent === 'change') return { step: 'email', email: prev.email };
  return requestCode(form);
}

export async function signOutAction() {
  const token = await readSessionToken();
  if (token) await deleteSession(await getDb(), token);
  await clearSessionCookie();
  redirect('/sign-in');
}

/** Language switch for signed-out pages. Signed-in users change it in Settings. */
export async function setLocaleAction(form: FormData) {
  const locale = form.get('locale');
  if (isLocale(locale)) await setLocaleCookie(locale);
}
