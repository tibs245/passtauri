import { useCreatePassword } from "@/hooks/password"
import { Password } from "@/types/password"
import { Button, Flex, Heading, Icon, Spinner, Stack, Spacer, Text } from "@chakra-ui/react"
import { FiXCircle } from "react-icons/fi"
import PasswordForm from "@/components/PasswordForm"

export type PasswordHeaderProps = {
    defaultPath: string
    onCreatePassword?: (path: string, newName: string) => void
    onCancel?: () => void
}

export default function PasswordEditionForm({ defaultPath, onCreatePassword, onCancel }: PasswordHeaderProps) {
    const { trigger: triggerCreatePassword, isMutating: isCreatePasswordMutating } = useCreatePassword();

    const handleCreatePassword = async (password: Password) => {
        const pathToSave = process.env.NEXT_PUBLIC_PASSWORD_STORE + defaultPath + '/' + password.name + '.gpg'
        await triggerCreatePassword({ ...password, passwordPath: pathToSave });
        onCreatePassword?.(pathToSave, password.name)
    }

    return <>
        <Stack direction="row">
            <Heading>Nouveau mot de passe</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiXCircle} />} colorScheme="red" variant="ghost" onClick={onCancel}>Annuler</Button>
        </Stack>
        <PasswordForm isMutating={isCreatePasswordMutating} onSubmit={handleCreatePassword} onCancel={onCancel} />
    </>
}