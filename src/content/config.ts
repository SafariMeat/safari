import { defineCollection, z } from 'astro:content';

// Content-driven via Markdown files, editable from /admin/. Skeleton MVP:
// no styling, minimal copy. Text-only pages carry just a `heading` field.
// Pages with real logic (forms, cart, listings) carry only what that
// logic needs — no filler intro/body copy.

// Note: `slug` is intentionally NOT in any schema below. Astro reserves
// that field and generates it automatically from each entry's filename —
// declaring it manually throws ContentSchemaContainsSlugError. Use
// `entry.slug` at the call site instead of `entry.data.slug`.

// Safari Meat sells a single product: whole baby goat carcasses. There is
// no multi-item catalog, so this is a singleton "spec sheet" rather than a
// browsable/priced collection — no pricePerKg, stockQty, or cart fields.
const product = defineCollection({
  type: 'content',
  schema: z.object({
    heading: z.string(),
    name: z.string(),
    weightMinKg: z.number().positive(),
    weightMaxKg: z.number().positive(),
    form: z.string(),
    processing: z.string(),
    packagingOptions: z.array(z.string()),
    image: z.string().optional(),
    description: z.string().optional(),
  }),
});

const home = defineCollection({
  type: 'content',
  schema: z.object({
    heading: z.string(),

    heroEyebrow: z.string(),
    heroHeadingLine1: z.string(),
    heroHeadingLine2: z.string(),
    heroDescription: z.string(),
    heroCtaPrimaryLabel: z.string(),
    heroCtaSecondaryLabel: z.string(),
    heroCtaWhatsappLabel: z.string(),
    heroLedger: z.array(
      z.object({
        number: z.string(),
        category: z.string(),
        value: z.string(),
      })
    ),

    tickerRow1: z.array(z.string()),
    tickerRow2: z.array(z.string()),

    productsEyebrow: z.string(),
    productsHeadingLine1: z.string(),
    productsHeadingLine2: z.string(),
    productsDescription: z.string(),
    productsCtaLabel: z.string(),

    whySupplyEyebrow: z.string(),
    whySupplyHeadingLine1: z.string(),
    whySupplyHeadingLine2: z.string(),
    whySupplyCards: z.array(
      z.object({
        code: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),

    ctaEyebrow: z.string(),
    ctaHeading: z.string(),
    ctaDescription: z.string(),
    ctaPrimaryLabel: z.string(),
    ctaSecondaryLabel: z.string(),
  }),
});


// Pure text pages: heading only.
const about = defineCollection({
  type: 'content',
  schema: z.object({
    heading: z.string(),
    tagline: z.string(),
    heroDescription: z.string(),
    whoWeAreTitle: z.string(),
    whoWeAreDescription: z.string(),
    whoWeArePoints: z.array(z.string()),
    missionTitle: z.string(),
    missionDescription: z.string(),
    whyWorkWithUsTitle: z.string(),
    whyWorkWithUs: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    qualityCommitmentTitle: z.string(),
    qualityCommitmentDescription: z.string(),
    exportReadinessTitle: z.string(),
    exportReadinessDescription: z.string(),
    exportReadinessPoints: z.array(z.string()),
  }),
});

const certification = defineCollection({
  type: 'content',
  schema: z.object({ heading: z.string() }),
});

const markets = defineCollection({
  type: 'content',
  schema: z.object({ heading: z.string() }),
});

const exportProcess = defineCollection({
  type: 'content',
  schema: z.object({ heading: z.string() }),
});

const gallery = defineCollection({
  type: 'content',
  schema: z.object({ heading: z.string() }),
});

const legal = defineCollection({
  type: 'content',
  schema: z.object({ heading: z.string() }),
});

// Logic pages: heading + whatever data the logic on that page needs.

const contact = defineCollection({
  type: 'content',
  schema: z.object({
    heading: z.string(),
    phone: z.string(),
    whatsapp: z.string(),
    email: z.string(),
    address: z.string(),
    hours: z.string(),
  }),
});

const quote = defineCollection({
  type: 'content',
  schema: z.object({ heading: z.string() }),
});

export const collections = {
  product,
  home,
  about,
  contact,
  certification,
  markets,
  exportProcess,
  gallery,
  quote,
  legal,
};
