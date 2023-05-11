import { Button, Heading, Icon, Stack, Spacer } from "@chakra-ui/react"
import { FiXCircle } from "react-icons/fi"
import FolderForm from "@/components/FolderForm"
import { useRouter } from "next/router"
import { PassFolder } from "@/types/file"
import { useCreatePasswordFolder } from "@/hooks/folder"

export default function FolderCreateForm() {
    const router = useRouter();
    const defaultPath = router.query.path as string[] ?? [];

    const { trigger: triggerCreateFolder, isMutating: isCreatePasswordFolderMutating } = useCreatePasswordFolder();
    const goBack = () => {
        router.push('/');
    }

    const handleCreateFolder = async ({ path, filename, encryptKeysId }: PassFolder) => {
        try {
            await triggerCreateFolder({ path: path + '/' + filename, keys: (encryptKeysId ?? []) });
        } catch (error) {
            console.log({ error })
        }
        router.push('/')
    }

    const defaultFolder: PassFolder = {
        path: defaultPath.join('/'),
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