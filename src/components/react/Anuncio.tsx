import { useEffect } from "react";

export const IconInfo = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v4" /><path d="M12 16v.01" /> </svg >
const IconoAlert = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>

export function Anuncio({ errorMsgInitial, cleanMsg }: { errorMsgInitial: string, cleanMsg: () => void }) {
    useEffect(() => {
        cleanMsg()
    }, [])

    return (
        <div className="absolute top-13 sm:top-1/12 left-0 right-0 flex flex-col justify-center items-center max-w-[40rem] h-26 mx-4 px-4 sm:mx-auto bg-orange-500/60 before:content-[''] before:size-full before:bg-black/20 before:absolute ">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2 flex justify-center items-center">
                ¡Ups! Ha ocurrido un error
                <span className="ms-2">{errorMsgInitial.match('error con la conexión a la base de datos') ? <IconoAlert /> : <IconInfo />}</span>
            </h4>
            <p className="text-slate-100 block font-medium text-base sm:text-lg self-start">{errorMsgInitial}</p>
        </div>
    )
}