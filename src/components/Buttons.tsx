import { IconDiscord, IconDotsMenu, IconGitHub, IconLinkedIn, } from "@/assets/Icons"
import { useState, type ReactNode } from "react"

function DropMenu({ children, handleClose, position }: { handleClose: () => void, children: ReactNode, position?: string }) {
    return (
        <div aria-label="barra de menu para opciones" role="dialog" onMouseLeave={handleClose} className={`absolute z-30 p-4 rounded-md bg-fondo backdrop-blur-2xl w-fit text-normal space-y-4 ${position ? position : ''}  `}>
            {
                children && children
            }
        </div>
    )
}

export function ButtonMenu({ children, position }: { children: ReactNode, position?: string }) {

    const [openMenu, setOpenMenu] = useState(false)
    const handleClose = () => {
        setOpenMenu(e => !e)
    }

    return (
        <>
            <button
                onClick={handleClose}
                className="z-20 p-2 transition duration-300 rounded cursor-pointer group/down bg-fondo hover:bg-fondo-claro"
            >
                <IconDotsMenu
                    className="transition duration-300 size-5 min-w-5 text-slate-200 group-hover/down:scale-110"
                />

            </button >
            {
                openMenu && <DropMenu handleClose={handleClose} position={position} >
                    {children && children}
                </DropMenu>
            }
        </>
    )
}

export function SocialMedia({ colors }: { colors?: string }) {
    return (
        <div className="flex gap-5 " role="list">
            <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.linkedin.com/in/larry-moncada-264762305/"
                className={`p-2 border-fondo-claro border transition rounded cursor-pointer  opacity-90 group hover:opacity-100 ${colors || 'bg-fondo hover:bg-fondo-claro'}`}
            ><IconLinkedIn
                    className="transition duration-300 size-6 max-w-6 group-hover:scale-110 group-hover:text-orange-500"
                /></a>
            <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/larry-cm"
                className={`p-2 border-fondo-claro border transition rounded cursor-pointer  opacity-90 group hover:opacity-100 ${colors || 'bg-fondo hover:bg-fondo-claro'}`}
            ><IconGitHub
                    className="transition duration-300 size-6 max-w-6 group-hover:scale-110 group-hover:text-orange-500"
                /></a>
            <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://discord.gg/Q4DhgHJW"
                className={`p-2 border-fondo-claro border transition rounded cursor-pointer  opacity-90 group hover:opacity-100 ${colors || 'bg-fondo hover:bg-fondo-claro'}`}
            ><IconDiscord
                    className="transition duration-300 size-6 max-w-6 group-hover:scale-110 group-hover:text-orange-500"
                /></a>
        </div>
    )
}