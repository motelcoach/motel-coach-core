import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
    description: z.string().optional(),
    executiveSummary: z
      .string()
      .max(200, "Summary must be concise for AI rendering."),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const collections = { blog, pages };
