import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
    const headers = new Headers()
    headers.append('Set-Cookie', `usuario=; Path=/; Max-Age=0; HttpOnly`)
    headers.append('Set-Cookie', `sessionIniciada=; Path=/; Max-Age=0; HttpOnly`)
    return new Response(JSON.stringify({
        message: "¡Formulario enviado correctamente!",
        body: null
    }), { headers })
}