import type { ActionProps } from "@/types/type";
import { useEffect } from "react";
import { cleanState } from '@/utils/VerificationInput'
import { IconAlert, IconInfo } from "@/assets/Icons"

export function Anuncio({ errorAvisoInitial, cleanAviso }: { errorAvisoInitial: string, cleanAviso: () => void }) {
    useEffect(() => {
        cleanState(() => cleanAviso())
    }, [])

    return (
        <div className="absolute left-0 right-0 flex flex-col items-center justify-center max-w-full p-4 mx-8 top-13 sm:top-1/12 min-h-26 sm:mx-32 bg-orange-500/90 backdrop-blur-xs" role="alert">
            <div className="flex items-start justify-center mb-2 sm:items-center">
                <h4 className="text-lg font-bold sm:text-xl ">
                    ¡Ups! Hemos encontrado un error
                </h4>
                <span className="ms-2 ">{errorAvisoInitial.match('error con la conexión a la base de datos') ? <IconAlert /> : <IconInfo />}</span>
            </div>
            <p className="self-start block text-base font-medium text-slate-100 sm:text-lg">{errorAvisoInitial}</p>
        </div>
    )
}

export function Loading() {
    return (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center min-w-full min-h-full py-8 bg-slate-50/90 dark:bg-black/80">
            <ul>
                <li>
                    <div className="loader">
                        <div className="child"></div>
                    </div>
                </li>

                <li>
                    <div className="text"></div>
                </li>
            </ul>
        </div>
    )
}

export function Action({ type = "submit", text = "Registrarse", izquierda, children }: ActionProps) {
    return (
        <button
            type={type}
            className="flex items-center justify-center w-full py-2 font-semibold text-white transition-colors bg-orange-500 rounded cursor-pointer gap-x-2 hover:bg-orange-600"
        >
            {izquierda && children && children}
            {text}{children && !izquierda && children}
        </button>
    );
}
