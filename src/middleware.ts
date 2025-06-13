import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
const isProtectedRute = createRouteMatcher([
  '/comunidad(.*)',
])
export const onRequest = clerkMiddleware((auth, context) => {
  const { userId, redirectToSignIn } = auth()

  if (isProtectedRute(context.request) && !userId) return redirectToSignIn()
});