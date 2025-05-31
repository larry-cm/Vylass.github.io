import type { InputsErrors } from "@/types/type"

export function validatePassword({ verificar, yesNumbers }: { verificar: string, yesNumbers?: boolean }) {
    const isUndefined = (callback: boolean) => verificar.length === 0 ? undefined : callback

    const validations = {
        size: () => isUndefined(verificar.length <= 8),
        containSpecialCharacter: () => isUndefined(yesNumbers ? /[^a-zA-Z0-9\ ]+/.test(verificar) : /[^a-zA-Z\ ]+/.test(verificar)),
        initialNumber: () => isUndefined(/^\d/.test(verificar))
    }
    return validations
}

export function cleanState(state: () => void): void {
    setTimeout(() => {
        state()
    }, 5000)
}

export function salidaInputsErrors(errorInput: InputsErrors): string {
    if (errorInput.size) return "La contraseña debe tener al menos 8 caracteres";
    if (errorInput.initialNumber) return "No puedes comenzar con números";
    if (errorInput.containSpecialCharacter) return "No se permiten caracteres especiales";
    return "Por favor verifica que todos los campos cumplan con los requisitos indicados";
}
