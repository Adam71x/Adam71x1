import type { Metadata } from 'next';
import { signOutAction } from '@/lib/auth/actions';
import { requireAppContext } from '@/lib/auth/dal';
import { getI18n } from '@/lib/i18n/server';
import { Icon } from '@/components/Icon';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { updateLanguageAction } from './actions';
import { ProfileForm, WorkspaceForm } from './SettingsForms';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.settings.title };
}

export default async function SettingsPage() {
  const { user, workspace, role } = await requireAppContext();
  const { locale, t } = await getI18n();
  return (
    <div className="wrap narrow" style={{ marginInline: 0 }}>
      <div className="ph">
        <div className="t">
          <h1>{t.settings.title}</h1>
          <p className="muted">{t.settings.subtitle}</p>
        </div>
      </div>
      <section className="card stack">
        <h2>{t.settings.profile}</h2>
        <ProfileForm t={t.settings} common={t.common} name={user.name ?? ''} email={user.email} />
      </section>
      <section className="card stack">
        <div className="stack tight">
          <h2>{t.settings.languageTitle}</h2>
          <p className="hint">{t.settings.languageHint}</p>
        </div>
        <div>
          <LanguageSwitch locale={locale} action={updateLanguageAction} label={t.common.language} />
        </div>
      </section>
      <section className="card stack">
        <div className="row spread">
          <h2>{t.settings.workspace}</h2>
          <span className="chip pri">
            {t.settings.role}: {t.settings.roles[role]}
          </span>
        </div>
        <WorkspaceForm
          t={t.settings}
          common={t.common}
          workspaceName={workspace.name}
          slug={workspace.slug}
        />
      </section>
      <form action={signOutAction}>
        <button type="submit" className="btn danger">
          <Icon name="logout" className="flip" />
          {t.settings.signOutAll}
        </button>
      </form>
    </div>
  );
}
