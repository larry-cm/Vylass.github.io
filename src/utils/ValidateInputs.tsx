import type { InputsErrors } from "@/types/type"

export function TagVerification({ verClass, textLi, titleSpan }: { verClass: boolean | undefined, textLi: string, titleSpan: string }) {
    return (
        <li
            title={titleSpan ?? "El nombre de usuario no puede comenzar con números ni contener caracteres especiales para mantener un formato consistente y fácil de recordar"}
            className={`flex  justify-between gap-2 min-w-24 md:w-full ${verClass && verClass ? 'text-red-600' : 'text-green-500'} ${verClass === undefined && 'text-slate-900 dark:text-slate-300/90'} transition-colors`}>
            {textLi}
            <span
                title={titleSpan ?? "El nombre de usuario no puede comenzar con números ni contener caracteres especiales para mantener un formato consistente y fácil de recordar"}
                className="ml-1 cursor-pointer">
            </span>
        </li>
    )
}

export function ValidateInputs({ children, tagsOptions, tagsTexts, tagsState }: { tagsOptions: boolean[], tagsTexts?: { li?: string[], title?: string[] }, tagsState: InputsErrors, children?: React.ReactNode }) {

    const Tags = ({ tags, optionalText, state }: { tags: boolean[], optionalText?: { li?: string[], title?: string[] }, state: InputsErrors }) => {
        return tags.map((show, idx) => {
            if (!show) return null;

            const defaultTexts = [
                "No se permiten caracteres especiales",
                "¡Usa una contraseña larga y segura!",
                "No debe comenzar con números"
            ]

            const defaultTitles = [
                "Evita caracteres especiales como !@#$%^&*(){ }[]<> excepto en correos electrónicos. Para usuarios usa solo letras y números",
                "Tu contraseña debe tener al menos 8 caracteres para mayor seguridad",
                "El nombre de usuario no puede comenzar con números ni contener caracteres especiales para mantener un formato consistente y fácil de recordar"
            ]

            const stateKeys: (keyof InputsErrors)[] = [
                "containSpecialCharacter",
                "size",
                "initialNumber"
            ]

            return (
                <TagVerification
                    key={idx}
                    verClass={state[stateKeys[idx]]}
                    textLi={optionalText?.li?.[idx] && optionalText.li[idx].length ? optionalText.li[idx] : defaultTexts[idx]}
                    titleSpan={optionalText?.title?.[idx] && optionalText.title[idx].length ? optionalText.title[idx] : defaultTitles[idx]}
                />
            )
        })
    }

    return (
        <div className="flex flex-col space-x-2 mt-2 mb-4 sm:my-0 text-sm space-y-1 items-start *:flex ">
            <ul className="space-y-1 text-sm w-full  flex-col text-slate-300 no-underline *:no-underline">
                <Tags
                    tags={tagsOptions}
                    optionalText={tagsTexts}
                    state={tagsState} />
            </ul>
            {children && children}
        </div>
    )
}

