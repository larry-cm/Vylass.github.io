globalThis.process ??= {}; globalThis.process.env ??= {};
import { t as turso } from '../../chunks/configTurso_Cugks_Zz.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BRUByLfp.mjs';

const POST = async ({ request }) => {
  const data = await request.formData();
  const [name, lastName] = [data.get("nombre"), data.get("apellido")];
  if (!name || !lastName || name.valueOf().toLocaleString().length < 5 || lastName.valueOf().toLocaleString().length < 5 || name.valueOf().toLocaleString().includes(" ") || lastName.valueOf().toLocaleString().includes(" ")) {
    return new Response(
      JSON.stringify({
        message: "¡Error de formato en el formulario!"
      })
    );
  }
  try {
    await turso.execute(`INSERT INTO Users (user_name, user_last_name, user_date) VALUES ('${name}', '${lastName}', '${(/* @__PURE__ */ new Date()).toISOString()}')`);
    return new Response(
      JSON.stringify({
        message: "¡Guardaste tus datos Wapeton!"
      })
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("SQLITE_CONSTRAINT_UNIQUE")) {
      return new Response(JSON.stringify({ message: "¡Ya existe un usuario con ese nombre!" }));
    }
    return new Response(
      JSON.stringify({
        message: `Error ${error}`,
        status: 500
      })
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
