import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostSlug } from '../utils/posts';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  return rss({
    title: 'Zenith Edge Journal',
    description: 'High performance edge architectures, static web optimization, and modern systems engineering.',
    site: context.site || 'https://example.com',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Uses customSlug or default post slug, matching domain/post-slug URL format
      link: `/${getPostSlug(post)}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
