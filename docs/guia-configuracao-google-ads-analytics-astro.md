# Guia Definitivo: Configuração do Google Ads, GA4 e Rastreamento de Leads no Astro

Este documento serve como referência técnica para evitar perda de tempo em futuros projetos Astro ao configurar **Google Analytics 4 (GA4)**, **Google Ads Conversion Tracking** e rastreamento de cliques no **WhatsApp/Telefone**.

---

## 🛑 1. O Maior Erro: Conflito com Partytown (`@astrojs/partytown`)

### O Problema:
Ao usar o plugin `@astrojs/partytown` para tentar otimizar performance carregando o `gtag.js` em um *Web Worker*:
1. O **Google Tag Assistant** (extensão e web debug) não consegue enxergar a tag e relata: `"Nenhuma tag foi encontrada no site"`.
2. As chamadas `gtag('event', 'conversion', ...)` falham no console com o erro:  
   `TypeError: Cannot read properties of undefined (reading 'apply') at partytown-sandbox-sw.html`
3. O Service Worker do Partytown tenta interceptar `window.gtag`, mas como a tag roda isolada no worker, a execução no thread principal é cancelada.

### A Solução:
**NÃO USE Partytown para tags de rastreamento do Google Ads/GA4.** As tags oficiais (`gtag.js`) são leves e devem rodar nativamente no thread principal do navegador.

1. **Remova o Partytown do `astro.config.mjs`:**
   ```javascript
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import sitemap from '@astrojs/sitemap';
   import tailwindcss from '@tailwindcss/vite';

   export default defineConfig({
     site: 'https://seusite.com.br',
     integrations: [sitemap()],
     vite: { plugins: [tailwindcss()] }
   });
   ```
2. **Carregue as tags nativamente com `<script is:inline>`** no `<head>` do layout principal (`Base.astro`).

---

## 🛡️ 2. Bloqueio por Política de Segurança de Conteúdo (CSP)

### O Problema:
Servidores ou proxies (Hostgator, Apache, Cloudflare, Nginx) podem bloquear scripts e conexões externas se houver um cabeçalho `Content-Security-Policy` ativo.

### A Solução:
Adicione os arquivos de configuração na pasta `public/` do projeto Astro liberando os domínios do Google:

#### A) `public/_headers` (para Cloudflare Pages / Netlify / Vercel):
```http
/*
  Content-Security-Policy: default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://tagassistant.google.com; connect-src 'self' https: wss: https://www.google-analytics.com https://stats.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://analytics.google.com https://region1.google-analytics.com https://tagassistant.google.com; img-src 'self' data: blob: https: https://www.google-analytics.com https://stats.g.doubleclick.net https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://tagassistant.google.com; frame-src 'self' https: https://www.google.com https://td.doubleclick.net https://tagassistant.google.com;
```

#### B) `public/.htaccess` (para Apache / Hostgator / cPanel):
```apache
<IfModule mod_headers.c>
  Header set Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://tagassistant.google.com; connect-src 'self' https: wss: https://www.google-analytics.com https://stats.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://analytics.google.com https://region1.google-analytics.com https://tagassistant.google.com; img-src 'self' data: blob: https: https://www.google-analytics.com https://stats.g.doubleclick.net https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://tagassistant.google.com; frame-src 'self' https: https://www.google.com https://td.doubleclick.net https://tagassistant.google.com;"
</IfModule>
```

---

## 🎯 3. Estrutura de Conversões Recomendada no Google Ads

1. **Crie apenas UMA Ação de Conversão Geral:**
   - Nome: **"Contato - Lead WhatsApp"**
   - Tipo: **Clique** (para links de WhatsApp e telefone)
   - Motivo: A IA do Google Ads (*Smart Bidding*) acumula o aprendizado em um único local, otimizando os lances muito mais rápido.
2. **Atribuição Automática por Campanha:**
   - Não crie 1 conversão para cada serviço (ex: *Conversão Tela*, *Conversão Teclado*).
   - O Google Ads usa o parâmetro invisível `gclid` para atribuir a conversão automaticamente à campanha, anúncio e palavra-chave que gerou o clique.

---

## 💻 4. Código Padrão de Rastreamento em `Base.astro`

Insira o bloco abaixo dentro do `<head>` no seu layout principal:

```astro
<!-- Google tag (gtag.js) -->
<script is:inline async src="https://www.googletagmanager.com/gtag/js?id=AW-SEU_GOOGLE_ADS_ID"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());

  // Configuração GA4 e Google Ads
  gtag('config', 'G-SEU_GA4_ID');
  gtag('config', 'AW-SEU_GOOGLE_ADS_ID');

  // Função padrão fornecida pelo Google Ads
  function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined' && url) {
        window.location = url;
      }
    };
    gtag('event', 'conversion', {
        'send_to': 'AW-SEU_GOOGLE_ADS_ID/SEU_ROTULO_CONVERSAO',
        'value': 1.0,
        'currency': 'BRL',
        'event_callback': callback
    });
    return false;
  }
  window.gtag_report_conversion = gtag_report_conversion;

  // Rastreador global de Leads (WhatsApp e Telefone)
  window.trackLeadConversion = function(channel, details) {
    try {
      window.dataLayer.push({
        event: 'lead_conversion',
        conversion_channel: channel || 'whatsapp',
        conversion_details: details || window.location.pathname
      });

      gtag('event', 'generate_lead', {
        event_category: 'contact',
        event_label: channel || 'whatsapp',
        page_path: window.location.pathname
      });

      gtag_report_conversion();
    } catch (err) {
      console.debug('Conversion tracking notice:', err);
    }
  };

  // Event Listener global em cliques de WhatsApp e Telefone
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      const href = target.getAttribute('href') || '';
      if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        window.trackLeadConversion('whatsapp', href);
      } else if (href.startsWith('tel:')) {
        window.trackLeadConversion('phone_call', href);
      }
    });
  });
</script>
```

---

## 📋 5. Checklist de Validação Rápida

- [ ] Partytown removido do `astro.config.mjs`.
- [ ] Tags carregadas com `<script is:inline>`.
- [ ] Arquivos `.htaccess` e `_headers` criados na pasta `public/`.
- [ ] Deploy realizado para o servidor de produção.
- [ ] Teste no **Google Tag Assistant**:
  1. Conectar ao site.
  2. Clicar no botão do WhatsApp.
  3. Verificar na aba do Tag Assistant se o evento `conversion` foi disparado com status verde (`200 OK`).
