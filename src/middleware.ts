import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { turso } from "./utils/configTurso";

const isProtectedRute = createRouteMatcher([
  '/comunidad(.*)', '/api(.*)'
])

export const onRequest = clerkMiddleware((auth, context, next) => {
  const { userId, redirectToSignIn } = auth()
  const acceptLanguage = context.request.headers.get('Accept-Language')
  const [x] = acceptLanguage?.split(',') || []
  const [lang] = x.split('-')
  context.locals.lang = lang

  if (isProtectedRute(context.request) && !userId) return redirectToSignIn()

  if (context.url.pathname.match('/comunidad')) {
    ; (async () => {
      const result = await turso.execute(`
      SELECT
        user_name,
        user_url,
        post_title,
        post_content,
        post_url,
        post_date
      FROM
        post p,
        users u
      WHERE
        u.user_id = p.user_id
      ORDER BY
        p.post_id DESC
      LIMIT
        10
      `)

      context.locals.posts = result.rows.map((row: any) => (
        {
          username: row.user_name,
          userUrl: row.user_url,
          title: row.post_title,
          content: row.post_content,
          imgUrl: row.post_url,
          postDate: row.post_date
        }
      ))
    })()
    return next()
  }
});