import { onRequest as __wp_content_uploads___path___js_onRequest } from "/home/claude-flow/packages/public-site/functions/wp-content/uploads/[[path]].js"
import { onRequest as ___middleware_js_onRequest } from "/home/claude-flow/packages/public-site/functions/_middleware.js"

export const routes = [
    {
      routePath: "/wp-content/uploads/:path*",
      mountPath: "/wp-content/uploads",
      method: "",
      middlewares: [],
      modules: [__wp_content_uploads___path___js_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]