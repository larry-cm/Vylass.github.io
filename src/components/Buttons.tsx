import { IconAlert, IconDiscord, IconDotsMenu, IconGitHub, IconLinkedIn, } from "@/assets/Icons"
import ToastPage from "@/library/ToastPage"
import type { SocialLinks } from "@/types/type"
import React, { useState, type ReactNode } from "react"
import toast from "react-hot-toast"

function DropMenu({ children, handleClose, position }: { handleClose: () => void, children: ReactNode, position?: string }) {
    return (
        <div aria-label="barra de menu para opciones" role="dialog" onMouseLeave={handleClose} className={`absolute z-30 p-4 rounded-md bg-fondo backdrop-blur-2xl w-fit text-normal space-y-4 ${position ? position : ''}  `}>
            {
                children && children
            }
        </div>
    )
}

export function ButtonMenu({ children, position }: { children: ReactNode, position?: string, }) {

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

export function SocialMedia({ colors, mediaLinks }: { colors?: string, mediaLinks: SocialLinks }) {
    return (
        <div className="flex gap-5 " role="list">
            <ButtonMedia mediaLinks={mediaLinks.linkedinLink || ''} >
                <IconLinkedIn
                    className="transition duration-300 size-6 max-w-6 group-hover:scale-110 group-hover:text-orange-500"
                /></ButtonMedia>
            <ButtonMedia mediaLinks={mediaLinks.githubLink || ''}>
                <IconGitHub
                    className="transition duration-300 size-6 max-w-6 group-hover:scale-110 group-hover:text-orange-500"
                /></ButtonMedia>
            <ButtonMedia
                mediaLinks={mediaLinks.discordLink || ""}>
                <IconDiscord
                    className="transition duration-300 size-6 max-w-6 group-hover:scale-110 group-hover:text-orange-500"
                /></ButtonMedia>
        </div>
    )
}
function ButtonMedia({ children, mediaLinks, colors }: { mediaLinks: string, colors?: string, children: any }) {
    return (
        <>
            {
                mediaLinks ? (
                    <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={mediaLinks}
                        className={`p-2 border-fondo-claro border transition rounded cursor-pointer  opacity-90 group hover:opacity-100 ${colors || 'bg-fondo hover:bg-fondo-claro'}`}
                    >
                        {children}
                    </a>
                ) :
                    (
                        <ButtonNoRed >
                            {children}
                        </ButtonNoRed>
                    )
            }


        </>
    )
}

function ButtonNoRed({ children }: { children: React.ReactNode }) {
    const notify = () => toast('El usuario no tiene esta red vinculada', {
        icon: <IconAlert className='size-10 min-w-10 text-secondary' />
    });

    return (
        <article>

            <button
                type="button"
                onClick={notify}
                className={`p-2 border-fondo-claro border transition rounded cursor-pointer  opacity-90 group hover:opacity-100 bg-fondo hover:bg-fondo-claro`}
            >
                {children}
            </button>
            <ToastPage />
        </article>
    )
}