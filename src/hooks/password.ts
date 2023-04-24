import useSWR from 'swr'
import { TauriFetcher } from '@/hooks/config'
import { FileDto } from '@/types/file'
import { Password } from '@/types/password'

export const useListPassword = (path = "", options = {}) => useSWR<FileDto[], String>({ command: 'list_password_path', args: { path: process.env.NEXT_PUBLIC_PASSWORD_STORE + path } }, TauriFetcher, options)

export const useSearchPassword = (path = "", search = "", options = {}) => useSWR<FileDto[], String>({ command: 'search_password', args: { path: process.env.NEXT_PUBLIC_PASSWORD_STORE + path, search } }, TauriFetcher, options)

export const usePassword = (passwordPath: string | null, options = {}) => {
    return useSWR<Password, String>(
        passwordPath ? { command: 'read_password', args: { passwordPath } } : null,
        TauriFetcher,
        { revalidateIfStale: false, revalidateOnMount: true, revalidateOnFocus: false, revalidateOnReconnect: false, ...options })
}
