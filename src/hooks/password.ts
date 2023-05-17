import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { TauriFetcher, TauriFetcherArgs } from '@/hooks/config'
import { PassFile } from '@/types/file'
import { Password, PasswordWithPath } from '@/types/password'
import { useSWRConfig } from "swr";
import { TauriError } from '@/types/tauriError'

export const useListPassword = (path = "", options = {}) => useSWR<PassFile[], TauriError>(
        { _key: "list_password_path", command: 'list_password_path', args: { path: process.env.NEXT_PUBLIC_PASSWORD_STORE + path } },
        TauriFetcher,
        options
    )

export const useSearchPassword = (path = "", search = "", options = {}) => useSWR<PassFile[], TauriError>(
        { _key: "search_password", command: 'search_password', args: { path: process.env.NEXT_PUBLIC_PASSWORD_STORE + path, search } },
        TauriFetcher,
        options
    )

export const usePassword = (passwordPath: string | null, options = {}) => {
    return useSWR<Password, TauriError>(
        passwordPath ? { _key: "read_password", command: 'read_password', args: { passwordPath } } : null,
        TauriFetcher,
        { revalidateIfStale: false, revalidateOnMount: true, revalidateOnFocus: false, revalidateOnReconnect: false, ...options })
}

export const useDeletePassword = (passwordPath: string | null, options = {}) => {
    const { mutate } = useSWRConfig()

    return useSWRMutation<null, TauriError, TauriFetcherArgs | null>(
        passwordPath ? { command: 'delete_password', args: { passwordPath } } : null,
        TauriFetcher,
        {
            onSuccess: () => {
                mutate((key: any) => key?.command.includes("list_password_path", "search_password"),
                    undefined,
                    { revalidate: true }
                )
            },
            ...options
        })
}

export const useCreatePassword = (options = {}) => {
    const { mutate } = useSWRConfig()

    return useSWRMutation<null, TauriError, TauriFetcherArgs, PasswordWithPath>(
        { command: 'create_password', args: {} },
        TauriFetcher,
        {
            onSuccess: () => {
                mutate((key: any) => key?.command.includes("list_password_path", "search_password"),
                    undefined,
                    { revalidate: true }
                )
            },
            ...options
        })
}

export const useUpdatePassword = (passwordPath: string, options = {}) => {
    const { mutate } = useSWRConfig()

    return useSWRMutation<null, TauriError, TauriFetcherArgs, Password>(
        { command: 'update_password', args: { path: passwordPath } },
        TauriFetcher,
        {
            onSuccess: () => {
                mutate((key: any) => key?.command.includes("list_password_path", "search_password"),
                    undefined,
                    { revalidate: true }
                )
            },
            ...options
        })
}

export type GeneratePasswordParam = {
    size: number;
    listOfCaractere: string;
}

export const useGeneratePassword = (options = {}) => {
    return useSWRMutation<string, string, TauriFetcherArgs, GeneratePasswordParam>(
        { command: 'generate_password', args: {} },
        TauriFetcher,
        options)
}
