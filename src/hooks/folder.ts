import useSWRMutation from 'swr/mutation'
import { TauriFetcher, TauriFetcherArgs } from '@/hooks/config'
import useSWR, { SWRConfiguration, useSWRConfig } from "swr";
import { PassFile, PassFolder } from '@/types/file';
import { TauriError } from '@/types/tauriError';


export const useFolder = (path: string, options = {}) => useSWR<PassFolder, TauriError>(
    { _key: "get_folder", command: 'get_folder', args: { path } },
    TauriFetcher,
    options
)

export const useTreeFolder = (options: SWRConfiguration<PassFolder[], TauriError> = {}) => 
    useSWR<PassFolder[], TauriError>(
        { _key: "list_password_path", command: 'get_folder_tree', args: { path: process.env.NEXT_PUBLIC_PASSWORD_STORE } },
        TauriFetcher,
        options
    )

export type PassFolderParams = {
    path: string;
    keys: string[];
};

export const useCreatePasswordFolder = (options = {}) => {
    const { mutate } = useSWRConfig()

    return useSWRMutation<null, TauriError, TauriFetcherArgs, PassFolderParams>(
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

export type PassFolderUpdateParams = {
    newPath: string;
    keys: string[];
};

export const useUpdatePasswordFolder = (path: string, options = {}) => {
    const { mutate } = useSWRConfig()

    return useSWRMutation<null, TauriError, TauriFetcherArgs, PassFolderUpdateParams>(
        { command: 'update_pass_folder', args: { actualPath: path } },
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

    return useSWRMutation<null, TauriError, TauriFetcherArgs | null>(
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
