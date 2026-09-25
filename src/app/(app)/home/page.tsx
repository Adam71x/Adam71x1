import type { Metadata } from 'next';
import { requireAppContext } from '@/lib/auth/dal';
import { formatDate, formatHijri, interpolate } from '@/lib/i18n/format';
import { getI18n } from '@/lib/i18n/server';
import { Icon, type IconName } from '@/components/Icon';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.nav.home };
}

export default async function HomePage() {
  const { user, workspace } = await requireAppContext();
  const { locale, t } = await getI18n();
  const now = new Date();
  const firstName = user.name?.trim().split(/\s+/)[0];
  const address = `${workspace.slug}.rasmi.sa`;
  const steps: { icon: IconName; text: string }[] = [
    { icon: 'user', text: interpolate(t.home.steps.portfolio, { address }) },
    { icon: 'calc', text: t.home.steps.pricing },
    { icon: 'offer', text: t.home.steps.offers },
    { icon: 'receipt', text: t.home.steps.invoices },
  ];

  return (
    <>
      <div className="ph">
        <div className="t">
          <h1>
            {firstName ? interpolate(t.home.greeting, { name: firstName }) : t.home.greetingNoName}
          </h1>
          <p className="muted">
            {formatDate(now, locale, 'long')} · {formatHijri(now, locale)}
          </p>
        </div>
      </div>
      <section className="card stack">
        <div className="stack tight">
          <h2>{t.home.setupTitle}</h2>
          <p className="muted">{t.home.setupIntro}</p>
        </div>
        <ul className="steps">
          {steps.map((step) => (
            <li key={step.icon}>
              <span className="step-ic">
                <Icon name={step.icon} />
              </span>
              <span className="grow">{step.text}</span>
              <span className="chip">{t.common.soon}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="card stack tight">
        <span className="lab">{t.home.workspace}</span>
        <strong>{workspace.name}</strong>
        <span className="mono muted">{address}</span>
      </section>
    </>
  );
}
