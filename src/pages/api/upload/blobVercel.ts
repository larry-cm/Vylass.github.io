import { put, del, list } from "@vercel/blob";
import type { APIRoute } from "astro";
import { turso } from "@/utils/configTurso";

const token = import.meta.env.SECRET_BLOB_READ_WRITE_TOKEN
const urlDefault = import.meta.env.SECRET_IMG_DEFAULT

export const POST: APIRoute = async ({ request, locals, redirect }) => {
    const { searchParams } = new URL(request.url)
    const { userId, redirectToSignIn } = locals.auth()
    const user = await locals.currentUser()

    if (!user || !userId) return redirectToSignIn()

    let form: FormData
    try {
        form = await request.formData()
    } catch {
        return new Response('No se pudo procesar el formulario.', { status: 400 })
    }

    const userInfoRaw = form.get('userInfo')
    if (!userInfoRaw || typeof userInfoRaw !== 'string') {
        return new Response('Información del usuario inválida.', { status: 400 })
    }

    let title = '', content = ''
    try {
        const parsed = JSON.parse(userInfoRaw)
        title = parsed.title
        content = parsed.content
    } catch {
        return new Response('userInfo no es JSON válido.', { status: 400 })
    }

    const time = new Date().toISOString()
    const file = form.get("fileUp") as Blob | File | null
    const fileName = searchParams.get("filename")
    const isVercelBlob = fileName?.match('vercel-blob-')

    const setData = async (url?: string) => {
        await turso.execute({
            sql: "INSERT INTO post (post_title, post_content, user_id, post_date, post_url) VALUES (?, ?, ?, ?, ?)",
            args: [title, content, userId, time, url || urlDefault]
        })
    }

    if (file && fileName && isVercelBlob) {
        try {
            const { url } = await put(`home/post/${fileName}`, file, {
                access: "public",
                token,
                addRandomSuffix: true,
            })

            await setData(url)
            return redirect('/comunidad');
        } catch (error) {
            return new Response('Error al subir la imagen.', { status: 500 })
        }
    }

    // Caso sin imagen (solo texto)
    await setData()
    return redirect('/comunidad')
}

export const GET: APIRoute = async ({ request, locals, redirect }) => {
    return new Response(JSON.stringify({ message: 'estamos aji' }), { status: 200, headers: { 'ContentType': ' application/json' } })
}