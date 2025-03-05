globalThis.process ??= {}; globalThis.process.env ??= {};
import { t as turso } from '../../chunks/configTurso_Cugks_Zz.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BRUByLfp.mjs';

const GET = async ({ params }) => {
  const id_delete = params.id_delete;
  await turso.execute(`DELETE FROM Users WHERE user_id = ${id_delete}`);
  return new Response(
    JSON.stringify({
      message: "Usuario eliminado 🧺. eliminado de  la base."
    })
  );
};
const POST = async ({ request, params }) => {
  const id = params.id_delete;
  try {
    const data = await request.formData();
    const [name, lastName] = [data.get("new-name"), data.get("new-lastName")];
    await turso.execute(`UPDATE Users SET user_name = '${name}', user_last_name = '${lastName}' WHERE user_id = ${id}`);
    return new Response(JSON.stringify({
      response: { name, lastName },
      message: "Usuario actualizado 🔁."
    }));
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return new Response(JSON.stringify(
        {
          response: null,
          message: "El usuario ya existe en nuestra tabla de registros revíselo."
        }
      ));
    }
    return new Response(JSON.stringify({
      response: null,
      message: "Error al actualizar."
    }));
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
