globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, a as renderTemplate, b as renderSlot, r as renderComponent } from '../chunks/astro/server_BAM4cObl.mjs';
/* empty css                                          */
import { j as jsxRuntimeExports, $ as $$Layout } from '../chunks/jsx-runtime_NUDKRqYk.mjs';
import { a as reactExports } from '../chunks/_@astro-renderers_BRUByLfp.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BRUByLfp.mjs';
/* empty css                                 */

function Form() {
  const [messageUser, setMessageUser] = reactExports.useState("");
  async function submit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch("/api/users.json", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (data.message) setMessageUser(data.message);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "border p-2 px-4 max-h-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg sm:text-2xl font-semibold text-center", children: "Formulario de acceso" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "text-base flex flex-col mt-4 gap-2 *:text-base", method: "POST", onSubmit: submit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            className: " text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            htmlFor: "userName",
            children: "Nombre del Usuario"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            required: true,
            type: "text",
            autoComplete: "true",
            min: 4,
            minLength: 4,
            placeholder: "Carlota*",
            className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2  ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black bg-slate-50 font-semibold",
            name: "nombre",
            id: "userName"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            className: " text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            htmlFor: "UserPassword",
            children: "Apellido de un usuario en concreto."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            required: true,
            type: "text",
            autoComplete: "true",
            min: 4,
            minLength: 4,
            placeholder: "CarlotaRamirez*",
            className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black bg-slate-50 font-semibold",
            name: "apellido",
            id: "UserPassword"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          className: "bg-orange-500 min-w-20 w-auto flex-auto shadow text-white rounded-md text-sm border-y border-transparent py-2 font-semibold px-3 hover:bg-orange-500 dark:hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 dark:focus:ring-offset-slate-900 dark:focus:ring-orange-500",
          children: "Guardar tus datos"
        }
      ) })
    ] }),
    messageUser && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/bases-de-datos", className: "text-slate-300 block text-xl mt-8 text-center", children: messageUser })
  ] });
}

const $$GuiaUso = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<article class="border p-2 px-4"> <h2 class="text-lg sm:text-2xl font-semibold">Guía de uso</h2> <h3 class="py-2 text-base font-medium">Sigue estos tres sencillos pasos</h3> <ul class="text-sm sm:text-lg list-decimal inset-x-4 relative space-y-2"> <li class="pe-2">
Llena los campos requeridos para el guardado de tus datos en una BD de
      MySQL
</li> <li class="pe-2">Dale al boton de guardar</li> <li class="pe-2">
Ir a la pagina de Base de datos para filtrar o buscar la información
      necesaria.
</li> </ul> </article>`;
}, "/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/src/components/section1/GuiaUso.astro", void 0);

const $$Home = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Busca tus bases de datos -->${maybeRenderHead()}<section class="grid grid-cols-2 grid-flow-row gap-4 py-20 mx-4 text-white"> ${renderSlot($$result, $$slots["guia"], renderTemplate` ${renderComponent($$result, "GuiaUso", $$GuiaUso, {})} `)} ${renderSlot($$result, $$slots["form"], renderTemplate` ${renderComponent($$result, "Form", Form, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/section1/Form", "client:component-export": "default" })} `)} </section>`;
}, "/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/src/components/Home.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "B\xFAsquedas de MySQL || FetchToMySQL", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Home", $$Home, { "data-astro-cid-j7pv25f6": true }, { "default": ($$result3) => renderTemplate` ${renderSlot($$result3, $$slots["guia"])} ${renderSlot($$result3, $$slots["form"])} ` })} </div> ` })} `;
}, "/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/src/pages/index.astro", void 0);

const $$file = "/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
