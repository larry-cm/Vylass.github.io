import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response('hola mi bro', { status: 200 })
}