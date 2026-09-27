// Cloudflare Pages Function for Comments API
// Handles:
// 1. GET /api/comments?slug=<slug> -> Returns comments for specific post
// 2. GET /api/comments?recent=5 -> Returns recent 5 comments across ALL posts for homepage/sidebar
// 3. POST /api/comments -> Inserts new comment into D1

interface Env {
  tgmovies_db: D1Database;
  DB?: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.tgmovies_db || context.env.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "Database not bound", comments: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const url = new URL(context.request.url);
  const slug = url.searchParams.get("slug");
  const recentParam = url.searchParams.get("recent");

  try {
    // Mode A: Fetch latest comments across all posts for Homepage / Sidebar
    if (recentParam) {
      const limit = Math.min(Math.max(parseInt(recentParam, 10) || 5, 1), 20);
      const { results } = await db
        .prepare("SELECT id, post_slug, post_title, author_name, content, created_at FROM comments ORDER BY id DESC LIMIT ?")
        .bind(limit)
        .all();

      return new Response(JSON.stringify({ success: true, comments: results || [] }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    }

    // Mode B: Fetch comments for a specific post slug ONLY
    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing slug parameter", comments: [] }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const { results } = await db
      .prepare("SELECT id, author_name, content, created_at FROM comments WHERE post_slug = ? ORDER BY id ASC")
      .bind(slug)
      .all();

    return new Response(JSON.stringify({ success: true, comments: results || [] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, comments: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const db = context.env.tgmovies_db || context.env.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const body: any = await context.request.json();
    const postSlug = (body.postSlug || "").trim();
    const postTitle = (body.postTitle || "").trim();
    const authorName = (body.authorName || "").trim();
    const authorEmail = (body.authorEmail || "").trim();
    const content = (body.content || "").trim();

    if (!postSlug || !authorName || !content) {
      return new Response(JSON.stringify({ error: "Author name and comment content are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    if (content.length > 2000) {
      return new Response(JSON.stringify({ error: "Comment text exceeds length limit" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const result = await db
      .prepare("INSERT INTO comments (post_slug, post_title, author_name, author_email, content) VALUES (?, ?, ?, ?, ?)")
      .bind(postSlug, postTitle, authorName, authorEmail, content)
      .run();

    return new Response(JSON.stringify({ success: true, id: result.meta?.last_row_id }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};
