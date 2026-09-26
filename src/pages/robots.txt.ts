import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

const getRobotsTxt = (siteUrl: string) => `
# ==============================================================================
# TG Movies Production Robots.txt
# Optimized for Google Search, Google News, Bing, Apple, and AI Retrieval Models
# ==============================================================================

User-agent: *
Allow: /
Disallow: /api/
Disallow: /_astro/

# Search Engine Specific Directives
User-agent: Googlebot
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Googlebot-Image
Allow: /images/
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: YandexBot
Allow: /

User-agent: Baiduspider
Allow: /

# Multimodal AI & LLM Search Retrieval Crawlers (SearchGPT, ChatGPT, Claude, Perplexity)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

# Canonical Sitemaps and Syndication Feeds
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-index.xml
Sitemap: ${siteUrl}/rss.xml
`;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.href.replace(/\/$/, '') : siteConfig.url;
  return new Response(getRobotsTxt(siteUrl).trim(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
};
