import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPostSlug } from '../utils/posts';
import { siteConfig } from '../config/site';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ? site.href.replace(/\/$/, '') : siteConfig.url;
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  const nowIso = new Date().toISOString();

  // 1. Static Root and Compliance Pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0', lastmod: nowIso },
    { url: '/privacy-policy/', changefreq: 'monthly', priority: '0.3', lastmod: '2026-09-26T00:00:00.000Z' },
    { url: '/terms/', changefreq: 'monthly', priority: '0.3', lastmod: '2026-09-26T00:00:00.000Z' },
    { url: '/disclaimer/', changefreq: 'monthly', priority: '0.3', lastmod: '2026-09-26T00:00:00.000Z' },
  ];

  // 2. Active Category Pages
  const categories = siteConfig.categories || [];
  const categoryPages = categories.map((cat) => ({
    url: `/category/${cat.slug}/`,
    changefreq: 'daily',
    priority: '0.8',
    lastmod: nowIso,
  }));

  // 3. Dynamic Auto-Updating Blog Articles with ImageObject Extension
  const postPages = sortedPosts.map((post) => {
    const slug = getPostSlug(post);
    const pubDate = new Date(post.data.pubDate).toISOString();
    const imageUrl = post.data.image
      ? `${siteUrl}${post.data.image.startsWith('/') ? '' : '/'}${post.data.image}`
      : null;

    return {
      url: `/${slug}/`,
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: pubDate,
      image: imageUrl
        ? {
            loc: imageUrl,
            title: post.data.title,
          }
        : null,
    };
  });

  const allUrls = [...staticPages, ...categoryPages, ...postPages];

  const escapeXml = (unsafe: string) =>
    unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${siteUrl}${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>${
      item.image
        ? `
    <image:image>
      <image:loc>${escapeXml(item.image.loc)}</image:loc>
      <image:title>${escapeXml(item.image.title)}</image:title>
    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
      'X-Robots-Tag': 'noindex',
    },
  });
};
