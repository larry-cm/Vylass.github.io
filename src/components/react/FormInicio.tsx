import Action from "@components/casa/Action";
import React, { useState, useEffect } from "react";
export default function FormInicio({ userSesionInitial }: { userSesionInitial: string }) {
    function handleForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = new FormData(event.target as HTMLFormElement)

        const resForm = fetch('', {
            method: 'POST',
            body: form,
            headers: {}
        })
    }
    return (
        <form method="POST">
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
                    type="password"
                    id="password"
                    name="password"
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

    )
}