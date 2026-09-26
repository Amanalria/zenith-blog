import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostSlug } from '../utils/posts';
import { siteConfig } from '../config/site';

export async function GET(context: any) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  return rss({
    title: siteConfig.siteTitle,
    description: siteConfig.description,
    site: context.site || siteConfig.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${getPostSlug(post)}/`,
      categories: [post.data.category],
      author: `${siteConfig.email} (${post.data.author || siteConfig.author})`,
    })),
    customData: `<language>${siteConfig.language || 'en'}</language><atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />`,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
}
