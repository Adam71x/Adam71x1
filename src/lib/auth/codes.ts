import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { and, desc, eq, gt, isNull } from 'drizzle-orm';
import { loginCodes } from '../db/schema';
import type { Db } from '../db/types';

export const CODE_LENGTH = 6;
export const CODE_TTL_MS = 10 * 60_000;
export const MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_MS = 60_000;
export const MAX_CODES_PER_HOUR = 5;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

export function generateCode(): string {
  return randomInt(0, 10 ** CODE_LENGTH)
    .toString()
    .padStart(CODE_LENGTH, '0');
}

export function hashCode(secret: string, email: string, code: string): string {
  return createHmac('sha256', secret).update(`${email}:${code}`).digest('hex');
}

export type IssueResult =
  | { ok: true; code: string }
  | { ok: false; reason: 'cooldown' | 'too_many'; retryAfterSec: number };

/** Creates a new sign-in code for an email, enforcing resend cooldown and an hourly cap. */
export async function issueLoginCode(
  db: Db,
  opts: { email: string; secret: string; now?: Date },
): Promise<IssueResult> {
  const now = opts.now ?? new Date();
  const email = normalizeEmail(opts.email);
  const hourAgo = new Date(now.getTime() - 60 * 60_000);
  const recent = await db
    .select({ createdAt: loginCodes.createdAt })
    .from(loginCodes)
    .where(and(eq(loginCodes.email, email), gt(loginCodes.createdAt, hourAgo)))
    .orderBy(desc(loginCodes.createdAt));

  if (recent.length >= MAX_CODES_PER_HOUR) {
    const oldest = recent[recent.length - 1].createdAt.getTime();
    return {
      ok: false,
      reason: 'too_many',
      retryAfterSec: Math.ceil((oldest + 60 * 60_000 - now.getTime()) / 1000),
    };
  }
  if (recent[0] && now.getTime() - recent[0].createdAt.getTime() < RESEND_COOLDOWN_MS) {
    return {
      ok: false,
      reason: 'cooldown',
      retryAfterSec: Math.ceil(
        (recent[0].createdAt.getTime() + RESEND_COOLDOWN_MS - now.getTime()) / 1000,
      ),
    };
  }

  const code = generateCode();
  await db.transaction(async (tx) => {
    // Only the newest code is ever valid.
    await tx
      .update(loginCodes)
      .set({ consumedAt: now })
      .where(and(eq(loginCodes.email, email), isNull(loginCodes.consumedAt)));
    await tx.insert(loginCodes).values({
      email,
      codeHash: hashCode(opts.secret, email, code),
      expiresAt: new Date(now.getTime() + CODE_TTL_MS),
      createdAt: now,
    });
  });
  return { ok: true, code };
}

export type VerifyResult =
  { ok: true } | { ok: false; reason: 'invalid' | 'expired' | 'too_many_attempts' };

export async function verifyLoginCode(
  db: Db,
  opts: { email: string; code: string; secret: string; now?: Date },
): Promise<VerifyResult> {
  const now = opts.now ?? new Date();
  const email = normalizeEmail(opts.email);
  const code = opts.code.replace(/\s/g, '');
  const [row] = await db
    .select()
    .from(loginCodes)
    .where(and(eq(loginCodes.email, email), isNull(loginCodes.consumedAt)))
    .orderBy(desc(loginCodes.createdAt))
    .limit(1);

  if (!row) return { ok: false, reason: 'invalid' };
  if (row.expiresAt.getTime() <= now.getTime()) return { ok: false, reason: 'expired' };
  if (row.attempts >= MAX_ATTEMPTS) return { ok: false, reason: 'too_many_attempts' };

  const expected = Buffer.from(row.codeHash, 'hex');
  const actual = Buffer.from(hashCode(opts.secret, email, code), 'hex');
  const match =
    /^\d+$/.test(code) && expected.length === actual.length && timingSafeEqual(expected, actual);

  if (!match) {
    const attempts = row.attempts + 1;
    await db.update(loginCodes).set({ attempts }).where(eq(loginCodes.id, row.id));
    return { ok: false, reason: attempts >= MAX_ATTEMPTS ? 'too_many_attempts' : 'invalid' };
  }

  await db.update(loginCodes).set({ consumedAt: now }).where(eq(loginCodes.id, row.id));
  return { ok: true };
}
