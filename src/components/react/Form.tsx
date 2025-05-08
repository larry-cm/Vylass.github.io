import { useState } from "react"

const iconoInfo = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v4" /><path d="M12 16v.01" /> </svg >
const iconoAlert = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>

export default function Form() {
    const [errorMsg, setErrorMsg] = useState("")
    async function submitData(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.target as HTMLFormElement)
        const res = await fetch('/verifyUsers/users.json', {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        !data.body.exist && setErrorMsg(data?.body?.message)
        data.body.exist && (window.location.href = '/inicio')

    }

    function anuncio() {
        const visible = (
            <div className="absolute top-13 sm:top-1/12 left-0 right-0 flex flex-col justify-center items-center max-w-[40rem] h-26 mx-4 px-4 sm:mx-auto bg-orange-500/60 before:content-[''] before:size-full before:bg-black/20 before:absolute ">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2 flex justify-center items-center">
                    ¡Ups! Ha ocurrido un error
                    <span className="ms-2">{errorMsg.match('error con la conexión a la base de datos') ? iconoAlert : iconoInfo}</span>
                </h4>
                <p className="text-slate-100 block font-medium text-base sm:text-lg self-start">{errorMsg}</p>
            </div>
        )
        setTimeout(() => {
            setErrorMsg("")
        }, 4000);
        return visible
    }

    return (
        <>

            <form className="text-base flex flex-col justify-between h-full *:text-base" method="POST" onSubmit={submitData}>
                <div className="flex flex-col sm:gap-y-3">
                    <label
                        htmlFor="userName" className="max-w-4/5">
                        <h3 className="py-2 text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">Nombre de usuario o correo electrónico</h3>
                    </label>
                    <input
                        required
                        type="text"
                        autoComplete="true"
                        min={4}
                        minLength={4}
                        placeholder="Carlota o carlota@gmail.com"
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder:text-slate-300 border border-gray-600 focus:outline-none focus:border-orange-500"
                        name="user-or-email"
                        id="userName"
                    />
                    <div className="flex flex-col sm:flex-row space-y-2 my-2 sm:my-0 sm:space-y-0 text-sm justify-between *:flex *:items-center *:text-orange-400 *:underline *:underline-offset-2">
                        <a href="inicio" className="hover:text-orange-400/80">Si tengo una cuenta!</a>
                        <a href="registro" className="hover:text-orange-400/80" >Regístrate ahora</a>
                    </div>
                </div>
                <div className="text-center mt-2 sm:mt-4">
                    <button
                        type="submit"
                        className="bg-orange-500 w-full flex-auto shadow text-white border-y border-transparent py-2 font-semibold px-3 hover:bg-orange-500 dark:hover:bg-orange-400 rounded"
                    >Continuar</button>
                </div>
            </form>

            {errorMsg && anuncio()}
        </>
    )
}
