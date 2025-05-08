import Action from "@components/casa/Action";
import React, { useState, useEffect } from "react";
import { Anuncio } from "./Anuncio";
export default function FormInicio({ userSesionInitial }: { userSesionInitial: string }) {
    const [error, setError] = useState('')
    async function handleForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = new FormData(event.target as HTMLFormElement)
        const password = form.get('contraseña')
        if (password && password.valueOf().toString().length > 8) {
            // Enviar datos al servidor o realizar otras acciones con los dato
            const resForm = await fetch('/verifyUsers/users.json', {
                method: 'POST',
                body: JSON.stringify({ password, userName: userSesionInitial }),
            })
            const data = await resForm.json()
            if (data) {
                if (!data.body) {
                    setError(data.message);
                } else if (data.body === null) setError(data.message)
                else window.location.href = '/'
            }
        } else setError('La contra es muy corta');

    }
    return (
        <>
            <form method="POST" onSubmit={handleForm} encType="multipart/form-data">
                {/* Usuario / Email */}
                <div className="mb-2 text-xl">
                    <p className="font-semibold">
                        ¡Bienvenido de nuevo {userSesionInitial}! Ingresa tu contraseña
                        para continuar.
                    </p>
                </div>

                {/* Contraseña */}
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-1 font-semibold">
                        Contraseña
                    </label>
                    <input
                        required
                        type="password"
                        id="password"
                        name="contraseña"
                        autoComplete="current-password"
                        placeholder="Introduce tu contraseña"
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-orange-500 placeholder:text-slate-300"
                    />
                </div>

                {/* Botón */}
                <Action type="submit" text="Iniciar Sesión" />

                {/* Enlaces */}
                <div className="mt-4 text-center text-sm">
                    ¿Olvidaste tu contraseña?
                    <a href="#" className="text-orange-400 hover:underline">
                        Recupérala aquí
                    </a>
                </div>
            </form>
            {
                error && <Anuncio errorMsgInitial={error} cleanMsg={() => { setTimeout(() => setError(''), 4000) }} />
            }
        </>
    )
}