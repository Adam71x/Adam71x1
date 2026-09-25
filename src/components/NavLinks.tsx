'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from './Icon';

export type NavItem = { href: string; label: string; icon: IconName; soon?: boolean };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, soonLabel }: { items: NavItem[]; soonLabel: string }) {
  const pathname = usePathname();
  return items.map((item) =>
    item.soon ? (
      <span key={item.href} className="nav" aria-disabled="true">
        <Icon name={item.icon} />
        <span>{item.label}</span>
        <span className="chip">{soonLabel}</span>
      </span>
    ) : (
      <Link
        key={item.href}
        href={item.href}
        className="nav"
        aria-current={isActive(pathname, item.href) ? 'page' : undefined}
      >
        <Icon name={item.icon} />
        <span>{item.label}</span>
      </Link>
    ),
  );
}

export function BottomNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav className="bnav" aria-label={label}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? 'page' : undefined}
        >
          <Icon name={item.icon} size={20} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
