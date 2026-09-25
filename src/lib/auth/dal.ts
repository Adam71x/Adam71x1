import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getDb } from '../db/client';
import type { Role, User, Workspace } from '../db/schema';
import { getWorkspaceForUser } from '../workspaces';
import { readSessionToken } from './cookies';
import { validateSessionToken } from './sessions';

/** The signed-in user for this request, or null. Cached per request. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await readSessionToken();
  if (!token) return null;
  return validateSessionToken(await getDb(), token);
});

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');
  return user;
}

export type AppContext = { user: User; workspace: Workspace; role: Role };

/**
 * Every page and action inside the app starts here. It returns the signed-in user and the
 * workspace they belong to; workspace-scoped queries must use `workspace.id` from this context.
 */
export const requireAppContext = cache(async (): Promise<AppContext> => {
  const user = await requireUser();
  const found = await getWorkspaceForUser(await getDb(), user.id);
  if (!found) redirect('/onboarding');
  return { user, workspace: found.workspace, role: found.role };
});
