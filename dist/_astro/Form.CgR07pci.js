import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as i}from"./index.Dy6lLLXr.js";function c(){const[t,s]=i.useState("");async function a(r){r.preventDefault();const n=new FormData(r.target),o=await(await fetch("/api/users.json",{method:"POST",body:n})).json();o.message&&s(o.message)}return e.jsxs("article",{className:"border p-2 px-4 max-h-auto",children:[e.jsx("h2",{className:"text-lg sm:text-2xl font-semibold text-center",children:"Formulario de acceso"}),e.jsxs("form",{className:"text-base flex flex-col mt-4 gap-2 *:text-base",method:"POST",onSubmit:a,children:[e.jsxs("div",{children:[e.jsx("label",{className:" text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",htmlFor:"userName",children:"Nombre del Usuario"}),e.jsx("input",{required:!0,type:"text",autoComplete:"true",min:4,minLength:4,placeholder:"Carlota*",className:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2  ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black bg-slate-50 font-semibold",name:"nombre",id:"userName"})]}),e.jsxs("div",{children:[e.jsx("label",{className:" text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",htmlFor:"UserPassword",children:"Apellido de un usuario en concreto."}),e.jsx("input",{required:!0,type:"text",autoComplete:"true",min:4,minLength:4,placeholder:"CarlotaRamirez*",className:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black bg-slate-50 font-semibold",name:"apellido",id:"UserPassword"})]}),e.jsx("div",{className:"text-center mt-2",children:e.jsx("button",{type:"submit",className:"bg-orange-500 min-w-20 w-auto flex-auto shadow text-white rounded-md text-sm border-y border-transparent py-2 font-semibold px-3 hover:bg-orange-500 dark:hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 dark:focus:ring-offset-slate-900 dark:focus:ring-orange-500",children:"Guardar tus datos"})})]}),t&&e.jsx("a",{href:"/bases-de-datos",className:"text-slate-300 block text-xl mt-8 text-center",children:t})]})}export{c as default};
