globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BAM4cObl.mjs';
/* empty css                                          */
import { j as jsxRuntimeExports, $ as $$Layout } from '../chunks/jsx-runtime_NUDKRqYk.mjs';
import { a as reactExports } from '../chunks/_@astro-renderers_BRUByLfp.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BRUByLfp.mjs';

function BtnSql({ children, id, action, control }) {
  const [errorMessage, setErrorMessage] = reactExports.useState("");
  function resetMessage() {
    action();
    setErrorMessage("");
  }
  async function deleteUser() {
    await fetch(`/api/${id}`);
    action();
  }
  async function upsetUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const res = await fetch(`/api/${id}`, {
      method: "POST",
      body: formData
    });
    const { message, response } = await res.json();
    if (response == null) setErrorMessage(message);
    else action();
  }
  const manejo = {
    editar: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-200 text-black  shadow-md p-4 w-sm absolute top-12 -right-[1px] z-10 ", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-3 text-pretty", children: "¿Estás seguro que deseas registrar el nuevo nombre y apellido?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: upsetUser, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            name: "new-name",
            className: "w-full px-2 py-1 text-sm border  mb-2",
            placeholder: "Nuevo nombre",
            min: 4,
            minLength: 4,
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            name: "new-lastName",
            className: "w-full px-2 py-1 text-sm border  mb-3",
            placeholder: "Nuevo apellido",
            min: 4,
            minLength: 4,
            required: true
          }
        ),
        errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "block mb-4 text-sm text-[#8a2a00] font-medium", children: errorMessage }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: resetMessage,
              type: "button",
              className: "px-3 py-1 text-xs border  hover:bg-gray-100 font-semibold cursor-pointer",
              children: "Cerrar"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "px-3 py-1 text-xs bg-[#da8907]  font-semibold  hover:bg-[#da8907b0] cursor-pointer", children: "Aceptar" })
        ] })
      ] })
    ] }),
    eliminar: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute min-w-64 font-medium top-12 -right-[2px] bg-slate-100 p-2 z-10 border border-slate-900 ", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-900  text-center", children: [
        "Estas seguro que deseas eliminar la información del personaje #",
        id
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-around *:px-3 *:py-1  py-2 text-slate-900 *:bg-[#da8907] *:cursor-pointer *:transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: deleteUser, className: "hover:bg-[#da8907b0]", children: "Aceptar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: action, className: "hover:bg-[#da8907b0]", children: "Rechazar" })
      ] })
    ] })
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "i",
      {
        onClick: action,
        className: "cursor-pointer",
        title: `${control.option} los datos del usuario con el id ${id}`,
        children
      }
    ),
    control.stateValue && manejo[control.option]
  ] });
}
function FieldBTNS({ id, onSuccess }) {
  const [edit, setEdit] = reactExports.useState(false);
  const [trash, setTrash] = reactExports.useState(false);
  function updateEdit() {
    if (trash) setTrash(false);
    setEdit((editRecent) => !editRecent);
  }
  function updateTrash() {
    if (edit) setEdit(false);
    setTrash((trashRecent) => !trashRecent);
  }
  reactExports.useEffect(() => {
    onSuccess();
  }, [edit, trash]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-around  ", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BtnSql, { id, action: updateEdit, control: { stateValue: edit, option: "editar" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        width: "24",
        height: "24",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13.5 6.5l4 4" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BtnSql, { id, action: updateTrash, control: { stateValue: trash, option: "eliminar" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        width: "24",
        height: "24",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 7h16" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 12l4 4m0 -4l-4 4" }),
          " "
        ]
      }
    ) })
  ] });
}

function UsersTable() {
  const [usuarios, setUsuarios] = reactExports.useState([]);
  const refreshTable = async () => {
    const data_users = await fetch(`/api/getUsers`);
    const { response } = await data_users.json();
    setUsuarios(() => {
      response.map((e) => e.user_date = new Date(e.user_date));
      return response;
    });
  };
  reactExports.useEffect(() => {
    refreshTable();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Id" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Nombre" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Apellido" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Fecha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Editar" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: usuarios && usuarios?.map(
      ({ user_id, user_name, user_last_name, user_date }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "*:h-10 hover:bg-slate-200 hover:text-black transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: user_id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: user_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: user_last_name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: user_date?.toDateString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldBTNS, { id: user_id, onSuccess: refreshTable }) })
      ] }, user_id)
    ) })
  ] }) });
}

const $$BasesDeDatos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Bases de datos MySQL || FetchToMySQL" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen"> <h2 class="text-4xl text-slate-200 px-2 my-6">
Estos son los usuarios registrados en mi base de datos.
</h2> <div class="w-full px-2"> ${renderComponent($$result2, "UsersTable", UsersTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/section1/UsersTable", "client:component-export": "default" })} </div> </div> ` })}`;
}, "/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/src/pages/bases-de-datos.astro", void 0);

const $$file = "/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/src/pages/bases-de-datos.astro";
const $$url = "/bases-de-datos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$BasesDeDatos,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
