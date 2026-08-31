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

export const collections = { greek };
import { defineCollection, z } from 'astro:content';
