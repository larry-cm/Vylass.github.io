import { useState } from "react"

function BtnSql({ children, id, control,onSuccess }: { children: any, id: number,  control: { stateValue: boolean, option: 'editar' | 'eliminar',action:any },onSuccess:any }) {
    const {action,option,stateValue} = control
    const [errorMessage, setErrorMessage] = useState('')
    
    function resetMessage() {
        action()
        setErrorMessage('')
    }

    async function deleteUser() {
        await fetch(`/api/${id}`)
        action()
        onSuccess()
    }

    async function upsetUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const res = await fetch(`/api/${id}`, {method: "POST",body: formData})
        const { message, response } = await res.json()
        if (response == null) setErrorMessage(message)
        else action()
        onSuccess()
    }

    const manejo = {
        editar: (
            <div className="bg-slate-200 text-black  shadow-md p-4 w-sm absolute top-12 -right-[1px] z-10 ">
                <h3 className="text-sm font-medium mb-3 text-pretty">
                    ¿Estás seguro que deseas registrar el nuevo nombre y apellido?
                </h3>

                <form onSubmit={upsetUser}>
                    <input
                        type="text"
                        name="new-name"
                        className="w-full px-2 py-1 text-sm border  mb-2"
                        placeholder="Nuevo nombre"
                        min={4}
                        minLength={4}
                        required
                    />

                    <input
                        type="text"
                        name="new-lastName"
                        className="w-full px-2 py-1 text-sm border  mb-3"
                        placeholder="Nuevo apellido"
                        min={4}
                        minLength={4}
                        required
                    />

                    {errorMessage && <small className="block mb-4 text-sm text-[#8a2a00] font-medium">{errorMessage}</small>}
                    <div className="flex justify-between">
                        <button
                            onClick={resetMessage}
                            type="button"
                            className="px-3 py-1 text-xs border  hover:bg-gray-100 font-semibold cursor-pointer"
                        >
                            Cerrar
                        </button>
                        <button type="submit" className="px-3 py-1 text-xs bg-[#da8907]  font-semibold  hover:bg-[#da8907b0] cursor-pointer">
                            Aceptar
                        </button>
                    </div>
                </form>
            </div>
        ),
        eliminar: (
            <div className="absolute min-w-64 font-medium top-12 -right-[2px] bg-slate-100 p-2 z-10 border border-slate-900 ">
                <p className="text-slate-900  text-center">Estas seguro que deseas eliminar la información del personaje #{id}</p>

                <div className="flex justify-around *:px-3 *:py-1  py-2 text-slate-900 *:bg-[#da8907] *:cursor-pointer *:transition-colors">
                    <button onClick={deleteUser} className="hover:bg-[#da8907b0]">Aceptar</button>
                    <button onClick={action} className="hover:bg-[#da8907b0]">Rechazar</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <i
                onClick={action}
                className="cursor-pointer"
                title={`${option} los datos del usuario con el id ${id}`}>
                {children}
            </i>
            {stateValue && manejo[option]}
        </>
    )
}

export default function FieldBTNS({ id, onSuccess }: { id: number, onSuccess: any }) {

    const [state, setState] = useState({ edit: false, trash: false });

    function update(option: 'editar' | 'eliminar') {
        setState(prevState => {
            if (option === 'editar' && prevState.trash ||
                option === 'eliminar' && prevState.edit) return { edit: !prevState.edit, trash: !prevState.trash }
            if(option ==='editar') return { edit: !prevState.edit, trash: prevState.trash }
            if (option === 'eliminar') return { edit: prevState.edit, trash: !prevState.trash }
            return prevState
        })
     }

    
    return (
        <span className="flex items-center justify-around  ">
            <BtnSql id={id} onSuccess={onSuccess} control={{ stateValue: state.edit, option: 'editar',action:()=>update('editar') }}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="24"
                    height="24"
                    strokeWidth="2"
                >
                    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                    <path d="M13.5 6.5l4 4" />
                </svg>
            </BtnSql>

            <BtnSql id={id} onSuccess={onSuccess} control={{ stateValue: state.trash, option: 'eliminar',action:()=>update('eliminar') }}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="24"
                    height="24"
                    strokeWidth="2"
                >
                    <path d="M4 7h16" />{" "}
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />{" "}
                    <path d="M10 12l4 4m0 -4l-4 4" />{" "}
                </svg>
            </BtnSql>
        </span>
    )
}