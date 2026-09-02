import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  
  const hardwareSlugs = [
    "troca-de-tela",
    "formatacao-pc",
    "troca-de-teclado",
    "upgrade-ssd",
    "manutencao-notebook",
    "assistencia-tecnica",
    "recuperacao-dados",
    "reparo-carcaca"
  ];

  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "servicos", priority: "0.9", changefreq: "weekly" },
    { url: "web", priority: "0.9", changefreq: "weekly" },
    { url: "automacao", priority: "0.9", changefreq: "weekly" },
    { url: "copywriting", priority: "0.9", changefreq: "weekly" },
    { url: "planos", priority: "0.8", changefreq: "monthly" },
    { url: "sobre", priority: "0.8", changefreq: "monthly" },
    { url: "contato", priority: "0.8", changefreq: "monthly" },
    { url: "onde-estamos", priority: "0.9", changefreq: "weekly" },
    { url: "contratos", priority: "0.9", changefreq: "monthly" },
    { url: "locais/porto-alegre", priority: "0.8", changefreq: "monthly" },
    { url: "servicos/hardware", priority: "0.9", changefreq: "weekly" },
    { url: "blog", priority: "0.8", changefreq: "monthly" },
  ];

  const hardwarePages = hardwareSlugs.map(slug => ({
    url: `servicos/hardware/${slug}`,
    priority: "0.9",
    changefreq: "weekly"
  }));

  const blogPages = posts.map(post => ({
    url: `blog/${post.id}`,
    priority: "0.8",
    changefreq: "monthly"
  }));

  const allPages = [...staticPages, ...hardwarePages, ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>https://sigelinformatica.com.br/${page.url}${page.url ? '/' : ''}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
