import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/dal';
import { getDb } from '@/lib/db/client';
import { getI18n } from '@/lib/i18n/server';
import { getWorkspaceForUser } from '@/lib/workspaces';
import { OnboardingForm } from './OnboardingForm';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.onboarding.title };
}

/** Suggests a page address from the email, e.g. "noura.design@x.com" → "noura-design". */
function suggestSlug(email: string): string {
  const local = email.split('@')[0] ?? '';
  const slug = local
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
  return slug.length >= 3 ? slug : '';
}

export default async function OnboardingPage() {
  const user = await requireUser();
  if (await getWorkspaceForUser(await getDb(), user.id)) redirect('/home');
  const { t } = await getI18n();
  return (
    <main className="center-page">
      <div className="card stack" style={{ width: 'min(480px, 100%)', padding: 24 }}>
        <div className="brand" style={{ padding: 0 }}>
          <span className="logo">ر</span>
          <b>{t.brand.name}</b>
        </div>
        <div className="stack tight">
          <h1>{t.onboarding.title}</h1>
          <p className="muted">{t.onboarding.subtitle}</p>
        </div>
        <OnboardingForm
          t={t.onboarding}
          initial={{
            name: user.name ?? '',
            workspaceName: user.name ?? '',
            slug: suggestSlug(user.email),
          }}
        />
      </div>
    </main>
  );
}
