import { and, eq } from 'drizzle-orm';
import { memberships, workspaces, type Role, type Workspace } from './db/schema';
import { isUniqueViolation, type Db } from './db/types';

export const RESERVED_SLUGS = new Set([
  'www',
  'app',
  'api',
  'admin',
  'mail',
  'email',
  'help',
  'support',
  'rasmi',
  'blog',
  'static',
  'assets',
  'cdn',
  'status',
  'docs',
  'dashboard',
  'login',
  'signin',
  'sign-in',
  'signup',
  'account',
  'billing',
  'settings',
  'o',
  'i',
]);

export type SlugCheck = { ok: true; slug: string } | { ok: false; reason: 'format' | 'reserved' };

/** Page addresses are used as `<slug>.rasmi.sa`: 3–30 lowercase letters, digits or hyphens. */
export function validateSlug(input: string): SlugCheck {
  const slug = input.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){2,29}$/.test(slug))
    return { ok: false, reason: 'format' };
  if (RESERVED_SLUGS.has(slug)) return { ok: false, reason: 'reserved' };
  return { ok: true, slug };
}

export type WorkspaceContext = { userId: string; workspaceId: string; role: Role };

/** The user's workspace. MVP accounts have exactly one. */
export async function getWorkspaceForUser(
  db: Db,
  userId: string,
): Promise<{ workspace: Workspace; role: Role } | null> {
  const [row] = await db
    .select({ workspace: workspaces, role: memberships.role })
    .from(memberships)
    .innerJoin(workspaces, eq(workspaces.id, memberships.workspaceId))
    .where(eq(memberships.userId, userId))
    .orderBy(memberships.createdAt)
    .limit(1);
  return row ?? null;
}

/** Returns a workspace only if the user is a member of it. */
export async function getWorkspace(
  db: Db,
  userId: string,
  workspaceId: string,
): Promise<{ workspace: Workspace; role: Role } | null> {
  const [row] = await db
    .select({ workspace: workspaces, role: memberships.role })
    .from(memberships)
    .innerJoin(workspaces, eq(workspaces.id, memberships.workspaceId))
    .where(and(eq(memberships.userId, userId), eq(memberships.workspaceId, workspaceId)))
    .limit(1);
  return row ?? null;
}

export type WorkspaceWriteResult =
  | { ok: true; workspace: Workspace }
  | {
      ok: false;
      reason: 'slug_format' | 'slug_reserved' | 'slug_taken' | 'name' | 'exists' | 'forbidden';
    };

type InputCheck =
  | { ok: true; name: string; slug: string }
  | { ok: false; reason: 'name' | 'slug_format' | 'slug_reserved' };

function checkInput(name: string, slugInput: string): InputCheck {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 80) return { ok: false, reason: 'name' };
  const slug = validateSlug(slugInput);
  if (!slug.ok)
    return { ok: false, reason: slug.reason === 'format' ? 'slug_format' : 'slug_reserved' };
  return { ok: true, name: trimmed, slug: slug.slug };
}

export async function createWorkspaceForUser(
  db: Db,
  userId: string,
  input: { name: string; slug: string },
): Promise<WorkspaceWriteResult> {
  const checked = checkInput(input.name, input.slug);
  if (!checked.ok) return checked;
  if (await getWorkspaceForUser(db, userId)) return { ok: false, reason: 'exists' };
  try {
    const workspace = await db.transaction(async (tx) => {
      const [ws] = await tx
        .insert(workspaces)
        .values({ name: checked.name, slug: checked.slug })
        .returning();
      await tx.insert(memberships).values({ workspaceId: ws.id, userId, role: 'owner' });
      return ws;
    });
    return { ok: true, workspace };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, reason: 'slug_taken' };
    throw error;
  }
}

/** Updates a workspace. Only its owner may do this; other users get `forbidden`. */
export async function updateWorkspace(
  db: Db,
  ctx: { userId: string; workspaceId: string },
  input: { name: string; slug: string },
): Promise<WorkspaceWriteResult> {
  const member = await getWorkspace(db, ctx.userId, ctx.workspaceId);
  if (!member || member.role !== 'owner') return { ok: false, reason: 'forbidden' };
  const checked = checkInput(input.name, input.slug);
  if (!checked.ok) return checked;
  try {
    const [workspace] = await db
      .update(workspaces)
      .set({ name: checked.name, slug: checked.slug })
      .where(eq(workspaces.id, ctx.workspaceId))
      .returning();
    return { ok: true, workspace };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, reason: 'slug_taken' };
    throw error;
  }
}
