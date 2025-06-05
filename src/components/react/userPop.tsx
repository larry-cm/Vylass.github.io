export default function UserPop({userName,userImg}:{userName:string,userImg:string}) {
    return (
        <picture className="flex items-center justify-center cursor-pointer">
            <img
                slot="svg"
                loading="eager"
                width={24}
                height={24}
                src={userImg ?? "/logo.svg"}
                className="cursor-pointer size-5 scale-150 rounded-full"
                alt="foto de perfil del usuario de la sección del aside del usuario"
                title="foto de perfil del usuario de la sección del aside del usuario"
            />
            <div
                role="tooltip"
                className="absolute invisible sm:translate-x-4 inline-block w-64 text-sm text-slate-900 transition-opacity duration-300 bg-white border border-slate-300 rounded shadow-sm opacity-0 dark:text-slate-100 dark:bg-[#1a1a1a] cursor-default z-30"
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <a
                            href="#main"
                            aria-labelledby={`foto del usuario ${userName}`}
                            aria-label={`usuario asignado ${userName}`}
                        >
                            <img
                                loading="eager"
                                width={100}
                                height={100}
                                className="w-10 h-10 rounded-full"
                                src={userImg ?? "no-tengo-foto"}
                                alt="una foto del perfil del usuario para el menu aside"
                                title="foto del perfil del usuario en el menu aside"
                            />
                        </a>
                        <menu className="flex gap-x-2">
                            <a
                                href="#info-config"
                                className="order-2 flex items-center gap-2 text-orange-700 bg-orange-100 hover:bg-orange-200 font-medium rounded text-xs px-3 py-1.5 dark:bg-orange-100 dark:hover:bg-orange-500 dark:text-orange-400 border border-orange-500 transition-colors cursor-pointer"
                                title="Ir a configuración"
                                aria-label="Ir a la sección de configuración"
                                aria-describedby="Enlace para acceder a la configuración del usuario"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"></path>
                                    <path
                                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                                    ></path>
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                </svg>
                            </a>

                            <button
                                type="button"
                                title="Cerrar sesión"
                                className="updateDetails px-3 py-1.5 rounded border border-red-600 dark:border-slate-700 bg-red-100 hover:bg-red-200 dark:hover:bg-red-900 text-red-500 hover:text-red-700 transition-colors flex items-center justify-center cursor-pointer"
                            >
                                <svg
                                    className="size-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <title>
                                        boton para el cierre de la sesión
                                    </title>
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"></path>
                                    <path
                                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                                    ></path>
                                    <path d="M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                    ></path>
                                </svg>
                            </button>

                            <DialogCierre />
                        </menu>
                    </div>
                    <p
                        className="text-base font-semibold leading-none text-gray-900 dark:text-white"
                    >
                        <a
                            href={urlGitHub ?? "#main"}
                            aria-label={`Perfil de GitHub de ${userNameComplete ?? "nombre del usuario"}`}
                            aria-labelledby="GitHub-username"
                        >{userNameComplete ?? "nombre del usuario"}</a
                        >
                    </p>
                    <p className="mb-3 text-sm font-normal">
                        <a
                            href={urlLinkedIn ?? "#main"}
                            aria-label={`Perfil de LinkedIn de ${userName ?? "nombre del usuario"}`}
                            aria-labelledby="LinkedIn-username"
                            className="hover:underline underline-offset-2"
                        >@{
                                userName ??
                                "no tengo nombre del usuario para LinkedIn"
                            }</a
                        >
                    </p>
                    <p className="mb-4 text-sm">
                        {
                            userOccupation ??
                            "Open-source contributor. Building "
                        }<a
                            href={urlLinkedIn ?? "#main"}
                            aria-label="Enlace al perfil de LinkedIn del usuario"
                            aria-labelledby="LinkedIn-profile-link"
                            className="text-orange-700 dark:text-orange-500 underline-offset-2 hover:underline"
                        >LinkedIn del usuario</a
                        >.
                    </p>
                </div>
                <div data-popper-arrow></div>
            </div>
        </picture>
    )
}