import { defineCollection, z } from 'astro:content';

// Content-driven via Markdown files, editable from /admin/. Skeleton MVP:
// no styling, minimal copy. Text-only pages carry just a `heading` field.
// Pages with real logic (forms, cart, listings) carry only what that
// logic needs — no filler intro/body copy.

// Note: `slug` is intentionally NOT in any schema below. Astro reserves
// that field and generates it automatically from each entry's filename —
// declaring it manually throws ContentSchemaContainsSlugError. Use
// `entry.slug` at the call site instead of `entry.data.slug`.

const products = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    category: z.enum(['beef', 'goat', 'chicken', 'pork', 'sausages', 'other']),
    pricePerKg: z.number().positive(),
    unit: z.string().default('kg'),
    // `inStock` is a manual admin override (e.g. "pull this off the site
    // right now" without zeroing out the count). `stockQty` is the actual
    // count on hand and is what caps how much a customer can order — a
    // product is only orderable when BOTH inStock is true AND stockQty > 0.
    inStock: z.boolean().default(true),
    stockQty: z.number().int().nonnegative().default(0),
    featured: z.boolean().default(false),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

const home = defineCollection({
  type: 'content',
  schema: z.object({
    heading: z.string(),
  }),
});

// Pure text pages: heading only.
const about = defineCollection({
  type: 'content',
  schema: z.object({ heading: z.string() }),
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

const wholesale = defineCollection({
  type: 'content',
  schema: z.object({ heading: z.string() }),
});

const quote = defineCollection({
  type: 'content',
  schema: z.object({ heading: z.string() }),
});

export const collections = {
  products,
  home,
  about,
  contact,
  certification,
  markets,
  wholesale,
  exportProcess,
  gallery,
  quote,
  legal,
};
