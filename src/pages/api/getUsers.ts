import type { APIRoute } from "astro";
import {turso} from '@bd/configTurso'
export const GET: APIRoute = async () => {
    try {
        const tursoUsers = await turso.execute("SELECT * FROM Users");
        console.log({turso:tursoUsers.rows})
    
    return new Response(
        JSON.stringify({
            response:JSON.stringify(tursoUsers.rows)
        })
    )
    } catch (error) {
        return new Response(JSON.stringify({message:"No users found"}))
    }
    
   
}

