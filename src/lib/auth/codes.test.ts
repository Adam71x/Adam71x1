import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { createTestDb, resetDb } from '../db/testing';
import { loginCodes } from '../db/schema';
import type { Db } from '../db/types';
import {
  CODE_TTL_MS,
  MAX_ATTEMPTS,
  MAX_CODES_PER_HOUR,
  RESEND_COOLDOWN_MS,
  generateCode,
  isValidEmail,
  issueLoginCode,
  normalizeEmail,
  verifyLoginCode,
} from './codes';

const secret = 'test-secret-that-is-long-enough-1234567890';
const email = 'noura@example.com';
let db: Db;
let close: () => Promise<void>;

beforeAll(async () => ({ db, close } = await createTestDb()));
afterAll(() => close());
beforeEach(() => resetDb(db));

const at = (ms: number) => new Date(Date.UTC(2026, 8, 24, 9, 0, 0) + ms);

async function issue(now: Date, address = email) {
  const result = await issueLoginCode(db, { email: address, secret, now });
  if (!result.ok) throw new Error(`issue failed: ${result.reason}`);
  return result.code;
}

describe('email helpers', () => {
  it('normalizes and validates emails', () => {
    expect(normalizeEmail('  Noura@Example.COM ')).toBe('noura@example.com');
    expect(isValidEmail('noura@example.com')).toBe(true);
    expect(isValidEmail('noura@example')).toBe(false);
    expect(isValidEmail('not an email')).toBe(false);
  });

  it('generates 6-digit codes', () => {
    for (let i = 0; i < 50; i++) expect(generateCode()).toMatch(/^\d{6}$/);
  });
});

describe('sign-in codes', () => {
  it('accepts the right code once, case-insensitively on email', async () => {
    const code = await issue(at(0));
    expect(
      await verifyLoginCode(db, { email: 'NOURA@example.com', code, secret, now: at(1000) }),
    ).toEqual({
      ok: true,
    });
    expect(await verifyLoginCode(db, { email, code, secret, now: at(2000) })).toEqual({
      ok: false,
      reason: 'invalid',
    });
  });

  it('stores only a hash of the code', async () => {
    const code = await issue(at(0));
    const rows = await db.select().from(loginCodes).where(eq(loginCodes.email, email));
    expect(rows).toHaveLength(1);
    expect(rows[0].codeHash).not.toContain(code);
    expect(rows[0].codeHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('rejects expired codes', async () => {
    const code = await issue(at(0));
    expect(await verifyLoginCode(db, { email, code, secret, now: at(CODE_TTL_MS + 1) })).toEqual({
      ok: false,
      reason: 'expired',
    });
  });

  it('locks a code after too many wrong attempts', async () => {
    const code = await issue(at(0));
    const wrong = code === '000000' ? '111111' : '000000';
    for (let i = 1; i < MAX_ATTEMPTS; i++) {
      expect(await verifyLoginCode(db, { email, code: wrong, secret, now: at(i) })).toEqual({
        ok: false,
        reason: 'invalid',
      });
    }
    expect(await verifyLoginCode(db, { email, code: wrong, secret, now: at(10) })).toEqual({
      ok: false,
      reason: 'too_many_attempts',
    });
    // Even the right code no longer works.
    expect(await verifyLoginCode(db, { email, code, secret, now: at(11) })).toEqual({
      ok: false,
      reason: 'too_many_attempts',
    });
  });

  it('invalidates the previous code when a new one is issued', async () => {
    const first = await issue(at(0));
    const second = await issue(at(RESEND_COOLDOWN_MS));
    if (first !== second) {
      expect(
        await verifyLoginCode(db, { email, code: first, secret, now: at(RESEND_COOLDOWN_MS + 1) }),
      ).toEqual({ ok: false, reason: 'invalid' });
    }
    expect(
      await verifyLoginCode(db, { email, code: second, secret, now: at(RESEND_COOLDOWN_MS + 2) }),
    ).toEqual({ ok: true });
  });

  it('enforces a resend cooldown', async () => {
    await issue(at(0));
    const result = await issueLoginCode(db, { email, secret, now: at(10_000) });
    expect(result).toEqual({ ok: false, reason: 'cooldown', retryAfterSec: 50 });
  });

  it('caps codes per hour', async () => {
    for (let i = 0; i < MAX_CODES_PER_HOUR; i++) await issue(at(i * RESEND_COOLDOWN_MS));
    const result = await issueLoginCode(db, {
      email,
      secret,
      now: at(MAX_CODES_PER_HOUR * RESEND_COOLDOWN_MS),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('too_many');
  });

  it('keeps codes separate per email', async () => {
    const code = await issue(at(0), 'a@example.com');
    expect(await verifyLoginCode(db, { email: 'b@example.com', code, secret, now: at(1) })).toEqual(
      { ok: false, reason: 'invalid' },
    );
  });
});
