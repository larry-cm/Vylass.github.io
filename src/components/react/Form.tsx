import { useState } from "react"
import { Anuncio, Loading, Action } from "@/components/react/formsServices/PopApps"
import { validatePassword, salidaInputsErrors } from "@/utils/VerificationInput"
import { ValidateInputs } from "@/utils/ValidateInputs"
import type { InputsErrors } from "@/types/type"

export default function Form() {
    const [loading, setLoading] = useState(false) //se muestra mientras se envía la petición al servidor
    const [query, setQuery] = useState("") //se envía a el servidor para verificar si existe el usuario
    const [errorMsg, setErrorMsg] = useState("") // se recibe del servidor para mostrar el mensaje de error
    const [errorInput, setErrorInput] = useState<InputsErrors>({
        size: undefined, containSpecialCharacter: undefined, initialNumber: undefined
    }) //se verifican si los inputs cumplen con los requisitos 

    function submitData(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        async function revisoDatos() {
            try {
                setLoading(true)

                const res = await fetch(`/verifyUsers/users.json?user=${encodeURIComponent(query)}`)
                const { body } = await res.json()

                // if (!res.ok) throw new Error('en la petición')
                if (!body.exist) {
                    // setErrorMsg(body?.message)
                    window.location.href = '/registro'
                }
                if (body.exist) window.location.href = '/inicio'
                setLoading(false)
            } catch (error) { setErrorMsg('Error :' + error) }
        }

        const inputs = Object.values(errorInput).every(input => !input)
        inputs ? revisoDatos() : setErrorMsg(() => salidaInputsErrors(errorInput))
    }

    function handleErrorInput(event: React.ChangeEvent<HTMLInputElement>) {
        const userOrEmail = event.target.value

        setQuery(userOrEmail)
        setErrorInput({
            size: validatePassword({ verificar: userOrEmail }).size(),
            containSpecialCharacter: validatePassword({ verificar: userOrEmail }).containSpecialCharacter(),
            initialNumber: validatePassword({ verificar: userOrEmail }).initialNumber()
        })
    }

    return (
        <>
            <form
                className="text-base flex flex-col justify-between h-full *:text-base"
                method="GET"
                encType="multipart/form-data"
                onSubmit={submitData}>
                <div className="flex flex-col sm:gap-y-3">
                    <label
                        htmlFor="userName" className="max-w-4/5">
                        <h3 className="py-2 text-slate-900 dark:text-slate-300/90 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg">Nombre de usuario o correo electrónico</h3>
                    </label>
                    <input
                        required
                        type="text"
                        autoComplete="true"
                        min={4}
                        minLength={4}
                        onChange={handleErrorInput}
                        value={query}
                        placeholder="Carlota o carlota@gmail.com"
                        className="w-full px-4 py-2 rounded bg-slate-100 dark:bg-black/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-300 border border-slate-300 dark:border-slate-200 focus:outline-none focus:border-orange-500"
                        name="user-or-email"
                        id="userName"
                    />
                    <ValidateInputs tagsOptions={[true, false, true]} tagsState={errorInput}>
                        <a href="registro" className="items-center text-orange-500 hover:contrast-150 transition-all dark:text-orange-400 dark:hover:text-orange-400/80 underline underline-offset-2 min-w-fit">Regístrate ahora</a>
                    </ValidateInputs>
                </div>
                <div className="text-center mt-2 sm:mt-4">
                    <Action type="submit" text="Continuar" />
                </div>
            </form>

            {loading ? <Loading /> : errorMsg &&
                <Anuncio
                    errorAvisoInitial={errorMsg}
                    cleanAviso={() => setErrorMsg('')} />
            }
        </>
    )
}
