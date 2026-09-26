import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

const getRobotsTxt = (siteUrl: string) => `
# TG Movies Production Robots.txt
# Optimized for Google Search, Google News, Bing, and AI Assistants

User-agent: *
Allow: /

# Dedicated Search Engine Crawlers
User-agent: Googlebot
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

# AI Crawlers & LLM Indexers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Sitemaps and Feeds
Sitemap: ${siteUrl}/sitemap-index.xml
Sitemap: ${siteUrl}/rss.xml
`;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.href.replace(/\/$/, '') : siteConfig.url;
  return new Response(getRobotsTxt(siteUrl).trim(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
