import { IconAccessibility, IconDotsMenu, IconDownload, IconGo } from "@/assets/Icons"
import { useState } from "react"

function DropMenu(handleClose: () => void, urls: string[]) {
    return (
        <menu onMouseLeave={handleClose} className="bg-neutral-800/90 backdrop-blur-md w-fit p-4 rounded-md absolute top-18 space-y-2 z-20 text-normal">
            <a href={urls[0]} className="rounded hover:bg-neutral-700/50 py-2 px-3 hover:-translate-y-0.5 hover:shadow-md min-w-44 text-start w-fit transition-all duration-300 flex items-center h-fit "> <IconGo className='size-5 scale-105 flex items-center me-2 mt-0.5' />Ver Ahora </a>
            <a href={urls[1]} className="rounded hover:bg-neutral-700/50 py-2 px-3 hover:-translate-y-0.5 hover:shadow-md min-w-44 text-start w-fit transition-all duration-300 flex items-center h-fit "><IconAccessibility className='size-6  flex items-center me-2 ' /> Mejorar</a>
            <a href={urls[2]} className="rounded hover:bg-neutral-700/50 py-2 px-3 hover:-translate-y-0.5 hover:shadow-md min-w-44 text-start w-fit transition-all duration-300 flex items-center h-fit "><IconDownload className='size-5 scale-105 flex items-center me-2 ' /> Descargar</a>
        </menu>
    )
}
export default function ButtonMenu({ urls }: { urls: string[] }) {
    const [openMenu, setOpenMenu] = useState(false)
    const [x, y, z] = urls
    const handleClose = () => {
        setOpenMenu(e => !e)
    }
    return (
        <>
            <button
                onClick={handleClose}
                className="animate-fade-in bg-neutral-800/80 hover:bg-neutral-700/50 rounded p-2 transition"
            >
                <IconDotsMenu
                    className="size-6 min-w-6 text-slate-200"
                />

            </button >
            {
                openMenu && DropMenu(handleClose, [x, y, z])
            }
        </>
    )
}