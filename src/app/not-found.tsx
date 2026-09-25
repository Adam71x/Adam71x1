import Link from 'next/link';
import { getI18n } from '@/lib/i18n/server';

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <main className="center-page">
      <div className="card stack" style={{ width: 'min(460px, 100%)' }}>
        <h1>{t.errors.notFoundTitle}</h1>
        <p className="muted">{t.errors.notFoundBody}</p>
        <div>
          <Link href="/" className="btn pri">
            {t.errors.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
