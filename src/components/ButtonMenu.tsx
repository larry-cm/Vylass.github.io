import { IconDotsMenu, IconGo } from "@/assets/Icons"
import { useState } from "react"

function DropMenu(handleClose: () => void) {
    return (
        <ul onMouseLeave={handleClose} className="bg-neutral-800/90 backdrop-blur-md w-fit p-4 rounded-md absolute top-18 space-y-2 z-20">
            <li className="rounded hover:bg-neutral-700/80 py-2 px-3 min-w-44 text-start w-fit transition flex items-center h-fit ">Ver Ahora <IconGo className='size-5 scale-105 flex items-center ms-2 mt-0.5' /></li>
            <li className="rounded hover:bg-neutral-700/80 py-2 px-3 min-w-44 text-start w-fit transition flex items-center h-fit ">Mejorar</li>
            <li className="rounded hover:bg-neutral-700/80 py-2 px-3 min-w-44 text-start w-fit transition flex items-center h-fit ">Descargar</li>
        </ul>
    )
}
export default function ButtonMenu() {
    const [openMenu, setOpenMenu] = useState(false)
    const handleClose = () => {
        setOpenMenu(e => !e)
    }
    return (
        <>
            <button
                onMouseLeave={handleClose}
                onClick={handleClose}
                className="animate-fade-in bg-neutral-800/80 hover:bg-neutral-800 rounded p-2 transition"
            >
                <IconDotsMenu
                    className="size-6 min-w-6 text-slate-200"
                />

            </button >
            {
                openMenu && DropMenu(handleClose)
            }
        </>
    )
}