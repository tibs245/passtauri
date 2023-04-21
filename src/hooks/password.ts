import useSWR from 'swr'
import { TauriFetcher } from '@/hooks/config'
import { FileDto } from '@/types/file'

export const useListPassword = (path = "") => useSWR<FileDto[], String>({ command: 'list_password_path', args: { path } }, TauriFetcher)

