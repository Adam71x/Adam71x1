import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import type * as schema from './schema';

/** Driver-independent database handle (PGlite in development and tests, node-postgres otherwise). */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

/** True when a query failed on a unique constraint (Postgres error 23505). */
export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  for (let i = 0; i < 4 && current; i++) {
    if (typeof current === 'object' && 'code' in current && current.code === '23505') return true;
    current = typeof current === 'object' && 'cause' in current ? current.cause : undefined;
  }
  return false;
}
