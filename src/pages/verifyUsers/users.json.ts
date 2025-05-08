import { turso } from "@bd/configTurso"
import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData()
    const user_or_email = data.get('user-or-email')
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
            'Set-Cookie': `usuario=${userName ?? undefined}; Path=/; Max-Age=120; HttpOnly=true`,
            'Content-Type': 'application/json'
        }
    })
}