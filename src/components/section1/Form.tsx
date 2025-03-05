import { useState } from "react"

export default function Form() {
    const [messageUser, setMessageUser] = useState("")

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)
        const response = await fetch('/api/users.json', {
            method: 'POST',
            body: formData
        })

        const data = await response.json()

        if (data.message) setMessageUser(data.message)
    }

    return (
        <article className="border p-2 px-4 max-h-auto">
            <h2 className="text-lg sm:text-2xl font-semibold text-center">
                Formulario de acceso
            </h2>

            <form className="text-base flex flex-col mt-4 gap-2 *:text-base" method="POST" onSubmit={submit}>
                <div>
                    <label
                        className=" text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="userName">Nombre del Usuario</label>
                    <input
                        required
                        type="text"
                        autoComplete="true"
                        min={4}
                        minLength={4}
                        placeholder="Carlota*"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2  ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black bg-slate-50 font-semibold"
                        name="nombre"
                        id="userName"
                    />
                </div>

                <div>
                    <label
                        className=" text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="UserPassword">Apellido de un usuario en concreto.</label>
                    <input
                        required
                        type="text"
                        autoComplete="true"
                        min={4}
                        minLength={4}
                        placeholder="CarlotaRamirez*"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black bg-slate-50 font-semibold"
                        name="apellido"
                        id="UserPassword"
                    />
                </div>

                <div className="text-center mt-2">
                    <button
                        type="submit"
                        className="bg-orange-500 min-w-20 w-auto flex-auto shadow text-white rounded-md text-sm border-y border-transparent py-2 font-semibold px-3 hover:bg-orange-500 dark:hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 dark:focus:ring-offset-slate-900 dark:focus:ring-orange-500"
                    >Guardar tus datos</button>
                </div>
            </form>


            {messageUser && <a href="/bases-de-datos" className="text-slate-300 block text-xl mt-8 text-center">{messageUser}</a>}
        </article>
    )
}
