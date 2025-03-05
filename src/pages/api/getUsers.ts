import type { APIRoute } from "astro";
import {turso} from '@bd/configTurso'
export const GET: APIRoute = async () => {
    
    const tursoUsers = await turso.execute("SELECT * FROM Users");
    console.log({turso:tursoUsers.rows})
    return new Response(
        JSON.stringify({
            response:tursoUsers.rows
        })
    )
}

