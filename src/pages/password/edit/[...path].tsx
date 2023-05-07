import { useDeletePassword, usePassword, useUpdatePassword } from "@/hooks/password"
import { Password } from "@/types/password"
import { Button, Flex, Heading, Icon, Spinner, Stack, Spacer, Text } from "@chakra-ui/react"
import { FiTrash2, FiXCircle } from "react-icons/fi"
import PasswordForm from "@/components/PasswordForm"
import { useRouter } from "next/router"
import { useMemo } from "react"
import Link from "next/link"

export default function PasswordEditionForm() {
    const router = useRouter();
    const passwordQuery = router.query.path as string[] ?? [];

    const filename = useMemo(() => passwordQuery[passwordQuery.length - 1]?.replace('.gpg', ''), [passwordQuery])
    const passwordPath = useMemo(() => '/' + passwordQuery.join('/'), [passwordQuery])

    const { data: password, isLoading, error } = usePassword(passwordPath)
    const { trigger, isMutating } = useDeletePassword(passwordPath);

    const { trigger: triggerUpdatePassword, isMutating: isUpdatePasswordMutating } = useUpdatePassword(passwordPath);

    const goBack = () => router.push(`/password/view${passwordPath}`)

    const handleUpdatePassword = async (password: Password) => {
        await triggerUpdatePassword(password);
        goBack()
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
