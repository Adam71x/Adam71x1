import { sql } from 'drizzle-orm';
import { getDb } from '@/lib/db/client';
import { reportError } from '@/lib/log';

export async function GET() {
  try {
    const db = await getDb();
    await db.execute(sql`select 1`);
    return Response.json({ status: 'ok' });
  } catch (error) {
    reportError(error, { route: '/api/health' });
    return Response.json({ status: 'error' }, { status: 503 });
  }
}
