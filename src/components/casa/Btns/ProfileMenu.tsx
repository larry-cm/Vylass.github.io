import { Menu, Button, Card, Avatar, Typography, } from "@material-tailwind/react";
import { Settings, PageEdit, LogIn, User, Linkedin } from 'iconoir-react'

export function MToolTip({ children, label }: { children?: React.ReactNode, label?: string }) {
    return (
        <Button as='a' target="_blank" href='#main' className="relative group  p-1 rounded " color='primary' variant="outline">
            {children && children}
            <div className=" absolute bottom-4 left-1/2 z-10 mb-6 -translate-x-1/2 rounded bg-gray-800 py-1 px-2 text-sm text-nowrap text-white hover:text-orange-700 hover:opacity-0 opacity-0 group-hover:text-orange-700 group-hover:opacity-100 hidden group-hover:block">
                {label || 'Tania Andrew'}
                <div className=" absolute top-full left-1/2 -z-10 h-0 w-0 -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
            </div>
        </Button>
    )
}
export function ProfileMenu({ userImg, userName }: { userImg: string, userName: string }) {
    return (
        <Menu placement="right" >
            <Menu.Trigger
                as={Button}
                variant="outline">
                open
            </Menu.Trigger>

            <Menu.Content className=" z-50 rounded p-0 border-none">
                <Card className="max-w-[24rem] rounded border border-slate-300 shadow-sm overflow-visible bg-black p-2">

                    <Card.Header className='min-w-48'>
                        <Avatar src={userImg || ""} alt="logo del usuario del popover"></Avatar>
                        <Typography className="mt-[1lh]" color="primary" type='lead'>{userName || 'Nombre del usuario'}</Typography>
                        <Typography color="primary" type="small">@{userName || 'dirección de LinkedIn'}</Typography>
                    </Card.Header>

                    <Card.Footer className="mt-4 flex items-center justify-between">
                        <div className="flex items-center -space-x-3">

                            <MToolTip label="LinkedIn" children={(<Linkedin />)}></MToolTip>

                        </div>
                        <Typography type="small">Ver mas...</Typography>
                    </Card.Footer>
                </Card>
            </Menu.Content>
        </Menu >
    );
}
