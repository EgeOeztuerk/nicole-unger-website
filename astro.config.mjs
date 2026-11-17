// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { defaultLocale, locales } from './src/i18n/config.ts';

/** Seiten ohne Suchmaschinen-Nutzen (Danke-Seiten, 404) nicht in die Sitemap. */
const excluded = /\/(kontakt\/danke|contact\/thanks|contact\/merci|404)\/?$/;

// https://astro.build/config
export default defineConfig({
  site: 'https://nicoleunger.com',
  trailingSlash: 'ignore',
  compressHTML: true,
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !excluded.test(page),
    }),
  ],
});
