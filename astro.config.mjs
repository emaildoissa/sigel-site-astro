// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://sigelinformatica.com.br',
  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
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
        'https://sigelinformatica.com.br/contratos/',
      ],
      serialize(item) {
        // Homepage
        if (item.url === 'https://sigelinformatica.com.br/') {
          return { ...item, changefreq: /** @type {any} */ ('weekly'), priority: 1.0 };
        }
        // Serviços principais
        if (
          item.url.includes('/web') ||
          item.url.includes('/automacao') ||
          item.url.includes('/copywriting') ||
          item.url === 'https://sigelinformatica.com.br/servicos/'
        ) {
          return { ...item, changefreq: /** @type {any} */ ('monthly'), priority: 0.9 };
        }
        // Planos e Sobre
        if (item.url.includes('/planos') || item.url.includes('/sobre')) {
          return { ...item, changefreq: /** @type {any} */ ('monthly'), priority: 0.8 };
        }
        // Contratos — página de assinatura B2B
        if (item.url.includes('/contratos')) {
          return { ...item, changefreq: /** @type {any} */ ('monthly'), priority: 0.9 };
        }
        // Hardware/manutenção — incluída mas com menor prioridade
        if (item.url.includes('/hardware')) {
          return { ...item, changefreq: /** @type {any} */ ('monthly'), priority: 0.6 };
        }
        return { ...item, changefreq: /** @type {any} */ ('monthly'), priority: 0.7 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});