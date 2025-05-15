import type { InputsErrors } from "@components/react/Form";

export function validatePassword({ verificar }: { verificar: string }) {
    const validations = {
        size: () => verificar.length === 0 ? undefined : verificar.length <= 8,
        containSpecialCharacter: () => verificar.length === 0 ? undefined : /[!~#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/.test(verificar),
        initialNumber: () => verificar.length === 0 ? undefined : /^\d/.test(verificar)
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