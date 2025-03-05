import type { APIRoute } from "astro";
import { db,Users} from "astro:db";
export const POST: APIRoute = async ({ request }) => {

  const data = await request.formData()

  const [name, lastName] = [data.get('nombre'), data.get('apellido')]
  
  if (!name || !lastName ||
    name.valueOf().toLocaleString().length < 5 || lastName.valueOf().toLocaleString().length < 5 ||
    name.valueOf().toLocaleString().includes(' ') || lastName.valueOf().toLocaleString().includes(' ') ){
    return new Response(JSON.stringify({
      message: "¡Error de formato en el formulario!"
    })
    )
  }
  try {
    await db.insert(Users).values({
      user_name: name.toString().trim(),
      user_last_name: lastName.toString().trim(),
      user_date: new Date(),
    })
    return new Response(JSON.stringify({
      message: "¡Guardaste tus datos Wapeton!"
    })
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
      return new Response(JSON.stringify({ message: "¡Ya existe un usuario con ese nombre!" }))
    }
    return new Response(JSON.stringify({
      message: `Error ${error}`,
      status: 500,
    })
    )
  }

  
}