import React, { useEffect, useRef, useState } from "react"
import Action from "@/components/react/formsServices/Action"
import { validatePassword } from "@/utils/VerificationInput"
import type { InputsErrors, InputsUse } from "@/types/type"
import { ValidateInputs } from "@/utils/ValidateInputs"

function InputsText({
    id,
    type,
    valueInput,
    etiqueta,
    autocomplete,
    label,
    required,
    placeH,
    title,
    minL,
    pattern,
    inputs,
    children,
    callErrors
}: InputsUse) {
    const [value, setValue] = useState('')
    const [error, setError] = useState<InputsErrors>({ size: undefined, containSpecialCharacter: undefined, initialNumber: undefined })
    const [errorDate, setErrorDate] = useState(false)

    function getUserValidate(textValidate: string, isNumbers?: boolean) {
        setError({
            size: validatePassword({ verificar: textValidate }).size(),
            containSpecialCharacter: validatePassword({ verificar: textValidate, yesNumbers: isNumbers }).containSpecialCharacter(),
            initialNumber: validatePassword({ verificar: textValidate }).initialNumber()
        })
    }

    function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        const valueE = event.target.value
        const nowDate = new Date().getFullYear()
        const yearSelected = parseInt(valueE.split('-')?.filter(e => e.length > 2)?.at(0) ?? nowDate.toString())
        setValue(valueE);

        (id?.match('usuario')) && getUserValidate(valueE, true);
        (id?.match('name')) && getUserValidate(valueE);
        (type === 'date' && yearSelected > (nowDate - 5)) ? setErrorDate(true) : setErrorDate(false)
    }

    useEffect(() => {
        if (callErrors || (callErrors && type === 'date')) {
            Object.values(error).some(e => e === true) || errorDate ? callErrors.resetErrorChild() : callErrors.sendErrorChild()
        }
    }, [value])

    return (
        <div>
            <label htmlFor={id ?? "username"} className="block text-sm font-medium text-slate-950 dark:text-slate-50">
                {etiqueta ?? "Nombre completo (Obligatorio)"}
            </label>
            <input
                type={type ?? "text"}
                minLength={!type ? minL : undefined}
                id={id ?? "username"}
                name={id ?? "username"}
                autoComplete={autocomplete ?? "name"}
                aria-label={label ?? "Nombre completo del usuario"}
                aria-required={required}
                placeholder={placeH ?? "Nombre y apellido (Ej: Juan Pérez)"}
                title={title ?? "Introduce tu nombre completo"}
                className="w-full mb-2 mt-1 bg-input border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder:text-slate-900 dark:placeholder:text-slate-300/90 dark:text-slate-200 bg-black/30"
                onChange={handleInput}
                value={valueInput ?? value}
                pattern={type ? pattern : undefined}
                required={required}
            />
            {
                type === 'date' && (
                    <p className={`text-sm animate-h ${errorDate ? 'on' : ''} text-red-500 mt-1`}>
                        Debes tener al menos 5 años de edad para registrarte. Por favor, selecciona una fecha de nacimiento válida.
                    </p>
                )

            }
            {
                inputs && (
                    <ValidateInputs
                        tagsOptions={inputs.options ?? Array(3).fill(true)}
                        tagsState={error}
                        tagsTexts={{
                            li: (inputs.textos.li && inputs.textos.li.map(e => e)) ?? ['', 'Usa un nombre de usuario seguro.'],
                            title: (inputs.textos.title && inputs.textos.title.map(e => e)) ?? ['', 'Tu nombre de usuario debe tener como mínimo 8 caracteres.']
                        }} />
                )
            }
            {children && children}
        </div >
    )

}

