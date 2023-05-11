import useSWRMutation from 'swr/mutation'
import { TauriFetcher, TauriFetcherArgs } from '@/hooks/config'
import useSWR, { useSWRConfig } from "swr";
import { ActionResult } from '@/types/actionResult'
import { PassFile, PassFolder } from '@/types/file';
import { TauriError } from '@/types/tauriError';

export const useTreeFolder = (options = {}) => useSWR<PassFolder[], TauriError>(
    { _key: "list_password_path", command: 'get_folder_tree', args: { path: process.env.NEXT_PUBLIC_PASSWORD_STORE } },
    TauriFetcher,
    options
)


export type PassFileParams = {
    path: string;
    keys: string[];
};

export const useCreatePasswordFolder = (options = {}) => {
    const { mutate } = useSWRConfig()

    return useSWRMutation<ActionResult, ActionResult, TauriFetcherArgs, PassFileParams>(
        { command: 'init_pass_folder', args: {} },
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

export const useDeletePasswordFolder = (folderPath: string | null, options = {}) => {
    const { mutate } = useSWRConfig()

    return useSWRMutation<ActionResult, ActionResult, TauriFetcherArgs | null>(
        folderPath ? { command: 'delete_password_folder', args: { folderPath } } : null,
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
