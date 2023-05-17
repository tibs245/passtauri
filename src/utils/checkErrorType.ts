import { TauriError } from "@/types/tauriError"

export const isTauriError = (error: unknown) => {
    if (
        typeof error === 'object' && typeof (error as TauriError).message === 'string' &&
        typeof (error as TauriError).errorType === 'string'
    ) {
        return true
    }
    return false
}