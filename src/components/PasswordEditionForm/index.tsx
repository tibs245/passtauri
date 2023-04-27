import { useDeletePassword, usePassword, useUpdatePassword } from "@/hooks/password"
import { FileDto } from "@/types/file"
import { Password } from "@/types/password"
import { Button, Flex, Heading, Icon, Spinner, Stack, Spacer, Text } from "@chakra-ui/react"
import { FiTrash2, FiXCircle } from "react-icons/fi"
import PasswordForm from "@/components/PasswordForm"

export type PasswordHeaderProps = {
    passwordFile: FileDto,
    onDeletePassword?: () => void
    onUpdatePassword?: (newName: string) => void
    onCancel?: () => void
}

export default function PasswordEditionForm({ passwordFile, onUpdatePassword, onDeletePassword, onCancel }: PasswordHeaderProps) {
    const { data: password, isLoading, error } = usePassword(passwordFile.path)
    const { trigger, isMutating } = useDeletePassword(passwordFile.path);

    const { trigger: triggerUpdatePassword, isMutating: isUpdatePasswordMutating } = useUpdatePassword(passwordFile.path);

    const handleUpdatePassword = async (password: Password) => {
        await triggerUpdatePassword(password);
        onUpdatePassword?.(password.name)
    }

    const handleDeletePassword = () => {
        trigger()
        onDeletePassword?.();
    }


    if (error) {
        return <Text fontSize="xl">{error}</Text>
    }
    if (isLoading || !password) {
        return <Flex alignItems="center" justifyContent="center" marginTop={20}>
            <Spinner size="lg" />
        </Flex>
    }

    return <>
        <Stack direction="row">
            <Heading>{passwordFile.filename}</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiXCircle} />} colorScheme="red" variant="ghost" onClick={onCancel}>Annuler</Button>
            <Button leftIcon={<Icon as={FiTrash2} />} colorScheme="red" onClick={handleDeletePassword} isLoading={isMutating}>Supprimer</Button>
        </Stack>
        <PasswordForm passwordDetails={password} isMutating={isUpdatePasswordMutating} onSubmit={handleUpdatePassword} onCancel={onCancel} />
    </>
}
