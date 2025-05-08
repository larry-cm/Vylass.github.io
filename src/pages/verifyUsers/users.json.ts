import { turso } from "@bd/configTurso"
import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request }) => {
    // return new Response('Credenciales inválidas', { status: 401 });
    const data = await request.formData()
    const user_or_email = data.get('user-or-email')
    let res
    if (user_or_email) {
        // regex para mirar que son
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/
        // funcion de pedida de datos a columnas diferentes
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
            } finally {
                // turso.close()
            }
        }
        if (user_or_email.valueOf().toString().match(emailRegex)) {
            // consulta sql
            res = await getRows('user_email')
        }
        else if (user_or_email.valueOf().toString().match(usernameRegex)) {
            res = await getRows('user_name')
        } else {
            res = { exist: false, message: 'No hemos encontrado nada,ese nombre que!' }
        }

    }

    const response = {
        status: 200,
        message: "¡Formulario enviado correctamente!",
        body: { ...res }
    }
    return new Response(JSON.stringify(response))
}