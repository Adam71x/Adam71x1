import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb, resetDb } from '../db/testing';
import { sessions } from '../db/schema';
import type { Db } from '../db/types';
import { findOrCreateUser } from '../users';
import { SESSION_TTL_MS, createSession, deleteSession, validateSessionToken } from './sessions';

let db: Db;
let close: () => Promise<void>;

beforeAll(async () => ({ db, close } = await createTestDb()));
afterAll(() => close());
beforeEach(() => resetDb(db));

describe('sessions', () => {
  it('returns the user for a valid token and stores only its hash', async () => {
    const user = await findOrCreateUser(db, 'noura@example.com', 'ar');
    const { token } = await createSession(db, user.id);
    expect((await validateSessionToken(db, token))?.id).toBe(user.id);
    const [row] = await db.select().from(sessions);
    expect(row.id).not.toBe(token);
  });

  it('rejects unknown and expired tokens, and removes expired sessions', async () => {
    const user = await findOrCreateUser(db, 'noura@example.com', 'ar');
    const now = new Date();
    const { token } = await createSession(db, user.id, now);
    expect(await validateSessionToken(db, 'not-a-real-token')).toBeNull();
    expect(
      await validateSessionToken(db, token, new Date(now.getTime() + SESSION_TTL_MS + 1)),
    ).toBeNull();
    expect(await db.select().from(sessions)).toHaveLength(0);
  });

  it('signs out by deleting the session', async () => {
    const user = await findOrCreateUser(db, 'noura@example.com', 'ar');
    const { token } = await createSession(db, user.id);
    await deleteSession(db, token);
    expect(await validateSessionToken(db, token)).toBeNull();
  });

  it('creates each user once per email', async () => {
    const a = await findOrCreateUser(db, 'noura@example.com', 'ar');
    const b = await findOrCreateUser(db, 'noura@example.com', 'en');
    expect(b.id).toBe(a.id);
    expect(b.locale).toBe('ar');
  });
});
