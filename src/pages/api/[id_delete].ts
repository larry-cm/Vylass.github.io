import type { APIRoute } from "astro";
import { db, Users, eq } from "astro:db";

export  const GET : APIRoute = async ({params}) =>{
    const id_delete = params.id_delete;

    await db.delete(Users).where(eq(Users.user_id,Number(id_delete)))

    return new Response(
        JSON.stringify({
            message:'Usuario eliminado 🧺. eliminado de  la base.'
        })
    )
}

export const POST: APIRoute = async ({request,params}) => {
    const id = params.id_delete
    try {
        const data = await request.formData()
        const [name, lastName] = [data.get('new-name'), data.get('new-lastName')]
        await db.update(Users).set({
        user_name: name?.toString(),
        user_last_name:lastName?.toString()
        }).where(eq(Users.user_id, Number(id)))
        
        return new Response(JSON.stringify({
        response: { name: name, lastName: lastName },
        message: 'Usuario actualizado 🔁.'
    }))
    } catch (error) {
        if (error instanceof Error && error.message.includes('UNIQUE')) {
            return new Response(JSON.stringify(
                {
                    response: null,
                    message:'El usuario ya existe en nuestra tabla de registros revíselo.'
                }
            ))
        }
        return new Response(JSON.stringify({
        response: null,
        message: 'Error al actualizar.'
    }))
    }
    
    
    
}