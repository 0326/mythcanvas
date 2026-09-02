import { defineCollection, z } from 'astro:content';

/**
 * Editorial TypeScript modules live next to future collection content. Defining
 * the configuration explicitly prevents Astro from treating implementation
 * modules as an implicit Markdown collection.
 */
const greek = defineCollection({
  schema: z.object({
    title: z.string(),
    internal: z.literal(true),
  }),
});

const norse = defineCollection({
  schema: z.object({
    title: z.string(),
    internal: z.literal(true),
  }),
});

const egyptian = defineCollection({
  schema: z.object({
    title: z.string(),
    internal: z.literal(true),
  }),
});

const japanese = defineCollection({
  schema: z.object({
    title: z.string(),
    internal: z.literal(true),
  }),
});

const maya = defineCollection({
  schema: z.object({
    title: z.string(),
    internal: z.literal(true),
  }),
});

const celtic = defineCollection({
  schema: z.object({
    title: z.string(),
    internal: z.literal(true),
  }),
});

const aztec = defineCollection({
  schema: z.object({
    title: z.string(),
    internal: z.literal(true),
  }),
});

const mesopotamian = defineCollection({
  schema: z.object({
    title: z.string(),
    internal: z.literal(true),
  }),
});

export const collections = { greek, norse, egyptian, japanese, maya, celtic, aztec, mesopotamian };
