/**
 * SIGEL INFORMÁTICA — WhatsApp Lead Tracker
 * 
 * Script universal para rastrear a origem exata dos leads (Google Ads, Meta Ads ou Site)
 * e injetar a tag de rastreamento na mensagem pré-preenchida do WhatsApp (wa.me).
 * 
 * Compatível com: Astro, HTML, WordPress, Webflow, Next.js, Landing Pages
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'sigel_lead_source';

  // 1. Extrair parâmetros da URL
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: (params.get('utm_source') || '').trim().toLowerCase(),
      utm_medium: (params.get('utm_medium') || '').trim().toLowerCase(),
      utm_campaign: (params.get('utm_campaign') || '').trim(),
      gclid: params.get('gclid'),
      fbclid: params.get('fbclid'),
      wbraid: params.get('wbraid'),
      gbraid: params.get('gbraid')
    };
  }

  // 2. Determinar a origem do visitante
  function detectSource() {
    const p = getUrlParams();
    const hasAdParams = Boolean(p.gclid || p.gbraid || p.wbraid || p.fbclid || p.utm_source || p.utm_medium);

    // Se NÃO há novos parâmetros de tráfego na URL, reaproveita a origem salva da sessão
    if (!hasAdParams) {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          return saved;
        }
      } catch (e) {}
    }

    let source = 'Site';

    // Google Ads (gclid, gbraid, wbraid ou UTMs explícitas)
    if (p.gclid || p.gbraid || p.wbraid || (p.utm_source.includes('google') && (p.utm_medium.includes('cpc') || p.utm_medium.includes('ads') || p.utm_medium.includes('paid')))) {
      source = 'Google Ads';
    }
    // Meta Ads (Facebook / Instagram Ads com fbclid ou UTMs)
    else if (p.fbclid || ((p.utm_source.includes('meta') || p.utm_source.includes('insta') || p.utm_source.includes('facebook')) && (p.utm_medium.includes('cpc') || p.utm_medium.includes('ads') || p.utm_medium.includes('paid')))) {
      source = 'Meta Ads';
    }
    // Outros anúncios pagos
    else if (p.utm_medium.includes('cpc') || p.utm_medium.includes('ads') || p.utm_medium.includes('paid')) {
      source = p.utm_source ? `Anúncio (${p.utm_source})` : 'Anúncio Pago';
    }
    // Tráfego de busca orgânica
    else if (document.referrer && document.referrer.includes('google.')) {
      source = 'Google Orgânico';
    }
    // Tráfego social orgânico
    else if (document.referrer && (document.referrer.includes('instagram.') || document.referrer.includes('facebook.'))) {
      source = 'Redes Sociais';
    }
    // Tráfego direto no site
    else {
      source = 'Site';
    }

    // Salvar na sessão para manter a atribuição mesmo se navegar por várias páginas
    try {
      sessionStorage.setItem(STORAGE_KEY, source);
    } catch (e) {}

    return source;
  }

  // 3. Atualizar todos os links de WhatsApp na página
  function updateWhatsAppLinks() {
    const origin = detectSource();
    const tag = `[Origem: ${origin}]`;

    // Seleciona links comuns do WhatsApp
    const selectors = [
      'a[href*="wa.me"]',
      'a[href*="api.whatsapp.com"]',
      'a[href*="whatsapp.com/send"]',
      '[data-whatsapp-btn]'
    ];

    const links = document.querySelectorAll(selectors.join(','));

    links.forEach(function (link) {
      try {
        const href = link.getAttribute('href');
        if (!href) return;

        const url = new URL(href, window.location.href);

        // Se for wa.me ou api.whatsapp.com
        let text = url.searchParams.get('text') || '';

        // Se já tiver a tag, não duplicar
        if (text.includes('[Origem:')) {
          return;
        }

        // Se o texto estiver vazio, define um padrão comercial cordial
        if (!text.trim()) {
          text = 'Olá! Gostaria de um orçamento para meu equipamento.';
        }

        // Adicionar a tag no final da mensagem
        url.searchParams.set('text', `${text.trim()} ${tag}`);

        link.setAttribute('href', url.toString());
      } catch (err) {
        // Fallback para hrefs relativos ou strings manuais
        const href = link.getAttribute('href') || '';
        if (href.includes('wa.me') && !href.includes('[Origem:')) {
          const sep = href.includes('?') ? '&' : '?';
          const defaultMsg = encodeURIComponent(`Olá! Gostaria de um orçamento para meu equipamento. ${tag}`);
          link.setAttribute('href', `${href}${sep}text=${defaultMsg}`);
        }
      }
    });
  }

  // 4. Executar quando o DOM carregar e expor API global
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateWhatsAppLinks);
  } else {
    updateWhatsAppLinks();
  }

  // Monitorar alterações dinâmicas (para SPAs como React/Astro com client-side routing)
  window.addEventListener('popstate', updateWhatsAppLinks);

  // Expor utilitário global para uso programático
  window.SigelTracker = {
    getOrigin: detectSource,
    refresh: updateWhatsAppLinks,
    buildWhatsAppUrl: function (phoneNumber, baseMessage) {
      const cleanPhone = (phoneNumber || '').replace(/\\D/g, '');
      const origin = detectSource();
      const msg = `${baseMessage || 'Olá! Gostaria de um orçamento para meu equipamento.'} [Origem: ${origin}]`;
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    }
  };
})();
