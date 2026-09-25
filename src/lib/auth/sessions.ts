import { createHash, randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { sessions, users, type User } from '../db/schema';
import type { Db } from '../db/types';

export const SESSION_TTL_MS = 30 * 24 * 60 * 60_000;

export function newSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function sessionIdFromToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(
  db: Db,
  userId: string,
  now = new Date(),
): Promise<{ token: string; expiresAt: Date }> {
  const token = newSessionToken();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
  await db.insert(sessions).values({ id: sessionIdFromToken(token), userId, expiresAt });
  return { token, expiresAt };
}

/** Returns the signed-in user for a cookie token, or null. Expired sessions are removed. */
export async function validateSessionToken(
  db: Db,
  token: string,
  now = new Date(),
): Promise<User | null> {
  const id = sessionIdFromToken(token);
  const [row] = await db
    .select({ user: users, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, id))
    .limit(1);
  if (!row) return null;
  if (row.expiresAt.getTime() <= now.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return null;
  }
  return row.user;
}

export async function deleteSession(db: Db, token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionIdFromToken(token)));
}
