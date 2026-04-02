// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sigel.com.br',
  integrations: [
    react(),
    sitemap({
      // Personaliza prioridade e frequência por página
      customPages: [
        'https://sigel.com.br/',
        'https://sigel.com.br/servicos/',
        'https://sigel.com.br/web/',
        'https://sigel.com.br/automacao/',
        'https://sigel.com.br/copywriting/',
        'https://sigel.com.br/planos/',
        'https://sigel.com.br/sobre/',
        'https://sigel.com.br/servicos/hardware/',
      ],
      serialize(item) {
        // Homepage
        if (item.url === 'https://sigel.com.br/') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        // Serviços principais
        if (
          item.url.includes('/web') ||
          item.url.includes('/automacao') ||
          item.url.includes('/copywriting') ||
          item.url === 'https://sigel.com.br/servicos/'
        ) {
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        }
        // Planos e Sobre
        if (item.url.includes('/planos') || item.url.includes('/sobre')) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        // Hardware/manutenção — incluída mas com menor prioridade
        if (item.url.includes('/hardware')) {
          return { ...item, changefreq: 'monthly', priority: 0.6 };
        }
        return { ...item, changefreq: 'monthly', priority: 0.7 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@astrojs/react'],
    },
  },
});