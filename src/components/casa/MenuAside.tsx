import { Button, Card, Avatar, Typography } from "@material-tailwind/react";
import { Settings, HomeSimpleDoor, LogIn, User } from 'iconoir-react'

function AsideItem({ children, href, label }: { children?: React.ReactNode, href: string, label: string }) {
    return (
        <Button
            as="a"
            href={href || "info-general"}
            color='primary'
            variant="ghost"
            className="relative w-auto justify-start md:w-48 group p-0.5 sm:p-2 rounded text-nowrap"
        >
            {children && children}
            <Typography className="hidden md:inline-block text-base" as='span' >{label}</Typography>
        </Button>
    )
}

export function MenuAside() {

    return (
<>
        <menu className="w-full flex flex-col justify-center gap-2">
            <AsideItem href="#info-general" label="Información general">
                <HomeSimpleDoor className="md:mr-2 size-5 min-w-5" />
            </AsideItem>
            <AsideItem href="#info-user" label="Datos del usuario">
                <User className="md:mr-2 size-5 min-w-5" />
            </AsideItem>
            <AsideItem href="#info-config" label="Configuracion">
                <Settings className="md:mr-2 size-5 min-w-5" />
            </AsideItem>

        </menu >
         <div>
         <Card
             className="p-2 hidden md:block sm:p-6 max-w-48 shadow-md bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500"
         >
             <Typography
                 color="secondary"
                 as="strong"
                 type="h5"
                 className="mb-[1lh]">Nuestros Avances</Typography
             >
             <Typography
                 color="secondary"
                 as="p"
                 type="small"
                 className=""
                 >Estamos trabajando para una pagina web en donde puedan
                 ver la informacion con la que se registraron y manejarla
                 desde la interfaz del dashboard</Typography
             >
         </Card>
         <Button
             id="close-session-menu"
             variant="ghost"
             color="error"
             className="w-auto justify-start md:w-48 p-0.5 sm:p-2 mt-2 sm:mt-6 rounded text-nowrap text-red-500 hover:text-red-600 cursor-pointer"
         >
             <LogIn className="md:mr-2 size-5 min-w-5 " />
             <Typography
                 as="span"
                 className="hidden md:inline-block text-base"
                 >Cerrar sesion</Typography
             >
         </Button>
     </div>
</>
    )


}
