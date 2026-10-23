import { defaultLocale, type Locale } from './config';

/**
 * Lokalisierte URL-Slugs pro Seite. Für EN/FR später je einen Eintrag ergänzen,
 * z. B. acting: { de: 'schauspiel', en: 'acting', fr: 'comedienne' }.
 */
export const routes = {
  home: { de: '' },
  acting: { de: 'schauspiel' },
  voice: { de: 'sprechen' },
  dramaturgy: { de: 'dramaturgie-lektorat' },
  stories: { de: 'stories' },
  about: { de: 'ueber-mich' },
  thanks: { de: 'kontakt/danke' },
  imprint: { de: 'impressum' },
  privacy: { de: 'datenschutz' },
} satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export function localizePath(key: RouteKey, locale: Locale = defaultLocale, hash?: string): string {
  const slug = routes[key][locale];
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const path = slug ? `${prefix}/${slug}/` : `${prefix}/`;
  return hash ? `${path}#${hash}` : path;
}
