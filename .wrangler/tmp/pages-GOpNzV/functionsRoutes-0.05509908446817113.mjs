import { onRequestGet as __api_comments_ts_onRequestGet } from "/root/edge-blog/functions/api/comments.ts"
import { onRequestOptions as __api_comments_ts_onRequestOptions } from "/root/edge-blog/functions/api/comments.ts"
import { onRequestPost as __api_comments_ts_onRequestPost } from "/root/edge-blog/functions/api/comments.ts"

export const routes = [
    {
      routePath: "/api/comments",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_comments_ts_onRequestGet],
    },
  {
      routePath: "/api/comments",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_comments_ts_onRequestOptions],
    },
  {
      routePath: "/api/comments",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_comments_ts_onRequestPost],
    },
  ]