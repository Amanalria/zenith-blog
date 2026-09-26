import type { CollectionEntry } from 'astro:content';

/**
 * Returns customSlug if provided in frontmatter, else defaults to post.slug or post.id
 * Guarantees domain/custom-post-slug customizability
 */
export function getPostSlug(post: CollectionEntry<'blog'>): string {
  if (post.data.customSlug && post.data.customSlug.trim() !== '') {
    return post.data.customSlug.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  }
  // @ts-ignore
  const rawId = post.slug || post.id || '';
  return rawId.replace(/\.[^/.]+$/, '').toLowerCase().replace(/^\/+|\/+$/g, '');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit: number = 3
): CollectionEntry<'blog'>[] {
  const currentSlug = getPostSlug(currentPost);
  return allPosts
    .filter((post) => getPostSlug(post) !== currentSlug && !post.data.draft)
    .sort((a, b) => {
      const catMatchA = a.data.category === currentPost.data.category ? 2 : 0;
      const catMatchB = b.data.category === currentPost.data.category ? 2 : 0;
      const tagMatchA = a.data.tags.filter((t) => currentPost.data.tags.includes(t)).length;
      const tagMatchB = b.data.tags.filter((t) => currentPost.data.tags.includes(t)).length;
      return catMatchB + tagMatchB - (catMatchA + tagMatchA);
    })
    .slice(0, limit);
}
