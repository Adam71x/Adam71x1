import 'server-only';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import { isLocale, localeFromAcceptLanguage, LOCALE_COOKIE, type Locale } from './config';
import { getMessages } from './messages';

/** The request's locale: the language cookie, else the browser's preference (Arabic by default). */
export const getLocale = cache(async (): Promise<Locale> => {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;
  return localeFromAcceptLanguage((await headers()).get('accept-language'));
});

export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: getMessages(locale) };
}
