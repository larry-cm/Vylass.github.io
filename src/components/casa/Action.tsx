interface ActionProps {
    type?: HTMLButtonElement["type"];
    text: string;
}

export default function Action({ type = "submit", text = "Registrarse" }: ActionProps) {
    return (
        <button
            type={type}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors cursor-pointer"
        >
            {text}
        </button>
    );
}
