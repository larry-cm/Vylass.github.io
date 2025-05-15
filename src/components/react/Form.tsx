import { useState } from "react"
import Action from "@components/casa/Action"
import Loading from "@/components/react/formsServices/Loading"
import { Anuncio } from "@/components/react/formsServices/Anuncio"
import { cleanState, validatePassword, salidaInputsErrors } from "@/components/react/formsServices/VerificacionInput"
import { ValidateInputs, TagVerification } from "@/components/react/formsServices/ValidateInputs.tsx"

export interface InputsErrors {
    size: boolean | undefined;
    containSpecialCharacter: boolean | undefined;
    initialNumber: boolean | undefined;
}

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

                !body.exist && setErrorMsg(body?.message)
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

    const tags = (<>
        <TagVerification
            verClass={errorInput.containSpecialCharacter}
            textLi="No se permiten caracteres especiales"
            titleSpan="Evita caracteres especiales como !@#$%^&*(){}[]<> excepto en correos electrónicos. Para usuarios usa solo letras y números" />
        <TagVerification
            verClass={errorInput.size}
            textLi="¡Usa una contraseña larga y segura!"
            titleSpan="Tu contraseña debe tener al menos 8 caracteres para mayor seguridad" />
        <TagVerification
            verClass={errorInput.initialNumber}
            textLi="No debe comenzar con números"
            titleSpan="El nombre de usuario no puede comenzar con números ni contener caracteres especiales para mantener un formato consistente y fácil de recordar" />
    </>)
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
                        <h3 className="py-2 text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg">Nombre de usuario o correo electrónico</h3>
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
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder:text-slate-300 border border-gray-600 focus:outline-none focus:border-orange-500"
                        name="user-or-email"
                        id="userName"
                    />
                    <ValidateInputs Tags={tags}>
                        <a href="registro" className="items-center text-orange-400 hover:text-orange-400/80 underline underline-offset-2 min-w-fit">Regístrate ahora</a>
                    </ValidateInputs>
                </div>
                <div className="text-center mt-2 sm:mt-4">
                    <Action type="submit" text="Continuar" />
                </div>
            </form>

            {loading ? <Loading /> : errorMsg &&
                <Anuncio
                    errorAvisoInitial={errorMsg}
                    cleanAviso={() => cleanState(() => setErrorMsg(''))} />
            }
        </>
    )
}
