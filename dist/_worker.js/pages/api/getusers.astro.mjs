globalThis.process ??= {}; globalThis.process.env ??= {};
import { t as turso } from '../../chunks/configTurso_Cugks_Zz.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BRUByLfp.mjs';

const GET = async () => {
  const tursoUsers = await turso.execute("SELECT * FROM Users");
  console.log({ turso: tursoUsers.rows });
  return new Response(
    JSON.stringify({
      response: tursoUsers.rows
    })
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
