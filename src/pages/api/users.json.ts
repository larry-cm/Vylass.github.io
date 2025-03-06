import { turso } from "@bd/configTurso";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  const [name, lastName] = [data.get('nombre'), data.get('apellido')]
  
  if (!name || !lastName ||
    name.valueOf().toString().length < 5 || lastName.valueOf().toString().length < 5 ||
    name.valueOf().toString().match(' ') || lastName.valueOf().toString().match(' ') ||
    name.valueOf().toString().match(/\d/g) || lastName.valueOf().toString().match(/\d/g)) {
    return new Response(JSON.stringify({
      message: "¡Error de formato en el formulario!"
    })
    )
  }
  try {
    
    await turso.execute(`INSERT INTO Users (user_name, user_last_name, user_date) VALUES ('${name}', '${lastName}', '${new Date().toISOString()}')`)
    return new Response(JSON.stringify({
      message: "¡Guardaste tus datos Wapeton!"
    })
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return new Response(JSON.stringify({ message: "¡Ya existe un usuario con ese nombre!" }))
    }
    return new Response(JSON.stringify({
      message: `Error ${error}`,
      status: 500,
    })
    )
  }

  
}