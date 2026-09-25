import { describe, expect, it } from 'vitest';
import { dirOf, localeFromAcceptLanguage } from './config';
import { formatDate, formatHijri, formatMoney, interpolate } from './format';

// 24 September 2026, noon in Riyadh (UTC+3).
const date = new Date(Date.UTC(2026, 8, 24, 9, 0, 0));

describe('formatMoney', () => {
  it('uses Latin digits and the right currency label', () => {
    expect(formatMoney(3250, 'ar')).toBe('3,250 ر.س');
    expect(formatMoney(3250, 'en')).toBe('3,250 SAR');
    expect(formatMoney(1234.5, 'en')).toBe('1,234.5 SAR');
  });
});

describe('dates', () => {
  it('formats Gregorian dates with Latin digits', () => {
    expect(formatDate(date, 'en')).toBe('24 Sept 2026');
    expect(formatDate(date, 'ar')).toMatch(/^24 .+ 2026$/);
  });

  it('formats Umm al-Qura Hijri dates', () => {
    expect(formatHijri(date, 'ar')).toBe('13 ربيع الآخر 1448 هـ');
    expect(formatHijri(date, 'en')).toContain('1448');
  });
});

describe('locale helpers', () => {
  it('gives Arabic a right-to-left direction', () => {
    expect(dirOf('ar')).toBe('rtl');
    expect(dirOf('en')).toBe('ltr');
  });

  it('defaults to Arabic unless English is preferred first', () => {
    expect(localeFromAcceptLanguage(null)).toBe('ar');
    expect(localeFromAcceptLanguage('en-US,en;q=0.9')).toBe('en');
    expect(localeFromAcceptLanguage('ar-SA,en;q=0.8')).toBe('ar');
    expect(localeFromAcceptLanguage('fr-FR')).toBe('ar');
  });

  it('interpolates placeholders', () => {
    expect(interpolate('Welcome, {name}', { name: 'Noura' })).toBe('Welcome, Noura');
    expect(interpolate('{missing} stays', {})).toBe('{missing} stays');
  });
});
