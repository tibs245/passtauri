import { Button, Heading, Icon, Stack, Spacer } from "@chakra-ui/react"
import { FiXCircle } from "react-icons/fi"
import FolderForm from "@/components/FolderForm"
import { useRouter } from "next/router"
import { PassFolder } from "@/types/file"
import { useUpdatePasswordFolder, useFolder } from "@/hooks/folder"
import { useToastError, useToastSuccess } from "@/components/Toast"
import { isTauriError } from "@/utils"
import { TauriError } from "@/types/tauriError"
import Loading from "@/components/Loading"

export default function FolderUpdateForm() {
    const toastSuccess = useToastSuccess();
    const toastError = useToastError();
    const router = useRouter();
    const defaultPath = router.query.path as string[] ?? [];
    const { data: folder, isValidating, error } = useFolder(defaultPath.length ? '/' + defaultPath.join('/') : "");

    const { trigger: triggerUpdateFolder, isMutating: isUpdatePasswordFolderMutating } = useUpdatePasswordFolder('/' + defaultPath.join('/'));
    const goBack = () => {
        router.push('/');
    }

    const handleUpdateFolder = async ({ path, filename, encryptKeysId, hasParentKeys }: PassFolder) => {
        try {
            await triggerUpdateFolder({ newPath: [path, filename].join('/'), keys: (encryptKeysId ?? []), hasParentKeys });
            toastSuccess({ title: `Folder «${filename}» is Updated` });
            router.push('/')
        } catch (error: unknown) {
            if (isTauriError(error)) {
                toastError({ title: `Error on update of «${filename}» folder`, description: `${(error as TauriError)?.message}` })
            } else {
                console.error({ error })
            }
        }
    }
    return <>
        <Stack direction="row">
            <Heading>Update folder {folder?.filename}</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiXCircle} />} colorScheme="red" variant="ghost" onClick={goBack}>Cancel</Button>
        </Stack>
        {isValidating || folder === undefined ?
            <Loading /> :
            <FolderForm folderFile={folder} isMutating={isUpdatePasswordFolderMutating} onSubmit={handleUpdateFolder} onCancel={goBack} />
        }
    </>
}