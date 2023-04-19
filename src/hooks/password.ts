import useSWR from 'swr'
import { TauriFetcher } from '@/hooks/config'

export const useListPassword = () => useSWR<string[]>({ command: 'list_password_path', args: { path: "" } }, TauriFetcher)

