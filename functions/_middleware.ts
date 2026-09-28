// Cloudflare Pages Global Middleware
// Features:
// 1. Direct Edge Caching to protect D1 Free Tier read quotas
// 2. Zero Layout Shift (CLS = 0) delivery
// 3. Fallback Dynamic SSR from D1 if a post was created/updated in D1

interface Env {
  tgmovies_db: D1Database;
  DB?: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // 1. Bypass middleware for static assets, scripts, images, and API routes
  if (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/api/') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.json')
  ) {
    return await context.next();
  }

  // 2. Cloudflare Cache API for Instant Edge Response (0ms D1 latency on warm cache)
  const cacheKey = new Request(url.toString(), context.request);
  const cache = (caches as any).default;
  if (cache) {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  // 3. Execute request to static assets
  const response = await context.next();

  // 4. If static asset is found (HTTP 200), apply edge caching and security headers
  if (response.status === 200) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Cache-Control', 'public, max-age=120, s-maxage=86400, stale-while-revalidate=604800');
    newHeaders.set('X-Edge-Source', 'Cloudflare-D1-Unified');
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('X-Frame-Options', 'SAMEORIGIN');

    const edgeResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });

    if (cache && context.request.method === 'GET') {
      context.waitUntil(cache.put(cacheKey, edgeResponse.clone()));
    }

    return edgeResponse;
  }

  // 5. If 404, check if this is an article slug stored in D1 database
  if (response.status === 404 && context.request.method === 'GET') {
    const db = context.env.tgmovies_db || context.env.DB;
    if (db) {
      const cleanSlug = pathname.replace(/^\/+|\/+$/g, '');
      if (cleanSlug && !cleanSlug.includes('/')) {
        try {
          const post: any = await db
            .prepare(
              'SELECT id, slug, title, description, content, category, author, author_role, image, image_alt, tags, read_time, published_at FROM posts WHERE slug = ? LIMIT 1'
            )
            .bind(cleanSlug)
            .first();

          if (post) {
            // Render full dynamic SSR HTML page from D1 data
            const siteUrl = 'https://tgmovies.in';
            const pageUrl = `${siteUrl}/${post.slug}/`;
            const imageUrl = post.image ? `${siteUrl}${post.image.startsWith('/') ? '' : '/'}${post.image}` : `${siteUrl}/images/spiderman-brand-new-day-box-office-mcu-review.webp`;
            
            // Format markdown text into paragraphs
            const paragraphs = post.content
              .split(/\n\s*\n/)
              .filter((p: string) => p.trim().length > 0)
              .map((p: string) => {
                const trimmed = p.trim();
                if (trimmed.startsWith('# ')) {
                  return `<h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">${trimmed.replace(/^#\s+/, '')}</h1>`;
                }
                if (trimmed.startsWith('## ')) {
                  return `<h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3 tracking-tight">${trimmed.replace(/^##\s+/, '')}</h2>`;
                }
                if (trimmed.startsWith('### ')) {
                  return `<h3 class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-2">${trimmed.replace(/^###\s+/, '')}</h3>`;
                }
                return `<p class="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">${trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
              })
              .join('\n');

            const schemaJson = JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.description,
              "image": imageUrl,
              "datePublished": post.published_at,
              "dateModified": post.published_at,
              "author": {
                "@type": "Person",
                "name": post.author || "Aman Alria",
                "jobTitle": post.author_role || "Chief Editor & Film Journalist"
              },
              "publisher": {
                "@type": "Organization",
                "name": "TG Movies",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://tgmovies.in/favicon.svg"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": pageUrl
              }
            });

            const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | TG Movies</title>
  <meta name="description" content="${post.description}">
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${schemaJson}</script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased min-h-screen">
  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-40 backdrop-blur">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="text-xl font-black text-rose-600 tracking-tight">TG MOVIES</a>
      <a href="https://t.me/+ZgCjyUOiBm04NDll" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded transition">Join Telegram</a>
    </div>
  </header>
  <main class="max-w-4xl mx-auto px-4 py-8">
    <span class="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded mb-4">${post.category}</span>
    <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">${post.title}</h1>
    <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
      <span>By <strong class="text-slate-800 dark:text-slate-200">${post.author}</strong></span>
      <span>•</span>
      <span>${post.published_at}</span>
      <span>•</span>
      <span>${post.read_time || '10 min read'}</span>
    </div>
    <div class="mb-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
      <img src="${imageUrl}" alt="${post.image_alt || post.title}" class="w-full h-auto max-h-[480px] object-cover">
    </div>
    <article class="prose dark:prose-invert max-w-none">
      ${paragraphs}
    </article>
    <div class="mt-10 p-4 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between">
      <p class="text-sm font-semibold text-sky-900 dark:text-sky-200">Get instant cinema breaking news & reviews on Telegram!</p>
      <a href="https://t.me/+ZgCjyUOiBm04NDll" target="_blank" rel="noopener noreferrer" class="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded">Join Channel</a>
    </div>
  </main>
  <footer class="border-t border-slate-200 dark:border-slate-800 mt-16 py-8 text-center text-xs text-slate-500">
    <p>© 2026 TG Movies. All rights reserved.</p>
  </footer>
</body>
</html>`;

            const ssrResponse = new Response(html, {
              status: 200,
              headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=120, s-maxage=86400, stale-while-revalidate=604800',
                'X-Edge-Source': 'Cloudflare-D1-Dynamic-SSR',
              },
            });

            if (cache) {
              context.waitUntil(cache.put(cacheKey, ssrResponse.clone()));
            }

            return ssrResponse;
          }
        } catch (dbErr) {
          console.error("D1 SSR Query error:", dbErr);
        }
      }
    }
  }

  return response;
};
