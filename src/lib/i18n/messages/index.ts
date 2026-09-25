import type { Locale } from '../config';
import { ar, type Messages } from './ar';
import { en } from './en';

const all: Record<Locale, Messages> = { ar, en };

export function getMessages(locale: Locale): Messages {
  return all[locale];
}

export type { Messages };
