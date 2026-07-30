import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    executiveSummary: z.string().optional(),
    hideFromBlog: z.boolean().optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    noindex: z.boolean().optional(),
  }),
});

export const collections = { blog, pages };
