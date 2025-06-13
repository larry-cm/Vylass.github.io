import { put, del, list } from "@vercel/blob";
const token = import.meta.env.BLOB_READ_WRITE_TOKEN
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get("filename")
    const { userId } = locals.auth()

    if (!userId || !request.body || !fileName?.match('vercel-blob-')) {
        return new Response('Unauthorized', { status: 401 })
    }

    const blob = await put(`home/${fileName}`, request.body, {
        access: "public",
        token,
        addRandomSuffix: true,
    });
    return Response.json(blob);
};

export const GET: APIRoute = async ({ locals }) => {
    const { userId } = locals.auth()
    if (!userId) {
        return new Response('Unauthorized', { status: 401 })
    }
    return new Response('Que quieres? jsj', { status: 200 })

}