export default function FormRegister() {
    const formRef = useRef<HTMLFormElement>(null)
    const [userLocation, setUserLocation] = useState<{ city: string, country_name: string } | null>(null)
    const [errorForm, setErrorForm] = useState(false)

    async function handleForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!formRef.current || errorForm) return

        const form = new FormData(formRef.current)
        const username = form.get('username')
        console.log(username);

        // try {
        //     const resForm = await fetch("", {
        //         method: "POST",
        //         body: form,
        //     })
        //     if (!resForm.ok) console.error('Error en la petición')
        //     const data = await resForm.json()
        //     if (data) console.log(data)
        // } catch (e) {
        //     console.error("Error al procesar la respuesta del servidor")
        // }
    }

    async function getLocationIP() {
        try {
            const data = await fetch("https://ipapi.co/json/")
            if (!data.ok) return setUserLocation({ city: 'No encontrada', country_name: 'No encontrado' })

            const { city, country_name } = await data.json()
            localStorage.setItem('user_location', JSON.stringify({ city, country_name }))
        } catch (error) {
            console.error(error)
        }
    }

    function sendErrorChild() {
        setErrorForm(false)
    }

    function resetErrorChild() {
        setErrorForm(true)
    }

    useEffect(() => {
        const locationUser = localStorage.getItem('user_location')
        if (locationUser) {
            const { city, country_name } = JSON.parse(locationUser)
            setUserLocation({ city, country_name })
            return
        } else {
            getLocationIP()
        }
    }, [])

    return (
        <form
            method="POST"
            className="space-y-4"
            ref={formRef}
            onSubmit={handleForm}
        >
            {/* Información Personal */}
            <div>
                <fieldset
                    className=" bg-black/30 border border-orange-400 dark:border-slate-200 rounded p-3 sm:p-6 space-y-4"
                    aria-labelledby="info-personal-legend"
                >
                    <legend
                        className=" font-semibold text-lg px-2 text-black dark:text-orange-500"
                    >
                        Información Personal
                    </legend>
                    {/* nombre de usuario */}
                    <InputsText
                        etiqueta="Nombre de usuario (Obligatorio)"
                        id="username"
                        autocomplete="username"
                        label="Nombre  preferido del usuario"
                        placeH="Nombre (Ej: JuanPé)"
                        title="Introduce tu nombre completo"
                        inputs={{ textos: { li: undefined, title: undefined } }}
                        required
                        callErrors={{ sendErrorChild, resetErrorChild }}
                    />
                    {/* nombre */}
                    <InputsText
                        id="name"
                        autocomplete="name"
                        label="Nombre completo del usuario"
                        placeH="Nombre y apellido (Ej: Juan Pérez)"
                        title="Introduce tu nombre completo"
                        inputs={{ textos: { li: ['Por favor danos un nombre completo esta información sera util mas adelante'], title: ['Evita caracteres especiales o números, Para tu nombre usa solo letras y espacios'] }, options: [true, false, false] }}
                        required
                        callErrors={{ sendErrorChild, resetErrorChild }}
                    />

                    {/* fecha nacimiento */}
                    <InputsText
                        etiqueta="Fecha de nacimiento (Obligatorio)"
                        type="date"
                        id="fecha"
                        label="Fecha de nacimiento"
                        placeH="YYYY-MM-DD"
                        autocomplete="date"
                        title="Selecciona tu fecha de nacimiento"
                        required
                        callErrors={{ sendErrorChild, resetErrorChild }}
                    />
                    {/* estado civil */}
                    <div>
                        <label htmlFor="estado_civil" className="block text-sm font-medium text-slate-950 dark:text-slate-50">
                            Estado civil <span className="sr-only">(Obligatorio)</span>
                        </label>
                        <select
                            id="estado_civil"
                            name="civil-state"
                            title="Selecciona tu estado civil actual"
                            autoComplete="off"
                            aria-label="Estado civil"
                            aria-required="true"
                            className="w-full mt-1 bg-input border border-slate-200 text-texto rounded px-3 py-2 text-slate-900 dark:text-slate-200 bg-black/30"
                            required
                            defaultValue="Soltero"
                        >
                            <option className="bg-[#1a1a1a] text-slate-200 font-normal" value="Soltero">Soltero</option>
                            <option className="bg-[#1a1a1a] text-slate-200 font-normal" value="Casado">Casado</option>
                            <option className="bg-[#1a1a1a] text-slate-200 font-normal" value="Union libre">Unión libre</option>
                        </select>
                    </div>
                    {/* nacionalidad */}
                    <InputsText
                        etiqueta="Nacionalidad"
                        id="nacionalidad"
                        placeH="Nacionalidad (Ej: Colombiana)"
                        label="Nacionalidad principal"
                        title="Indica tu nacionalidad principal"
                        autocomplete="country"
                    >
                        <p className="text-sm text-slate-900 dark:text-slate-300/90 mt-1">
                            Escribe tu nacionalidad principal, por ejemplo: Colombiana.
                        </p>
                    </InputsText>
                </fieldset>
            </div>
            {/* Contacto y residencia */}
            <div>
                <fieldset
                    className="bg-panel bg-black/30 border border-orange-400 dark:border-slate-200 rounded p-3 sm:p-6 space-y-4"
                    aria-labelledby="contacto-legend"
                >
                    <legend
                        id="contacto-legend"
                        className="text-acento font-semibold me-auto sm:me-0 px-2 text-black dark:text-orange-500"
                    >
                        Contacto y Residencia
                    </legend>
                    {/* ciudad  */}
                    <InputsText
                        etiqueta="Ubicación"
                        id="location"
                        placeH={`Ciudad y país (Ej: ${userLocation?.city}, ${userLocation?.country_name})`}
                        label="Ciudad y país de residencia"
                        title="Ciudad y país donde resides"
                        autocomplete="address-level2"
                    >
                        <p className="text-sm text-slate-900 dark:text-slate-300/90 mt-1">
                            Indica la ciudad y el país donde resides actualmente.
                        </p>
                    </InputsText>
                    {/* dirección */}
                    <InputsText
                        etiqueta="Dirección actual"
                        id="address"
                        placeH="Dirección completa (Ej: Calle 45 #78-23, Apto 302)"
                        label="Dirección de residencia"
                        title="Introduce tu dirección completa"
                        autocomplete="street-address">
                        <p className="text-sm text-slate-900 dark:text-slate-300/90 mt-1">
                            Escribe tu dirección completa para facilitar la ubicación.
                        </p>
                    </InputsText>
                    {/* teléfono */}
                    <InputsText
                        etiqueta="Teléfono (Obligatorio)"
                        id="phone"
                        type="tel"
                        placeH="Número de teléfono (Ej: 300 123 4567)"
                        label="Número de teléfono de contacto"
                        title="Proporciona un número de teléfono válido"
                        autocomplete="tel"
                        pattern="[0-9+\s\-]{7,20}"
                        required>
                        <p className="text-sm text-slate-900 dark:text-slate-300/90 mt-1">
                            Ingresa un número de teléfono donde podamos contactarte.
                        </p>
                    </InputsText>
                    {/* Email */}
                    <InputsText
                        etiqueta="Correo electrónico (Obligatorio)"
                        id="email"
                        placeH="Correo electrónico (Ej: lceballos@email.com)"
                        label="Correo electrónico para notificaciones"
                        title="Introduce un correo electrónico válido"
                        autocomplete="email"
                        required>
                        <p className="text-sm text-slate-900 dark:text-slate-300/90 mt-1">
                            Escribe un correo electrónico válido para recibir
                            notificaciones.
                        </p>
                    </InputsText>
                </fieldset>
            </div>
            {/* Información profesional */}
            <div>
                <fieldset
                    className="bg-panel bg-black/30 border  dark:border-slate-200 border-orange-500 rounded-md p-3 sm:p-6 space-y-4"
                    aria-labelledby="profesional-legend"
                >
                    <legend
                        id="profesional-legend"
                        className="text-acento font-semibold me-auto sm:me-0 px-2 text-black dark:text-orange-500"
                    >
                        Información Profesional
                    </legend>
                    {/* ocupación */}
                    <InputsText
                        etiqueta="Ocupación"
                        id="busy"
                        placeH="Ocupación actual (Ej: Operador de máquina)"
                        label="Ocupación actual"
                        title="Indica tu ocupación actual"
                        autocomplete="off">
                        <p className="text-sm text-slate-900 dark:text-slate-300/90 mt-1">
                            Especifica tu ocupación o profesión actual.
                        </p>
                    </InputsText>
                    {/* educación */}
                    <div>
                        <label htmlFor="education" className="block text-sm text-slate-950 dark:text-slate-50 font-medium">
                            Nivel de educación
                        </label>
                        <select
                            id="education"
                            name="education"
                            aria-label="Nivel de educación alcanzado"
                            title="Selecciona tu nivel de educación más alto"
                            className="w-full mt-1 bg-input border border-slate-200 text-texto rounded px-3 py-2 text-slate-900 dark:text-slate-200 bg-black/30"
                            defaultValue="Ninguno"
                        >
                            <option className="bg-[#1a1a1a] text-slate-200 font-normal" value="Ninguno" >Ninguno</option>
                            <option className="bg-[#1a1a1a] text-slate-200 font-normal" value="Técnico">Técnico</option>
                            <option className="bg-[#1a1a1a] text-slate-200 font-normal" value="Bachiller">Bachiller</option>
                            <option className="bg-[#1a1a1a] text-slate-200 font-normal" value="Tecnólogo">Tecnólogo</option>
                            <option className="bg-[#1a1a1a] text-slate-200 font-normal" value="Profesional">Profesional</option>
                        </select>
                    </div>
                    {/* Idiomas */}
                    <InputsText
                        etiqueta="Idiomas"
                        id="idiomas"
                        placeH="Idiomas que dominas (Ej: Español, Inglés)"
                        label="Idiomas que dominas"
                        title="Indica los idiomas que hablas"
                        autocomplete="off"
                    >
                        <p className="text-sm text-slate-900 dark:text-slate-300/90 mt-1">
                            Menciona los idiomas que hablas, separados por comas.
                        </p>
                    </InputsText>

                </fieldset>
            </div>
            {/* Botón */}
            <Action text="Registro" />
        </form>
    )
}


