// Cloudflare Pages Function for Posts API (Direct Cloudflare D1 Database Engine)
// Routes:
// 1. GET /api/posts?slug=<slug> -> Full post detail from D1
// 2. GET /api/posts?category=<cat>&page=<page>&limit=<limit> -> Filtered posts
// 3. GET /api/posts -> Recent posts with pagination metadata

interface Env {
  tgmovies_db: D1Database;
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.tgmovies_db || context.env.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "Cloudflare D1 database not bound", posts: [] }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  }

  const url = new URL(context.request.url);
  const slug = url.searchParams.get("slug");
  const category = url.searchParams.get("category");
  const pageParam = parseInt(url.searchParams.get("page") || "1", 10);
  const page = Math.max(pageParam, 1);
  const limitParam = parseInt(url.searchParams.get("limit") || "10", 10);
  const limit = Math.min(Math.max(limitParam, 1), 50);
  const offset = (page - 1) * limit;

  // Cloudflare Edge Cache check (Preserves D1 free tier read quotas)
  const cacheKey = new Request(url.toString(), context.request);
  const cache = (caches as any).default;
  if (cache) {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  try {
    // Mode A: Single post by slug (Full Content)
    if (slug) {
      const post = await db
        .prepare(
          "SELECT id, slug, title, description, content, category, author, author_role, image, image_alt, tags, read_time, published_at, updated_at FROM posts WHERE slug = ? LIMIT 1"
        )
        .bind(slug)
        .first();

      if (!post) {
        return new Response(JSON.stringify({ error: "Post not found in D1", slug }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=30, s-maxage=60",
          },
        });
      }

      // Fetch related comments count or list
      const comments = await db
        .prepare("SELECT id, author_name, content, created_at FROM comments WHERE post_slug = ? ORDER BY id ASC")
        .bind(slug)
        .all();

      const responsePayload = {
        success: true,
        source: "cloudflare-d1",
        post: {
          ...post,
          tags: typeof post.tags === "string" ? JSON.parse(post.tags || "[]") : post.tags,
          comments: comments.results || [],
        },
      };

      const response = new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
          "X-D1-Source": "tgmovies_db",
        },
      });

      if (cache) {
        context.waitUntil(cache.put(cacheKey, response.clone()));
      }
      return response;
    }

    // Mode B: Posts list (with optional category filter)
    let query = "SELECT id, slug, title, description, category, author, author_role, image, image_alt, tags, read_time, published_at FROM posts";
    let countQuery = "SELECT count(*) as total FROM posts";
    const bindings: any[] = [];
    const countBindings: any[] = [];

    if (category) {
      // Allow slugified category or exact category name
      query += " WHERE LOWER(REPLACE(category, ' ', '-')) = LOWER(?) OR LOWER(category) = LOWER(?)";
      countQuery += " WHERE LOWER(REPLACE(category, ' ', '-')) = LOWER(?) OR LOWER(category) = LOWER(?)";
      bindings.push(category, category);
      countBindings.push(category, category);
    }

    query += " ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?";
    bindings.push(limit, offset);

    const [postsResult, countResult] = await Promise.all([
      db.prepare(query).bind(...bindings).all(),
      db.prepare(countQuery).bind(...countBindings).first<{ total: number }>(),
    ]);

    const total = countResult?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const posts = (postsResult.results || []).map((p: any) => ({
      ...p,
      tags: typeof p.tags === "string" ? JSON.parse(p.tags || "[]") : p.tags,
    }));

    const responsePayload = {
      success: true,
      source: "cloudflare-d1",
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
      posts,
    };

    const response = new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
        "X-D1-Source": "tgmovies_db",
      },
    });

    if (cache) {
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }
    return response;
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to query D1 database" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
