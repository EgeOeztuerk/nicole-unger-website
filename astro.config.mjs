// @ts-check
import { defineConfig } from 'astro/config';
import { defaultLocale, locales } from './src/i18n/config.ts';

// https://astro.build/config
export default defineConfig({
  // Vorläufige Domain – vor dem Livegang anpassen (auch in src/content/settings/site.json).
  site: 'https://nicoleunger-creative.de',
  trailingSlash: 'ignore',
  compressHTML: true,
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: { prefixDefaultLocale: false },
  },
});
