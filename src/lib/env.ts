import 'server-only';
import { z } from 'zod';
import { logger } from './log';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().optional(),
  PGLITE_DIR: z.string().default('.data/pglite'),
  AUTH_SECRET: z.string().optional(),
  APP_URL: z.string().default('http://localhost:3000'),
  EMAIL_TRANSPORT: z.enum(['console', 'file', 'resend']).default('console'),
  MAILBOX_FILE: z.string().default('.data/mailbox.log'),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Rasmi <onboarding@resend.dev>'),
});

export type Env = z.infer<typeof schema> & { AUTH_SECRET: string };

const DEV_SECRET = 'rasmi-development-secret-do-not-use-in-production';

let cached: Env | undefined;

/** Reads and validates environment variables once, on first use (never at build time). */
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = schema.parse({
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL || undefined,
    AUTH_SECRET: process.env.AUTH_SECRET || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    EMAIL_FROM: process.env.EMAIL_FROM || undefined,
  });
  let secret = parsed.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    if (parsed.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET must be set to at least 32 characters in production.');
    }
    if (secret)
      logger.warn('AUTH_SECRET is shorter than 32 characters; using it in development only.');
    secret ??= DEV_SECRET;
  }
  if (parsed.EMAIL_TRANSPORT === 'resend' && !parsed.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required when EMAIL_TRANSPORT=resend.');
  }
  cached = { ...parsed, AUTH_SECRET: secret };
  return cached;
}
