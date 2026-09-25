'use server';

import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/dal';
import { getDb } from '@/lib/db/client';
import { getI18n } from '@/lib/i18n/server';
import { logger } from '@/lib/log';
import { updateUser } from '@/lib/users';
import { createWorkspaceForUser } from '@/lib/workspaces';

export type OnboardingState = {
  error?: string;
  values: { name: string; workspaceName: string; slug: string };
};

export async function createWorkspaceAction(
  _prev: OnboardingState,
  form: FormData,
): Promise<OnboardingState> {
  const user = await requireUser();
  const { t } = await getI18n();
  const values = {
    name: String(form.get('name') ?? '').trim(),
    workspaceName: String(form.get('workspaceName') ?? '').trim(),
    slug: String(form.get('slug') ?? '')
      .trim()
      .toLowerCase(),
  };
  const db = await getDb();
  const result = await createWorkspaceForUser(db, user.id, {
    name: values.workspaceName,
    slug: values.slug,
  });
  if (!result.ok) {
    if (result.reason === 'exists') redirect('/home');
    if (result.reason === 'forbidden') return { values, error: t.workspaceErrors.forbidden };
    return { values, error: t.workspaceErrors[result.reason] };
  }
  if (values.name) await updateUser(db, user.id, { name: values.name.slice(0, 80) });
  logger.info('Workspace created', { userId: user.id, workspaceId: result.workspace.id });
  redirect('/home');
}
