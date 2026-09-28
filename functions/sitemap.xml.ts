// Dynamic Sitemap Generator directly connected to Cloudflare D1
// Automatically lists all posts from D1 database with Google Image tags and high priority

interface Env {
  tgmovies_db: D1Database;
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.tgmovies_db || context.env.DB;
  const siteUrl = "https://tgmovies.in";
  const nowIso = new Date().toISOString();

  // Edge cache check to preserve D1 read quotas
  const cacheKey = new Request("https://tgmovies.in/sitemap.xml", context.request);
  const cache = (caches as any).default;
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // 1. Static and Legal Compliance Pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0', lastmod: nowIso },
    { url: '/about/', changefreq: 'monthly', priority: '0.6', lastmod: nowIso },
    { url: '/contact/', changefreq: 'monthly', priority: '0.6', lastmod: nowIso },
    { url: '/privacy-policy/', changefreq: 'monthly', priority: '0.4', lastmod: nowIso },
    { url: '/cookie-consent/', changefreq: 'monthly', priority: '0.4', lastmod: nowIso },
    { url: '/terms/', changefreq: 'monthly', priority: '0.4', lastmod: nowIso },
    { url: '/disclaimer/', changefreq: 'monthly', priority: '0.4', lastmod: nowIso },
  ];

  // 2. Category Hub Pages
  const categorySlugs = [
    "bollywood",
    "hollywood",
    "south-cinema",
    "ott-web-series",
    "movie-reviews",
    "cinema-news"
  ];
  const categoryPages = categorySlugs.map((slug) => ({
    url: `/category/${slug}/`,
    changefreq: 'daily',
    priority: '0.8',
    lastmod: nowIso,
  }));

  // 3. Dynamic Posts from Cloudflare D1
  let postPages: any[] = [];
  if (db) {
    try {
      const { results } = await db
        .prepare("SELECT slug, title, image, image_alt, published_at, updated_at FROM posts ORDER BY published_at DESC")
        .all();

      if (results && results.length > 0) {
        postPages = results.map((post: any) => {
          const dateStr = post.updated_at || post.published_at || nowIso;
          const pubDate = new Date(dateStr).toISOString();
          const imageUrl = post.image
            ? `${siteUrl}${post.image.startsWith('/') ? '' : '/'}${post.image}`
            : null;

          return {
            url: `/${post.slug}/`,
            changefreq: 'weekly',
            priority: '0.9',
            lastmod: pubDate,
            image: imageUrl
              ? {
                  loc: imageUrl,
                  title: post.title || post.image_alt || "Movie Article",
                }
              : null,
          };
        });
      }
    } catch (e) {
      console.error("D1 Sitemap Query Error:", e);
    }
  }

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

  const response = new Response(xml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
      'X-D1-Sitemap': 'true',
    },
  });

  if (cache) {
    context.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
};
