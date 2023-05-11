import { Button, Heading, Icon, Stack, Spacer } from "@chakra-ui/react"
import { FiXCircle } from "react-icons/fi"
import FolderForm from "@/components/FolderForm"
import { useRouter } from "next/router"
import { PassFolder } from "@/types/file"

export default function FolderCreateForm() {
    const router = useRouter();
    const defaultPath = router.query.path as string[] ?? [];

    const goBack = () => {
        router.push('/');
    }

    const handleCreateFolder = async (folder: PassFolder) => {
        // const pathToSave = (process.env.NEXT_PUBLIC_PASSWORD_STORE ?? '') + '/' + defaultPath.join('/') + '/' + password.name + '.gpg'
        // await triggerCreateFolder({ ...password, passwordPath: pathToSave });
        // router.push('/password/view/' + pathToSave)
        console.log({ folder })
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
        <FolderForm folderFile={defaultFolder} isMutating={false} onSubmit={handleCreateFolder} onCancel={goBack} />
    </>
}