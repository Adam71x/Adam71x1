import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { setLocaleAction } from '@/lib/auth/actions';
import { getCurrentUser } from '@/lib/auth/dal';
import { getI18n } from '@/lib/i18n/server';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { SignInForm } from './SignInForm';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.signIn.title };
}

export default async function SignInPage() {
  if (await getCurrentUser()) redirect('/');
  const { locale, t } = await getI18n();
  return (
    <main className="auth">
      <section className="auth-brand">
        <div className="brand" style={{ padding: 0 }}>
          <span className="logo">ر</span>
          <b>{t.brand.name}</b>
        </div>
        <div className="stack">
          <h1>{t.signIn.headline}</h1>
          <p style={{ opacity: 0.85, maxWidth: '46ch' }}>{t.signIn.pitch}</p>
        </div>
        <span />
        <span className="sadu" aria-hidden="true" />
      </section>
      <section className="auth-form">
        <div className="auth-lang">
          <LanguageSwitch locale={locale} action={setLocaleAction} label={t.common.language} />
        </div>
        <SignInForm key={locale} t={t.signIn} />
      </section>
    </main>
  );
}
