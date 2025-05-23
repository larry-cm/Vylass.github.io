import React, { useState } from "react";
import Action from "@/components/react/Action";
import Loading from "@/components/react/formsServices/Loading";
import { Anuncio } from "@components/react/formsServices/Anuncio";
import type { InputsErrors } from "./Form";
import { validatePassword, cleanState, salidaInputsErrors } from "@components/react/formsServices/VerificacionInput";
import { ValidateInputs, TagVerification } from "@/components/react/formsServices/ValidateInputs.tsx";

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
        inputsValides ? setVerify() : setError(() => salidaInputsErrors(errorInput))
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setErrorInput({
            size: validatePassword({ verificar: value }).size(),
            containSpecialCharacter: validatePassword({ verificar: value }).containSpecialCharacter(),
            initialNumber: validatePassword({ verificar: value }).initialNumber(),
        });
    }

    const tags = (
        <>
            <TagVerification
                verClass={errorInput.size}
                textLi="¡Usa una contraseña larga y segura!"
                titleSpan="Tu contraseña debe tener al menos 8 caracteres para mayor seguridad" />
            <TagVerification
                verClass={errorInput.initialNumber}
                textLi="No debe comenzar con números"
                titleSpan="El nombre de usuario no puede comenzar con números ni contener caracteres especiales para mantener un formato consistente y fácil de recordar" />
        </>
    )
    return (
        <>
            <form method="POST" onSubmit={handleForm} encType="multipart/form-data">
                {/* Usuario / Email */}
                <div className="mb-2 text-xl">
                    <p className="font-semibold">
                        ¡Bienvenido de nuevo {userSessionInitial}! Ingresa tu contraseña
                        para continuar.
                    </p>
                </div>

                {/* Contraseña */}
                <div className="mb-6 space-y-3">
                    <label htmlFor="password" className="block mb-1 font-semibold">
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
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-orange-500 placeholder:text-slate-300"
                    />
                    <ValidateInputs Tags={tags} />
                </div>

                {/* Botón */}
                <Action type="submit" text="Iniciar Sesión" />

                {/* Enlaces */}
                <div className="mt-4 text-center text-sm">
                    ¿Olvidaste tu contraseña?
                    <a href="#" className="text-orange-400 underline ms-1">
                        Recupérala aquí
                    </a>
                </div>
            </form>
            {
                loading ? <Loading /> : error &&
                    <Anuncio
                        errorAvisoInitial={error}
                        cleanAviso={() => cleanState(() => setError(''))} />
            }
        </>
    )
}