import type React from "react"
import Action from "@/components/react/Action"

export default function FormRegister() {
    const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = new FormData(event.target as HTMLFormElement)
        const resForm = await fetch('', {
            method: 'POST',
            body: form,
            headers: {}
        })
        const data = await resForm.json()
        data && console.log(data);

    }
    return (
        <>
            <form onSubmit={handleForm} method="POST" >
                {/* Usuario */}
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-1 font-semibold">
                        Nombre de usuario
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Ej: usuario123"
                        autoComplete="username"
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-orange-500 placeholder:text-slate-300"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 font-semibold">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Ej: correo@ejemplo.com"
                        autoComplete="email"
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-orange-500 placeholder:text-slate-300"
                    />
                </div>

                {/* Contraseña */}
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 font-semibold">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Introduce tu contraseña"
                        autoComplete="new-password"
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-orange-500 placeholder:text-slate-300"
                    />
                </div>

                {/* Nombre completo */}
                <div className="mb-4">
                    <label htmlFor="fullname" className="block mb-1 font-semibold">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        placeholder="Ej: Juan Pérez"
                        autoComplete="name"
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-orange-500 placeholder:text-slate-300"
                    />
                </div>

                {/* Teléfono */}
                <div className="mb-4">
                    <label htmlFor="phone" className="block mb-1 font-semibold">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Ej: +1 123 456 7890"
                        autoComplete="tel"
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-orange-500 placeholder:text-slate-300"
                    />
                </div>

                {/* País */}
                <div className="mb-4">
                    <label htmlFor="country" className="block mb-1 font-semibold">
                        País
                    </label>
                    <select
                        id="country"
                        name="country"
                        autoComplete="country"
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                        <option value="">Selecciona tu país</option>
                        <option value="co">Colombia</option>
                        <option value="mx">México</option>
                        <option value="ar">Argentina</option>
                        <option value="es">España</option>
                    </select>
                </div>

                {/* Imagen de perfil */}
                <div className="mb-6">
                    <label htmlFor="avatar" className="block mb-2 font-semibold">
                        Imagen de perfil (opcional)
                    </label>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4
                     file:rounded-none file:border-0
                     file:text-sm file:font-semibold
                     file:bg-orange-500 file:text-white
                     hover:file:bg-orange-600
                     bg-gray-800 border border-gray-600 rounded cursor-pointer"
                    />
                </div>

                {/* Botón */}
                <Action text="Registro" />
            </form>
        </>
    )
}