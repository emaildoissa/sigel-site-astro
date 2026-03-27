import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dummy = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/dummy" }),
  schema: z.object({}),
});

export const collections = { dummy };
