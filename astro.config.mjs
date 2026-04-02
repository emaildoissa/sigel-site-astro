// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sigelinformatica.com.br',
  integrations: [
    react(),
    sitemap({
      // Personaliza prioridade e frequência por página
      customPages: [
        'https://sigelinformatica.com.br/',
        'https://sigelinformatica.com.br/servicos/',
        'https://sigelinformatica.com.br/web/',
        'https://sigelinformatica.com.br/automacao/',
        'https://sigelinformatica.com.br/copywriting/',
        'https://sigelinformatica.com.br/planos/',
        'https://sigelinformatica.com.br/sobre/',
        'https://sigelinformatica.com.br/servicos/hardware/',
      ],
      serialize(item) {
        // Homepage
        if (item.url === 'https://sigelinformatica.com.br/') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        // Serviços principais
        if (
          item.url.includes('/web') ||
          item.url.includes('/automacao') ||
          item.url.includes('/copywriting') ||
          item.url === 'https://sigelinformatica.com.br/servicos/'
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