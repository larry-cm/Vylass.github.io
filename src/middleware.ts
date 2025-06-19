import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";


const isProtectedRute = createRouteMatcher([
  '/comunidad(.*)', '/api(.*)'
])

export const onRequest = clerkMiddleware((auth, context, next) => {
  const { userId, redirectToSignIn } = auth()
  const acceptLanguage = context.request.headers.get('Accept-Language')
  const [x] = acceptLanguage?.split(',') || []
  const [lang] = x.split('-')

  if (isProtectedRute(context.request) && !userId) return redirectToSignIn()
  context.locals.lang = lang


})