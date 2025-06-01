import { useState } from "react";
import { Anuncio, Loading, Action } from "@/components/react/formsServices/PopApps";
import { validatePassword, salidaInputsErrors } from "@/utils/VerificationInput";
import { ValidateInputs } from "@/utils/ValidateInputs";
import type { InputsErrors } from "@/types/type";

export default function FormInicio({ userSessionInitial }: { userSessionInitial: string }) {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) //se muestra mientras se envía la petición al servidor
    const [errorInput, setErrorInput] = useState<InputsErrors>({
        size: undefined, containSpecialCharacter: undefined, initialNumber: undefined
    }) // se recibe del servidor para mostrar el mensaje de error

    async function handleForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = new FormData(event.target as HTMLFormElement)
        const password = form.get('contraseña')

        async function setVerify() {
            try {
                setLoading(true)
                const resForm = await fetch('/verifyUsers/users.json', {
                    method: 'POST',
                    body: JSON.stringify({ password, userName: userSessionInitial }),
                })
                const { body, message } = await resForm.json()

                setLoading(false)

                if (body === false) setError(message)
                else if (body === null) setError(message)
                else window.location.href = '/'
            } catch (error) { setError('Error: ' + error) }

        }

        const inputsValides = errorInput.initialNumber === false && errorInput.size === false
        inputsValides ? (() => {
            setError('')
            setVerify()
        })() : setError(() => salidaInputsErrors(errorInput))
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setErrorInput({
            size: validatePassword({ verificar: value }).size(),
            containSpecialCharacter: validatePassword({ verificar: value, yesNumbers: true }).containSpecialCharacter(),
            initialNumber: validatePassword({ verificar: value }).initialNumber(),
        });
    }

    return (
        <>
            <form method="POST" onSubmit={handleForm} encType="multipart/form-data">
                {/* Usuario / Email */}
                <div className="mb-2 text-xl">
                    <p className="font-semibold text-slate-900 dark:text-white">
                        ¡Bienvenido de nuevo {userSessionInitial}! Ingresa tu contraseña
                        para continuar.
                    </p>
                </div>

                {/* Contraseña */}
                <div className="mb-6 space-y-3">
                    <label htmlFor="password" className="block mb-1 font-semibold text-slate-900 dark:text-white">
                        Contraseña
                    </label>
                    <input
                        required
                        type="password"
                        id="password"
                        name="contraseña"
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder="Introduce tu contraseña"
                        className="w-full px-4 py-2 rounded bg-slate-100 dark:bg-black/30 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-orange-500 placeholder:text-slate-500 dark:placeholder:text-slate-300"
                    />
                    <ValidateInputs tagsOptions={[false, true, false]} tagsState={errorInput} />
                </div>

                {/* Botón */}
                <Action type="submit" text="Iniciar Sesión" />

                {/* Enlaces */}
                <div className="mt-4 text-center text-sm text-slate-700 dark:text-white">
                    ¿Olvidaste tu contraseña?
                    <a href="#recuperar-contraseña" className="text-orange-500 dark:text-orange-400 underline ms-1">
                        Recupérala aquí
                    </a>
                </div>
            </form>
            {
                loading ? <Loading /> : error &&
                    <Anuncio
                        errorAvisoInitial={error}
                        cleanAviso={() => setError('')} />
            }
        </>
    )
}