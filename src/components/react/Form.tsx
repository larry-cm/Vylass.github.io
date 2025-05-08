import { useState } from "react"
import Action from "@components/casa/Action"
import Loading from "@components/casa/Loading.tsx"
import { Anuncio, IconInfo } from "@components/react/Anuncio"

export default function Form() {
    const [errorMsg, setErrorMsg] = useState("")
    const [errorInput, setErrorInput] = useState({ size: false, containSpecialCharacter: false, initialNumber: false })
    const [loading, setLoading] = useState(false)

    function submitData(event: React.FormEvent<HTMLFormElement>) {

        setLoading(true)
        event.preventDefault()
        const envioDatos = async () => {
            const formData = new FormData(event.target as HTMLFormElement)
            const res = await fetch('/verifyUsers/users.json', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            // deberia devolver la data para componetizar
            !data.body.exist && setErrorMsg(data?.body?.message)
            if (data.body.exist) {
                window.location.href = '/inicio'
            }
            setLoading(false)

        }
        const inputs = Object.values(errorInput).every(input => input === false)

        if (inputs) {
            envioDatos()
        }
        else {
            setLoading(false)
            setErrorMsg(() => {
                if (errorInput.size) {
                    return "La contraseña debe tener al menos 8 caracteres";
                }
                if (errorInput.initialNumber) {
                    return "No puedes comenzar con números";
                }
                if (errorInput.containSpecialCharacter) {
                    return "No se permiten caracteres especiales";
                }
                return "Por favor verifica que todos los campos cumplan con los requisitos indicados";
            })
        }


    }

    function cleanMsg() {
        setTimeout(() => {
            setErrorMsg("")
        }, 4000);
    }

    function handleErrorInput(event: React.ChangeEvent<HTMLInputElement>) {
        const userOrEmail = event.target.value
        // Create a single validation object to avoid multiple state updates
        const validations = {
            size: userOrEmail.length >= 8,
            containSpecialCharacter: userOrEmail.length > 0 && !/[!#$%^&*(),?";:{}|<>]/.test(userOrEmail),
            initialNumber: userOrEmail.length > 0 && !/^[0-9]/.test(userOrEmail)
        };
        // Update all error states at once
        setErrorInput({

            size: !validations.size,
            containSpecialCharacter: !validations.containSpecialCharacter,
            initialNumber: !validations.initialNumber
        });
    }

    return (
        <>
            <form className="text-base flex flex-col justify-between h-full *:text-base" method="POST" encType="multipart/form-data" onSubmit={submitData}>
                <div className="flex flex-col sm:gap-y-3">
                    <label
                        htmlFor="userName" className="max-w-4/5">
                        <h3 className="py-2 text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg">Nombre de usuario o correo electrónico</h3>
                    </label>
                    <input
                        required
                        type="text"
                        autoComplete="true"
                        min={8}
                        minLength={8}
                        onChange={handleErrorInput}
                        placeholder="Carlota o carlota@gmail.com"
                        className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder:text-slate-300 border border-gray-600 focus:outline-none focus:border-orange-500"
                        name="user-or-email"
                        id="userName"
                    />
                    <div className="flex flex-col lg:flex-row space-y-2 my-2 sm:my-0 sm:space-y-0 text-sm justify-between items-start *:flex ">
                        <a href="registro" className="items-center text-orange-400 hover:text-orange-400/80 underline underline-offset-2 order-2 sm:order-1">Regístrate ahora</a>
                        <ul className="order-2 sm:order-1 space-y-1 text-xs mt-2 lg:mt-0 flex-col lg:items-end items-start text-slate-300 no-underline *:no-underline">
                            <li className={`flex items-center gap-2 ${errorInput.containSpecialCharacter ? 'text-red-600' : 'text-green-500'}`}>
                                No se permiten caracteres especiales
                                <span
                                    title="Evita caracteres especiales como !@#$%^&*(){}[]<> excepto en correos electrónicos. Para usuarios usa solo letras y números"
                                    className="cursor-pointer ml-1"><IconInfo className="size-4" /></span>
                            </li>
                            <li className={`flex items-center gap-2 ${errorInput.size ? 'text-red-600' : 'text-green-500'}`}>
                                ¡Usa una contraseña larga y segura!
                                <span
                                    title="Tu contraseña debe tener al menos 8 caracteres para mayor seguridad"
                                    className="cursor-pointer ml-1"><IconInfo className="size-4" /></span>
                            </li>
                            <li className={`flex items-center gap-2 ${errorInput.initialNumber ? 'text-red-600' : 'text-green-500'} transition-colors`}>
                                No debe comenzar con números
                                <span
                                    title="El nombre de usuario no puede comenzar con números ni contener caracteres especiales para mantener un formato consistente y fácil de recordar"
                                    className="cursor-pointer ml-1"><IconInfo className="size-4" /></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-2 sm:mt-4">
                    <Action type="submit" text="Continuar" />
                </div>
            </form>

            {loading ? <Loading /> : errorMsg && <Anuncio errorMsgInitial={errorMsg} cleanMsg={cleanMsg} />}
        </>
    )
}
