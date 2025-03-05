import { useState, useEffect } from "react";
import FieldBTNS from "../react/FieldBtns";

interface User {
    user_id: number;
    user_name: string;
    user_last_name: string;
    user_date: Date;
}
export default function UsersTable() {
    const [usuarios, setUsuarios] = useState<User[]>([])
    const refreshTable = async () => {
        const data_users = await fetch(`/api/getUsers`)
        const { response } = await data_users.json()
        setUsuarios(() => {
            response.map((e: User) => e.user_date = new Date(e.user_date))
            return response
        })
    }

    useEffect(() => {
        refreshTable()
    }, [])
    return (
        <>
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Fecha</th>
                        <th>Editar</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        usuarios && (
                            usuarios?.map(
                                ({ user_id, user_name, user_last_name, user_date }) => (
                                    <tr key={user_id} className="*:h-10 hover:bg-slate-200 hover:text-black transition-colors">
                                        <td>{user_id}</td>
                                        <td>{user_name}</td>
                                        <td>
                                            <div className="flex items-center justify-between">
                                                {user_last_name}

                                            </div>
                                        </td>
                                        <td >
                                            {user_date?.toDateString()}
                                        </td>
                                        <td className="relative">
                                            <FieldBTNS id={user_id} onSuccess={refreshTable} />
                                        </td>
                                    </tr>
                                )
                            )
                        )
                    }
                </tbody>

            </table >

        </>



    )
}