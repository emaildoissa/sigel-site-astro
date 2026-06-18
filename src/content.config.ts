import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().max(65, "Título muito longo para SEO"),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Equipe Sigel'),
    image: z.string().optional(),
    keyTakeaways: z.array(z.string()).optional(),
    category: z.enum(["web", "hardware", "automacao", "copywriting", "negocios"]).optional(),
    readingTime: z.number().optional(),
  }),
});

export const collections = { blog };
