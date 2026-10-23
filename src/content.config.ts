/**
 * Content Collections – jede Sammlung entspricht einer Sammlung in Decap CMS
 * (public/admin/config.yml). Änderungen an Feldern immer an beiden Stellen vornehmen.
 *
 * Sprachstruktur: src/content/<sammlung>/<locale>/<eintrag>.(md|json)
 * Die Eintrags-ID ist dadurch z. B. "de/home" bzw. "de/mein-film".
 */
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Decap speichert geleerte optionale Felder teils als "" – wie „nicht gesetzt“ behandeln. */
const blankToUndefined = (v: unknown) => (v === '' || v === null ? undefined : v);
const optional = <T extends z.ZodType>(schema: T) => z.preprocess(blankToUndefined, schema.optional());

/** Optionales Bild-Objekt: ohne Bild gilt das ganze Objekt als nicht gesetzt. */
const optionalPicture = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v && typeof v === 'object' && (v as { image?: unknown }).image ? v : undefined), schema.optional());

/** Bild mit Pflicht-Alternativtext (Barrierefreiheit). */
const pictureWith = (image: SchemaContext['image']) =>
  z.object({
    image: image(),
    alt: z.string().min(1, { error: 'Alternativtext ist Pflicht' }),
  });

const routeKey = z.enum(['acting', 'voice', 'dramaturgy', 'stories', 'about']);

const seo = {
  title: z.string(),
  description: z.string().max(200).optional(),
};

const pageGlob = (name: string) => glob({ base: './src/content/pages', pattern: `*/${name}.md` });

/* ---------- Einzelseiten ---------- */

const home = defineCollection({
  loader: pageGlob('home'),
  schema: ({ image }) =>
    z.object({
      ...seo,
      headline: z.string(),
      disciplines: z.array(z.string()).default([]),
      heroImages: z.array(pictureWith(image)).min(1),
      intro: z.string().optional(),
      tiles: z
        .array(
          z.object({
            title: z.string(),
            text: z.string(),
            link: routeKey,
            image: image(),
            alt: z.string().min(1),
          }),
        )
        .min(1)
        .max(4),
    }),
});

const acting = defineCollection({
  loader: pageGlob('schauspiel'),
  schema: ({ image }) =>
    z.object({
      ...seo,
      kicker: z.string().optional(),
      intro: z.string().optional(),
      showreel: z.object({
        heading: z.string(),
        youtubeId: z.string().regex(/^[\w-]{11}$/, { error: 'Bitte nur die 11-stellige YouTube-ID eintragen' }),
        poster: image(),
        posterAlt: z.string().min(1),
      }),
      galleryHeading: z.string(),
      gallery: z.array(pictureWith(image).extend({ caption: z.string().optional() })),
      vitaHeading: z.string(),
      profilesHeading: z.string(),
      booking: z.object({
        heading: z.string(),
        text: z.string(),
        linkLabel: z.string(),
      }),
    }),
});

const voice = defineCollection({
  loader: pageGlob('sprechen'),
  schema: ({ image }) =>
    z.object({
      ...seo,
      kicker: z.string().optional(),
      intro: z.string().optional(),
      image: optionalPicture(pictureWith(image)),
      loungeHeading: z.string(),
      traitsHeading: z.string(),
      traits: z.array(z.object({ label: z.string(), value: z.string() })),
      contact: z.object({
        heading: z.string(),
        text: z.string(),
        emailKey: z.string(),
      }),
    }),
});

const dramaturgy = defineCollection({
  loader: pageGlob('dramaturgie'),
  schema: ({ image }) =>
    z.object({
      ...seo,
      kicker: z.string().optional(),
      lead: z.string(),
      image: optionalPicture(pictureWith(image)),
      languagesNote: z.string().optional(),
      references: z.object({
        label: z.string(),
        items: z.array(z.string()),
      }),
      stationsHeading: z.string(),
      packagesHeading: z.string(),
      packages: z
        .array(
          z.object({
            title: z.string(),
            tagline: z.string(),
            service: z.string(),
            fee: z.string(),
          }),
        )
        .min(1),
      feeNote: z.string(),
      cta: z.object({ text: z.string().optional(), label: z.string() }),
    }),
});

const storiesPage = defineCollection({
  loader: pageGlob('stories'),
  schema: z.object({
    ...seo,
    kicker: z.string().optional(),
    intro: z.string().optional(),
  }),
});

const about = defineCollection({
  loader: pageGlob('ueber-mich'),
  schema: ({ image }) =>
    z.object({
      ...seo,
      kicker: z.string().optional(),
      lead: z.string(),
      portrait: pictureWith(image),
      engagement: z.object({
        heading: z.string(),
        text: z.string().optional(),
        items: z.array(z.string()).default([]),
      }),
      contact: z.object({
        heading: z.string(),
        intro: z.string(),
        formHeading: z.string(),
        mailHeading: z.string(),
      }),
    }),
});

const legal = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '*/{impressum,datenschutz}.md' }),
  schema: z.object({ ...seo }),
});

/* ---------- Listen-Sammlungen ---------- */

const vita = defineCollection({
  loader: glob({ base: './src/content/vita', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['kino', 'tv', 'theater']),
    year: z.number().int().min(1950).max(2100),
    role: z.string().optional(),
    director: z.string().optional(),
    company: z.string().optional(),
  }),
});

const stations = defineCollection({
  loader: glob({ base: './src/content/stations', pattern: '**/*.md' }),
  schema: z.object({
    period: z.string(),
    sortYear: z.number().int(),
    organisation: z.string(),
    activity: z.string(),
  }),
});

const audio = defineCollection({
  loader: glob({ base: './src/content/audio', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['hoerbuch', 'synchron', 'werbung']),
    languages: z.array(z.enum(['de', 'fr', 'en', 'bar'])).min(1),
    file: z.string().regex(/^\/audio\/.+\.(mp3|m4a|wav|ogg)$/i, { error: 'Audiodatei muss unter /audio/ liegen' }),
    description: z.string().optional(),
    order: z.number().default(100),
  }),
});

const stories = defineCollection({
  loader: glob({ base: './src/content/stories', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        kind: z.string(),
        year: z.string().optional(),
        status: z.string().optional(),
        logline: z.string(),
        image: optional(image()),
        alt: z.string().optional(),
        award: z.string().optional(),
        linkLabel: z.string().optional(),
        linkUrl: optional(z.url()),
        order: z.number().default(100),
      })
      .refine((s) => !s.image || (s.alt && s.alt.length > 0), {
        error: 'Wenn ein Bild gesetzt ist, ist ein Alternativtext Pflicht',
        path: ['alt'],
      }),
});

/* ---------- Einstellungen (sprachunabhängig) ---------- */

const settings = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: '*.json' }),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string(),
    agency: z.object({
      name: z.string(),
      url: z.url(),
      email: optional(z.email()),
      phone: z.string().optional(),
    }),
    profiles: z.array(z.object({ label: z.string(), url: z.url() })),
    emails: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        address: z.email(),
      }),
    ),
  }),
});

export const collections = {
  home,
  acting,
  voice,
  dramaturgy,
  storiesPage,
  about,
  legal,
  vita,
  stations,
  audio,
  stories,
  settings,
};
