import type { APIRoute } from "astro";
import {turso} from '@bd/configTurso'
export const GET: APIRoute = async () => {
    try {
        const {rows} = await turso.execute("SELECT * FROM Users");
        
    
    return new Response(
        JSON.stringify({
            response:rows
        })
    )
    } catch (error) {
        return new Response(JSON.stringify({message:"No users found"}))
    }
}

