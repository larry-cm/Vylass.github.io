import { turso } from "@bd/configTurso"
import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ request }) => {
    // const data = await request.formData()
    const url = new URL(request.url)
    const user_or_email = url.searchParams.get('user')
    // const user_or_email = data.get('user-or-email')
    let res
    if (user_or_email) {
        // regex para mirar que son
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/
        // función de pedida de datos a la bd con columnas diferentes
        const getRows = async (columnWhere: string) => {
            try {
                const { rows } = await turso.execute({
                    sql: `SELECT user_name FROM users WHERE ${columnWhere} = ?`,
                    args: [user_or_email.valueOf().toString().trim()]
                });
                return {
                    exist: !!rows.length,
                    user: !!rows.length ? rows[0].user_name : null,
                    message: 'No hemos encontrado nada, por favor revisa el nombre de usuario o el correo!'
                }
            }
            catch (error) {
                return { exist: false, message: 'Al parecer tuvimos un error con la conexión a la base de datos, por favor revisa si estas conectado a internet y vuelve a intentarlo!' }
            }
        }
        if (user_or_email.valueOf().toString().match(emailRegex)) res = await getRows('user_email')
        else if (user_or_email.valueOf().toString().match(usernameRegex)) res = await getRows('user_name')
        else res = { exist: false, message: 'No hemos encontrado nada,ese nombre que!' }
    }

    const response = {
        message: "¡Formulario enviado correctamente!",
        body: { ...res },
    }
    const userName = res?.user && res.user.valueOf().toString().trim()
    return new Response(JSON.stringify(response), {
        headers: {
            action: '/',
            'Set-Cookie': `usuario=${userName ?? undefined}; Path=/; Max-Age=120; HttpOnly`,
            'Content-Type': 'application/json'
        }
    })
}
export const POST: APIRoute = async ({ request }) => {
    const { password, userName } = await request.json()
    if (!password && !userName) return new Response(JSON.stringify({ message: "¡El formulario no se lleno completamente!", body: null }))
    const { rows } = await turso.execute({
        sql: 'SELECT * FROM users WHERE user_password = ? and user_name = ?',
        args: [password, userName]
    })
    if (!(!!rows[0]?.length)) return new Response(JSON.stringify({ message: "¡Tu contraseña no es la correcta!", body: false }))
    const headers = new Headers()
    headers.append(
        'Set-Cookie', `usuario=${encodeURIComponent(userName)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; HttpOnly`
    )
    headers.append(
        'Set-Cookie',
        `sesionIniciada=true; Path=/; Max-Age=${60 * 60 * 24 * 7}; HttpOnly`
    );
    headers.set('Content-Type', 'application/json')
    return new Response(JSON.stringify({ message: "¡Formulario enviado correctamente!", body: { res: rows[0] } }), {
        headers
    })
}