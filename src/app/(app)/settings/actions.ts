'use server';

import { revalidatePath } from 'next/cache';
import { requireAppContext } from '@/lib/auth/dal';
import { setLocaleCookie } from '@/lib/auth/cookies';
import { getDb } from '@/lib/db/client';
import { isLocale } from '@/lib/i18n/config';
import { getI18n } from '@/lib/i18n/server';
import { updateUser } from '@/lib/users';
import { updateWorkspace } from '@/lib/workspaces';

export type FormState = { ok?: boolean; error?: string };

export async function updateProfileAction(_prev: FormState, form: FormData): Promise<FormState> {
  const { user } = await requireAppContext();
  const name = String(form.get('name') ?? '')
    .trim()
    .slice(0, 80);
  await updateUser(await getDb(), user.id, { name: name || null });
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function updateLanguageAction(form: FormData) {
  const { user } = await requireAppContext();
  const locale = form.get('locale');
  if (!isLocale(locale)) return;
  await updateUser(await getDb(), user.id, { locale });
  await setLocaleCookie(locale);
  revalidatePath('/', 'layout');
}

export async function updateWorkspaceAction(_prev: FormState, form: FormData): Promise<FormState> {
  const { user, workspace } = await requireAppContext();
  const { t } = await getI18n();
  const result = await updateWorkspace(
    await getDb(),
    { userId: user.id, workspaceId: workspace.id },
    { name: String(form.get('workspaceName') ?? ''), slug: String(form.get('slug') ?? '') },
  );
  if (!result.ok) {
    const reason = result.reason === 'exists' ? 'forbidden' : result.reason;
    return { error: t.workspaceErrors[reason] };
  }
  revalidatePath('/', 'layout');
  return { ok: true };
}
