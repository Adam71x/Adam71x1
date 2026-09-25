import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import * as schema from './schema';
import type { Db } from './types';

/** A fresh in-memory database with all migrations applied. */
export async function createTestDb(): Promise<{ db: Db; close: () => Promise<void> }> {
  const client = await PGlite.create();
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
  return { db: db as unknown as Db, close: () => client.close() };
}

export async function resetDb(db: Db) {
  await db.delete(schema.memberships);
  await db.delete(schema.workspaces);
  await db.delete(schema.sessions);
  await db.delete(schema.loginCodes);
  await db.delete(schema.users);
}
