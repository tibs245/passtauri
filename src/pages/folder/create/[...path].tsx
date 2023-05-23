import { Button, Heading, Icon, Stack, Spacer } from "@chakra-ui/react"
import { FiXCircle } from "react-icons/fi"
import FolderForm from "@/components/FolderForm"
import { useRouter } from "next/router"
import { PassFolder } from "@/types/file"
import { useCreatePasswordFolder } from "@/hooks/folder"
import { useToastError, useToastSuccess } from "@/components/Toast"
import { isTauriError } from "@/utils"
import { TauriError } from "@/types/tauriError"

export default function FolderCreateForm() {
    const toastSuccess = useToastSuccess();
    const toastError = useToastError();
    const router = useRouter();
    const defaultPath = router.query.path as string[] ?? [];

    const { trigger: triggerCreateFolder, isMutating: isCreatePasswordFolderMutating } = useCreatePasswordFolder();
    const goBack = () => {
        router.push('/');
    }

    const handleCreateFolder = async ({ path, filename, encryptKeysId }: PassFolder) => {
        try {
            await triggerCreateFolder({ path: path + '/' + filename, keys: (encryptKeysId ?? []) });
            toastSuccess({ title: `Folder «${filename}» is created` });
            router.push('/')
        } catch (error: unknown) {
            if (isTauriError(error)) {
                toastError({ title: `Error on update of «${filename}» folder`, description: `${(error as TauriError)?.message}` })
            } else {
                console.error({ error })
            }
        }
    }

    const defaultFolder: PassFolder = {
        path: (process.env.NEXT_PUBLIC_PASSWORD_STORE ?? '') + '/' + (defaultPath?.length ? [...defaultPath, ''].join('/') : ""),
        filetype: "DIRECTORY",
        filename: "",
    }

    return <>
        <Stack direction="row">
            <Heading>New folder</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiXCircle} />} colorScheme="red" variant="ghost" onClick={goBack}>Cancel</Button>
        </Stack>
        <FolderForm folderFile={defaultFolder} isMutating={isCreatePasswordFolderMutating} onSubmit={handleCreateFolder} onCancel={goBack} />
    </>
}