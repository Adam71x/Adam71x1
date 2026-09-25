import 'server-only';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { getEnv } from '../env';
import { logger } from '../log';
import type { Locale } from '../i18n/config';

export type EmailMessage = { to: string; subject: string; text: string };

export interface Mailer {
  send(message: EmailMessage): Promise<void>;
}

/** Prints emails to the server log. Used until an email provider is chosen at hosting time. */
const consoleMailer: Mailer = {
  async send(message) {
    logger.info('Email (console transport)', {
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
  },
};

/** Appends emails as JSON lines to a file. End-to-end tests read sign-in codes from it. */
function fileMailer(file: string): Mailer {
  return {
    async send(message) {
      await mkdir(path.dirname(file), { recursive: true });
      await appendFile(file, JSON.stringify({ ...message, at: new Date().toISOString() }) + '\n');
    },
  };
}

export function getMailer(): Mailer {
  const env = getEnv();
  return env.EMAIL_TRANSPORT === 'file' ? fileMailer(env.MAILBOX_FILE) : consoleMailer;
}

export function loginCodeEmail(locale: Locale, code: string): Omit<EmailMessage, 'to'> {
  return locale === 'ar'
    ? {
        subject: `رمز الدخول إلى رسمي: ${code}`,
        text: `رمز الدخول الخاص بك هو ${code}\nصالح لمدة 10 دقائق. إن لم تطلبه، تجاهل هذه الرسالة.`,
      }
    : {
        subject: `Your Rasmi sign-in code: ${code}`,
        text: `Your sign-in code is ${code}\nIt is valid for 10 minutes. If you did not request it, ignore this email.`,
      };
}
