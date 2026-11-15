import { defaultLocale, type Locale } from './config';

/** Lokalisierte URL-Slugs pro Seite. */
export const routes = {
  home: { de: '', en: '', fr: '' },
  acting: { de: 'schauspiel', en: 'acting', fr: 'comedienne' },
  voice: { de: 'sprechen', en: 'voice', fr: 'voix' },
  dramaturgy: { de: 'dramaturgie-lektorat', en: 'script-consulting', fr: 'dramaturgie' },
  stories: { de: 'stories', en: 'stories', fr: 'histoires' },
  about: { de: 'ueber-mich', en: 'about', fr: 'a-propos' },
  thanks: { de: 'kontakt/danke', en: 'contact/thanks', fr: 'contact/merci' },
  imprint: { de: 'impressum', en: 'legal-notice', fr: 'mentions-legales' },
  privacy: { de: 'datenschutz', en: 'privacy', fr: 'confidentialite' },
} satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export function localizePath(key: RouteKey, locale: Locale = defaultLocale, hash?: string): string {
  const slug = routes[key][locale];
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const path = slug ? `${prefix}/${slug}/` : `${prefix}/`;
  return hash ? `${path}#${hash}` : path;
}
