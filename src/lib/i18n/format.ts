import type { Locale } from './config';

const latin = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export function formatNumber(value: number): string {
  return latin.format(value);
}

/** Amounts in SAR with Latin digits, e.g. "3,250 ر.س" or "3,250 SAR". */
export function formatMoney(amount: number, locale: Locale): string {
  return `${latin.format(Math.round(amount * 100) / 100)} ${locale === 'ar' ? 'ر.س' : 'SAR'}`;
}

type DateStyle = 'short' | 'long';

function options(style: DateStyle): Intl.DateTimeFormatOptions {
  return style === 'long'
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    : { day: 'numeric', month: 'short', year: 'numeric' };
}

export function formatDate(date: Date, locale: Locale, style: DateStyle = 'short'): string {
  const tag = locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB';
  return new Intl.DateTimeFormat(tag, { ...options(style), timeZone: 'Asia/Riyadh' }).format(date);
}

/** Umm al-Qura (Saudi official) Hijri date. */
export function formatHijri(date: Date, locale: Locale): string {
  const tag = locale === 'ar' ? 'ar-SA-u-ca-islamic-umalqura-nu-latn' : 'en-u-ca-islamic-umalqura';
  return new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Riyadh',
  }).format(date);
}

/** Replaces `{name}` placeholders. */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
