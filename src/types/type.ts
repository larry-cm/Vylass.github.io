export interface InputsUse {
    id: string,
    autocomplete: string,
    valueInput?: string,
    etiqueta?: string,
    label: string,
    type?: React.HTMLInputTypeAttribute,
    title: string,
    placeH: string,
    required?: boolean,
    pattern?: string,
    minL?: number,
    inputs?: { textos: { li?: string[], title?: string[] }, options?: boolean[] },
    children?: React.ReactNode,
    callErrors?: { sendErrorChild: () => void, resetErrorChild: () => void }
}

export interface InputsErrors {
    size: boolean | undefined;
    containSpecialCharacter: boolean | undefined;
    initialNumber: boolean | undefined;
}
export interface ActionProps {
    type?: HTMLButtonElement["type"];
    children?: React.ReactNode;
    izquierda?: boolean;
    text: string;
}