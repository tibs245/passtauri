import { useCreatePassword } from "@/hooks/password"
import { Password } from "@/types/password"
import { Button, Heading, Icon, Stack, Spacer } from "@chakra-ui/react"
import { FiXCircle } from "react-icons/fi"
import PasswordForm from "@/components/PasswordForm"
import { useRouter } from "next/router"

export default function PasswordEditionForm() {
    const router = useRouter();
    const defaultPath = router.query.path as string[] ?? [];

    const { trigger: triggerCreatePassword, isMutating: isCreatePasswordMutating } = useCreatePassword();

    const goBack = () => {
        router.push('/');
    }

    const handleCreatePassword = async (password: Password) => {
        const pathToSave = (process.env.NEXT_PUBLIC_PASSWORD_STORE ?? '') + '/' + defaultPath.join('/') + '/' + password.name + '.gpg'
        await triggerCreatePassword({ ...password, path: pathToSave });
        router.push('/password/view/' + pathToSave);
    }

    return <>
        <Stack direction="row">
            <Heading>New password</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiXCircle} />} colorScheme="red" variant="ghost" onClick={goBack}>Cancel</Button>
        </Stack>
        <PasswordForm isMutating={isCreatePasswordMutating} onSubmit={handleCreatePassword} onCancel={goBack} />
    </>
}