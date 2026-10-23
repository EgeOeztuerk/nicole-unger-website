import { getCollection, getEntry, type CollectionKey } from 'astro:content';
import type { Locale } from '../i18n/config';

/** Lädt eine Einzelseite (z. B. 'home') für die gegebene Sprache. */
export async function getPage<C extends CollectionKey>(collection: C, name: string, locale: Locale) {
  const entry = await getEntry(collection, `${locale}/${name}`);
  if (!entry) throw new Error(`Inhalt fehlt: src/content/pages/${locale}/${name}.md (${collection})`);
  return entry;
}

/** Alle Einträge einer Listen-Sammlung in der gegebenen Sprache. */
export function getLocalized<C extends CollectionKey>(collection: C, locale: Locale) {
  return getCollection(collection, ({ id }) => id.startsWith(`${locale}/`));
}

export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('Einstellungen fehlen: src/content/settings/site.json');
  return entry.data;
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;

export function emailFor(settings: Settings, key: string) {
  return settings.emails.find((e) => e.key === key) ?? settings.emails[0];
}
