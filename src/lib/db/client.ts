import 'server-only';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { getEnv } from '../env';
import { logger } from '../log';
import * as schema from './schema';
import type { Db } from './types';

const MIGRATIONS = path.join(process.cwd(), 'drizzle');

async function createDb(): Promise<Db> {
  const env = getEnv();
  if (env.DATABASE_URL) {
    const { Pool } = await import('pg');
    const { drizzle } = await import('drizzle-orm/node-postgres');
    return drizzle(new Pool({ connectionString: env.DATABASE_URL }), { schema }) as unknown as Db;
  }
  // No database server configured: use the embedded PGlite database on disk.
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  await mkdir(env.PGLITE_DIR, { recursive: true });
  const db = drizzle(await PGlite.create(env.PGLITE_DIR), { schema });
  await migrate(db, { migrationsFolder: MIGRATIONS });
  logger.info('Using embedded PGlite database', { dir: env.PGLITE_DIR });
  return db as unknown as Db;
}

// Cached on globalThis so dev-server reloads reuse one connection (PGlite locks its directory).
const globalForDb = globalThis as unknown as { __rasmiDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  globalForDb.__rasmiDb ??= createDb().catch((error) => {
    globalForDb.__rasmiDb = undefined;
    throw error;
  });
  return globalForDb.__rasmiDb;
}
