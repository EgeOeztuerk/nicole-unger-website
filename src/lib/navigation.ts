import type { RouteKey } from '../i18n/routes';

/** Reihenfolge der Hauptnavigation. */
export const mainNav = ['acting', 'voice', 'dramaturgy', 'stories', 'about'] as const satisfies readonly RouteKey[];

export const legalNav = ['imprint', 'privacy'] as const satisfies readonly RouteKey[];
