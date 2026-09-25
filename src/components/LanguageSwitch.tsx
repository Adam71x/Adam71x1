import type { Locale } from '@/lib/i18n/config';

/** Two-button language switch. `action` sets the language and re-renders the page. */
export function LanguageSwitch({
  locale,
  action,
  label,
}: {
  locale: Locale;
  action: (form: FormData) => Promise<void>;
  label: string;
}) {
  return (
    <form action={action} className="seg" role="group" aria-label={label}>
      <button type="submit" name="locale" value="ar" aria-pressed={locale === 'ar'} lang="ar">
        العربية
      </button>
      <button type="submit" name="locale" value="en" aria-pressed={locale === 'en'} lang="en">
        English
      </button>
    </form>
  );
}
