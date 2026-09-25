import { signOutAction } from '@/lib/auth/actions';
import { requireAppContext } from '@/lib/auth/dal';
import { getI18n } from '@/lib/i18n/server';
import { Icon } from '@/components/Icon';
import { BottomNav, NavLinks, type NavItem } from '@/components/NavLinks';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, workspace } = await requireAppContext();
  const { t } = await getI18n();
  const main: NavItem[] = [
    { href: '/home', label: t.nav.home, icon: 'home' },
    { href: '/portfolio', label: t.nav.portfolio, icon: 'user', soon: true },
    { href: '/pricing', label: t.nav.pricing, icon: 'calc', soon: true },
    { href: '/offers', label: t.nav.offers, icon: 'offer', soon: true },
    { href: '/leads', label: t.nav.leads, icon: 'users', soon: true },
    { href: '/invoices', label: t.nav.invoices, icon: 'receipt', soon: true },
  ];
  const bottom: NavItem[] = [{ href: '/settings', label: t.nav.settings, icon: 'settings' }];
  const displayName = user.name || workspace.name;

  return (
    <div className="shell">
      <aside className="side">
        <div className="side-in">
          <div className="brand">
            <span className="logo">ر</span>
            <div>
              <b>{t.brand.name}</b>
              <small>{t.brand.tagline}</small>
            </div>
          </div>
          <NavLinks items={main} soonLabel={t.common.soon} />
          <span className="sep" />
          <NavLinks items={bottom} soonLabel={t.common.soon} />
          <div className="me">
            <span className="av">{displayName.trim().charAt(0)}</span>
            <div className="grow">
              <div style={{ fontWeight: 600 }}>{displayName}</div>
              <div className="small faint mono">{workspace.slug}.rasmi.sa</div>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="btn ghost sm"
                aria-label={t.nav.signOut}
                title={t.nav.signOut}
              >
                <Icon name="logout" size={16} className="flip" />
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="main">
        <div className="wrap">{children}</div>
      </main>
      <BottomNav items={[main[0], bottom[0]]} label={t.nav.more} />
    </div>
  );
}
