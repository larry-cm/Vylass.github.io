import type React from "react";

interface ActionProps {
    type?: HTMLButtonElement["type"];
    children?: React.ReactNode;
    izquierda?: boolean;
    text: string;
}
export default function Action({ type = "submit", text = "Registrarse", izquierda, children }: ActionProps) {
    return (
        <button
            type={type}
            className="w-full flex gap-x-2 items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors cursor-pointer"
        >
            {izquierda && children && children}
            {text}{children && !izquierda && children}
        </button>
    );
}
