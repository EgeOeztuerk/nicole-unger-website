/**
 * Zentrale Sprach-Konfiguration.
 * Neue Sprache aktivieren: Kürzel hier ergänzen, Texte in ui.ts und Slugs in routes.ts
 * eintragen, Inhalte unter src/content/<collection>/<locale>/ anlegen und die
 * Routen-Dateien unter src/pages/<locale>/ hinzufügen (siehe README).
 */
export const defaultLocale = 'de';
export const locales = ['de'] as const;
/** Für später vorbereitet: ['de', 'en', 'fr'] */

export type Locale = (typeof locales)[number];

export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string; label: string }> = {
  de: { htmlLang: 'de', ogLocale: 'de_DE', label: 'Deutsch' },
};

/** Sprachumschalter erst zeigen, wenn mehr als eine Sprache aktiv ist. */
export const showLanguageSwitcher = locales.length > 1;
