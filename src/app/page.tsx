import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/dal';
import { getDb } from '@/lib/db/client';
import { getWorkspaceForUser } from '@/lib/workspaces';

export default async function Index() {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');
  redirect((await getWorkspaceForUser(await getDb(), user.id)) ? '/home' : '/onboarding');
}
