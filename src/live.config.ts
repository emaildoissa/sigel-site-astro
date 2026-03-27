import { defineLiveCollection } from 'astro:content';
import { z } from 'astro/zod';

// Minimal live collection to satisfy Astro 6 type generator
export const collections = {
  dummyLive: defineLiveCollection({
    loader: {
      name: 'dummy-live-loader',
      load: async () => ({
        entries: [],
      }),
    },
    schema: z.object({}),
  }),
};
