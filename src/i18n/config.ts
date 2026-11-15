/**
 * Zentrale Sprach-Konfiguration.
 * Weitere Sprache aktivieren: Kürzel hier ergänzen, Texte in ui.ts und Slugs in routes.ts
 * eintragen und Inhalte unter src/content/pages/<locale>/ anlegen (siehe README).
 * Die Seiten für alle Nicht-Standard-Sprachen erzeugt src/pages/[lang]/[...slug].astro.
 */
export const defaultLocale = 'de';
export const locales = ['de', 'en', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string; label: string; short: string }> = {
  de: { htmlLang: 'de', ogLocale: 'de_DE', label: 'Deutsch', short: 'DE' },
  en: { htmlLang: 'en', ogLocale: 'en_GB', label: 'English', short: 'EN' },
  fr: { htmlLang: 'fr', ogLocale: 'fr_FR', label: 'Français', short: 'FR' },
};

/** Sprachumschalter nur zeigen, wenn mehr als eine Sprache aktiv ist. */
export const showLanguageSwitcher = locales.length > 1;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
