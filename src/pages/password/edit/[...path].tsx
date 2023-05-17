import { useDeletePassword, usePassword, useUpdatePassword } from "@/hooks/password"
import { Password } from "@/types/password"
import { Button, Flex, Heading, Icon, Spinner, Stack, Spacer, Text } from "@chakra-ui/react"
import { FiTrash2, FiXCircle } from "react-icons/fi"
import PasswordForm from "@/components/PasswordForm"
import { useRouter } from "next/router"
import { useMemo } from "react"
import Link from "next/link"
import { useToastError, useToastSuccess } from "@/components/Toast"
import { TauriError } from "@/types/tauriError"
import { isTauriError } from "@/utils"

export default function PasswordEditionForm() {
    const toastSuccess = useToastSuccess();
    const toastError = useToastError();
    const router = useRouter();
    const passwordQuery = useMemo(() => router.query.path as string[] ?? [], [router.query.path]);

    const filename = useMemo(() => passwordQuery[passwordQuery.length - 1]?.replace('.gpg', ''), [passwordQuery])
    const passwordPath = useMemo(() => '/' + passwordQuery.join('/'), [passwordQuery])

    const { data: password, isLoading, error } = usePassword(passwordPath)
    const { trigger, isMutating } = useDeletePassword(passwordPath);

    const { trigger: triggerUpdatePassword, isMutating: isUpdatePasswordMutating } = useUpdatePassword(passwordPath);

    const goBack = () => router.push(`/password/view${passwordPath}`)

    const handleUpdatePassword = async (password: Password) => {
        try {
            await triggerUpdatePassword(password);
            toastSuccess({ title: `Password «${password.name}» is updated` });
            goBack()
        } catch (error: unknown) {
            if (isTauriError(error)) {
                toastError({ title: `Error on update of «${password.name}» password`, description: `${(error as TauriError)?.message}` })
            } else {
                console.error({ error })
            }
        }
    }

    const handleDeletePassword = () => {
        trigger()
        router.push("/")
    }


    if (error) {
        return <Text fontSize="xl">{error.message}</Text>
    }
    if (isLoading || !password) {
        return <Flex alignItems="center" justifyContent="center" marginTop={20}>
            <Spinner size="lg" />
        </Flex>
    }

    return <>
        <Stack direction="row">
            <Heading>{filename}</Heading>
            <Spacer />
            <Button as={Link} leftIcon={<Icon as={FiXCircle} />} colorScheme="red" variant="ghost" href={`/password/view${passwordPath}`}>Cancel</Button>
            <Button leftIcon={<Icon as={FiTrash2} />} colorScheme="red" onClick={handleDeletePassword} isLoading={isMutating}>Delete</Button>
        </Stack>
        <PasswordForm passwordDetails={password} isMutating={isUpdatePasswordMutating} onSubmit={handleUpdatePassword} onCancel={goBack} />
    </>
}
