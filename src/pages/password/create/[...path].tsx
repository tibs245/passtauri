import { useCreatePassword } from "@/hooks/password"
import { Password } from "@/types/password"
import { Button, Heading, Icon, Stack, Spacer } from "@chakra-ui/react"
import { FiXCircle } from "react-icons/fi"
import PasswordForm from "@/components/PasswordForm"
import { useRouter } from "next/router"
import { isTauriError } from "@/utils"
import { useToastError, useToastSuccess } from "@/components/Toast"
import { TauriError } from "@/types/tauriError"

export default function PasswordEditionForm() {
    const router = useRouter();
    const toastSuccess = useToastSuccess();
    const toastError = useToastError();
    const defaultPath = router.query.path as string[] ?? [];

    const { trigger: triggerCreatePassword, isMutating: isCreatePasswordMutating } = useCreatePassword();

    const goBack = () => {
        router.push('/');
    }

    const handleCreatePassword = async (password: Password) => {
        try {
            const pathToSave = process.env.NEXT_PUBLIC_PASSWORD_STORE + '/' + defaultPath.join('/') + password.name + '.gpg'
            await triggerCreatePassword({ ...password, path: pathToSave });
            toastSuccess({ title: `Password «${password.name}» is created` });
            router.push('/password/view' + pathToSave);
        } catch (error: unknown) {
            if (isTauriError(error)) {
                toastError({ title: `Error on create of «${password.name}» password`, description: `${(error as TauriError)?.message}` })
            } else {
                console.error({ error })
            }
        }
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