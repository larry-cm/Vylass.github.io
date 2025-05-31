import { turso } from "@bd/configTurso"
import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url)
    const user_or_email = url.searchParams.get('user')
    let res
    if (user_or_email) {
        // regex para mirar que son
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const usernameRegex = /^[a-zA-Z0-9\s]{7,26}$/
        // función de pedida de datos a la bd con columnas diferentes
        const getRows = async (columnWhere: string) => {
            try {
                const { rows } = await turso.execute({
                    sql: `SELECT user_name,user_register FROM users WHERE ${columnWhere} = ?;`,
                    args: [user_or_email.valueOf().toString().trim()]
                });
                return {
                    exist: !!rows.length,
                    user: !!rows.length ? rows[0].user_name : null,
                    message: 'No hemos encontrado nada, por favor revisa el nombre de usuario o el correo. Si no tienes una cuenta, te vamos a redirigir para crear una.'
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
    const headers = new Headers()
    headers.append(
        'Set-Cookie', `usuario=${userName && encodeURIComponent(userName)}; Path=/; Max-Age=${60 * 2}; HttpOnly`
    )
    headers.append(
        'Set-Cookie', `sessionIniciada=false; Path=/; HttpOnly;`
    )
    return new Response(JSON.stringify(response), { headers })
}

export const POST: APIRoute = async ({ request }) => {
    const { password, userName } = await request.json()
    const cookieHeader = request.headers.get('cookie')
    const cookies = Object.fromEntries(cookieHeader?.split('; ').map(c => c.split('=')) ?? []);
    const headers = new Headers()

    const { rows } = await turso.execute({
        sql: 'SELECT * FROM users WHERE user_password = ? and user_name = ?',
        args: [password, userName]
    })

    if (!password || !cookies?.usuario) return new Response(JSON.stringify({
        message: "La sesión ha caducado o faltan datos requeridos. Por favor, vuelve a iniciar sesión para continuar.", body: null
    }
    ));

    if (!(!!rows[0]?.length)) return new Response(JSON.stringify({
        message: "¡Tu contraseña no es la correcta!",
        body: false
    }
    ))

    headers.append(
        'Set-Cookie',
        `usuario=${encodeURIComponent(userName)}; Path=/; HttpOnly;`
    )
    headers.append(
        'Set-Cookie',
        `sessionIniciada=true; Path=/; HttpOnly`
    );
    headers.append(
        'Set-Cookie',
        `imagenUsuario=${encodeURIComponent(rows[0].user_img?.toString() ?? '')}; Path=/; HttpOnly;`
    );
    headers.set('Content-Type', 'application/json')

    return new Response(JSON.stringify({
        message: "¡Formulario enviado correctamente!",
        body: { res: rows[0] }
    }),
        { headers }
    )
}