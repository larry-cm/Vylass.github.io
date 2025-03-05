import type { APIRoute } from "astro";
import { db,Users,eq} from "astro:db";
export const GET: APIRoute = async () => {
    
    const data_users = await db.select().from(Users)
    
    return new Response(
        JSON.stringify({
            response:data_users
        })
    )
}

