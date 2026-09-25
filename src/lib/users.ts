import { eq } from 'drizzle-orm';
import { users, type User } from './db/schema';
import type { Db } from './db/types';
import type { Locale } from './i18n/config';

export async function findOrCreateUser(db: Db, email: string, locale: Locale): Promise<User> {
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(users)
    .values({ email, locale })
    .onConflictDoNothing({ target: users.email })
    .returning();
  if (created) return created;
  const [raced] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return raced;
}

export async function updateUser(
  db: Db,
  userId: string,
  data: { name?: string | null; locale?: Locale },
): Promise<void> {
  await db.update(users).set(data).where(eq(users.id, userId));
}
