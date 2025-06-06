import { Button, Card, Typography } from "@material-tailwind/react";
import { Settings, HomeSimpleDoor, LogIn, User, IconoirProvider } from 'iconoir-react'

function AsideItem({ children, href, label }: { children?: React.ReactNode, href: string, label: string }) {
    return (
        <Button
            as="a"
            href={href || "info-general"}
            color='secondary'
            variant="ghost"
            className="relative shadow-none w-auto justify-start md:w-48 group p-0.5 sm:p-2 rounded text-nowrap hover:bg-orange-100 dark:hover:bg-orange-300/15"
        >
            {children && children}
            <Typography className="hidden text-base md:inline-block" as='span' >{label}</Typography>
        </Button>
    )
}

export function MenuAside() {
    return (
        <IconoirProvider
            iconProps={{
                strokeWidth: 1.5,
                width: '20px',
                height: '20px',
            }}>
            <menu className="flex flex-col justify-center w-full gap-2">
                <AsideItem href="#info-general" label="Información general">
                    <HomeSimpleDoor className="md:mr-2 " />
                </AsideItem>
                <AsideItem href="#info-user" label="Datos del usuario">
                    <User className="md:mr-2 " />
                </AsideItem>
                <AsideItem href="#info-config" label="Configuración">
                    <Settings className="md:mr-2 " />
                </AsideItem>
            </menu>
            <div>
                <Card
                    className="hidden p-2 shadow-md md:block sm:p-6 max-w-48 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500"
                >
                    <Typography
                        color="primary"
                        as="strong"
                        type="h5"
                        className="mb-[1lh]">Nuestros Avances
                    </Typography>
                    <Typography
                        color="primary"
                        as="p"
                        type="small"
                        className="text-balance">
                        Estamos trabajando para una pagina web en donde puedan
                        ver la información con la que se registraron y manejarla
                        desde la interfaz del dashboard
                    </Typography>
                </Card>
                <Button
                    variant="ghost"
                    color="error"
                    className="openDialog w-auto justify-start md:w-48 p-0.5 sm:p-2 mt-2 sm:mt-6 rounded text-nowrap text-red-500 hover:text-red-600 cursor-pointer">
                    <LogIn className="md:mr-2 " />
                    <Typography
                        as="span"
                        className="hidden text-base md:inline-block">
                        Cerrar sesión</Typography>
                </Button>
            </div>
        </IconoirProvider>

    )



}
