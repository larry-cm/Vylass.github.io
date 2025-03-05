import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as i}from"./index.Dy6lLLXr.js";function u({children:o,id:n,action:s,control:t}){const[r,a]=i.useState("");function l(){s(),a("")}async function d(){await fetch(`/api/${n}`),s()}async function c(h){h.preventDefault();const m=new FormData(h.target),p=await fetch(`/api/${n}`,{method:"POST",body:m}),{message:j,response:f}=await p.json();f==null?a(j):s()}const x={editar:e.jsxs("div",{className:"bg-slate-200 text-black  shadow-md p-4 w-sm absolute top-12 -right-[1px] z-10 ",children:[e.jsx("h3",{className:"text-sm font-medium mb-3 text-pretty",children:"¿Estás seguro que deseas registrar el nuevo nombre y apellido?"}),e.jsxs("form",{onSubmit:c,children:[e.jsx("input",{type:"text",name:"new-name",className:"w-full px-2 py-1 text-sm border  mb-2",placeholder:"Nuevo nombre",min:4,minLength:4,required:!0}),e.jsx("input",{type:"text",name:"new-lastName",className:"w-full px-2 py-1 text-sm border  mb-3",placeholder:"Nuevo apellido",min:4,minLength:4,required:!0}),r&&e.jsx("small",{className:"block mb-4 text-sm text-[#8a2a00] font-medium",children:r}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("button",{onClick:l,type:"button",className:"px-3 py-1 text-xs border  hover:bg-gray-100 font-semibold cursor-pointer",children:"Cerrar"}),e.jsx("button",{type:"submit",className:"px-3 py-1 text-xs bg-[#da8907]  font-semibold  hover:bg-[#da8907b0] cursor-pointer",children:"Aceptar"})]})]})]}),eliminar:e.jsxs("div",{className:"absolute min-w-64 font-medium top-12 -right-[2px] bg-slate-100 p-2 z-10 border border-slate-900 ",children:[e.jsxs("p",{className:"text-slate-900  text-center",children:["Estas seguro que deseas eliminar la información del personaje #",n]}),e.jsxs("div",{className:"flex justify-around *:px-3 *:py-1  py-2 text-slate-900 *:bg-[#da8907] *:cursor-pointer *:transition-colors",children:[e.jsx("button",{onClick:d,className:"hover:bg-[#da8907b0]",children:"Aceptar"}),e.jsx("button",{onClick:s,className:"hover:bg-[#da8907b0]",children:"Rechazar"})]})]})};return e.jsxs(e.Fragment,{children:[e.jsx("i",{onClick:s,className:"cursor-pointer",title:`${t.option} los datos del usuario con el id ${n}`,children:o}),t.stateValue&&x[t.option]]})}function b({id:o,onSuccess:n}){const[s,t]=i.useState(!1),[r,a]=i.useState(!1);function l(){r&&a(!1),t(c=>!c)}function d(){s&&t(!1),a(c=>!c)}return i.useEffect(()=>{n()},[s,r]),e.jsxs("span",{className:"flex items-center justify-around  ",children:[e.jsx(u,{id:o,action:l,control:{stateValue:s,option:"editar"},children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",width:"24",height:"24",strokeWidth:"2",children:[e.jsx("path",{d:"M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"}),e.jsx("path",{d:"M13.5 6.5l4 4"})]})}),e.jsx(u,{id:o,action:d,control:{stateValue:r,option:"eliminar"},children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",width:"24",height:"24",strokeWidth:"2",children:[e.jsx("path",{d:"M4 7h16"})," ",e.jsx("path",{d:"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"})," ",e.jsx("path",{d:"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"})," ",e.jsx("path",{d:"M10 12l4 4m0 -4l-4 4"})," "]})})]})}function v(){const[o,n]=i.useState([]),s=async()=>{const t=await fetch("/api/getUsers"),{response:r}=await t.json();n(()=>(r.map(a=>a.user_date=new Date(a.user_date)),r))};return i.useEffect(()=>{s()},[]),e.jsx(e.Fragment,{children:e.jsxs("table",{className:"min-w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Id"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{children:"Apellido"}),e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Editar"})]})}),e.jsx("tbody",{children:o&&o?.map(({user_id:t,user_name:r,user_last_name:a,user_date:l})=>e.jsxs("tr",{className:"*:h-10 hover:bg-slate-200 hover:text-black transition-colors",children:[e.jsx("td",{children:t}),e.jsx("td",{children:r}),e.jsx("td",{children:e.jsx("div",{className:"flex items-center justify-between",children:a})}),e.jsx("td",{children:l?.toDateString()}),e.jsx("td",{className:"relative",children:e.jsx(b,{id:t,onSuccess:s})})]},t))})]})})}export{v as default};
