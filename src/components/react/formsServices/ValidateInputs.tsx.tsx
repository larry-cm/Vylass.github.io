import { IconInfo } from "@components/react/formsServices/Anuncio"
import type { InputsErrors } from "@components/react/Form"
import type React from "react"

export function TagVerification({ verClass, textLi, titleSpan }: { verClass: boolean | undefined, textLi: string, titleSpan: string }) {
    return (
        <li className={`flex  justify-between gap-2 min-w-24 md:w-full ${verClass && verClass ? 'text-red-600' : 'text-green-500'} ${verClass === undefined && 'text-slate-300/90'} transition-colors`}>
            {textLi}
            <span
                title={titleSpan ?? "El nombre de usuario no puede comenzar con números ni contener caracteres especiales para mantener un formato consistente y fácil de recordar"}
                className="cursor-pointer ml-1">{<IconInfo className="size-4" />}
            </span>
        </li>
    )
}

export function ValidateInputs({ children, Tags }: { Tags: React.ReactElement<any, any>, children?: React.ReactNode }) {
    return (
        <div className="flex flex-col space-x-2 my-2 sm:my-0 text-sm space-y-1 items-start *:flex ">
            <ul className="space-y-1 text-sm w-full flex-col text-slate-300 no-underline *:no-underline">
                {Tags}
            </ul>
            {children && children}
        </div>
    )
}

