import WriteInputContent from "@/components/WriteInputContent";
import { useDeletePassword, usePassword } from "@/hooks/password";
import { Flex, Button, Icon, Stack, Heading, Text, Spacer, Spinner, Input, Textarea, Box, InputGroup } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { FiEdit, FiEye, FiShield, FiTrash2 } from "react-icons/fi";



export default function PasswordViewDetailsPage() {
    const router = useRouter();
    const password = useMemo(() => router.query.path as string[] ?? [], [router.query.path]);

    const [lastPasswordUnlocked, setLastPasswordUnlocked] = useState<undefined | string>();

    const filename = useMemo(() => password[password.length - 1]?.replace('.gpg', ''), [password])
    const passwordPath = useMemo(() => '/' + password.join('/'), [password])
    const isUnlocked = useMemo(() => lastPasswordUnlocked === passwordPath, [passwordPath, lastPasswordUnlocked])

    const { trigger, isMutating } = useDeletePassword(passwordPath);

    const handleDeletePassword = () => {
        trigger()
        router.push('/');
    }

    return <>
        <Stack direction="row">
            <Heading>{filename}</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiShield} fill="white" />} colorScheme="green" visibility={isUnlocked ? 'visible' : 'hidden'} onClick={() => setLastPasswordUnlocked(undefined)}>Lock</Button>
            <Button as={Link} leftIcon={<Icon as={FiEdit} />} colorScheme="gray" isDisabled={!isUnlocked} href={`/password/edit${passwordPath}`}>Modifier</Button>
            <Button leftIcon={<Icon as={FiTrash2} />} colorScheme="red" onClick={handleDeletePassword} isLoading={isMutating}>Supprimer</Button>
        </Stack >
        {
            isUnlocked ?
                <PasswordDetails passwordPath={passwordPath} />
                :
                <Flex alignItems="center" justifyContent="center" marginTop={20}>
                    <Stack>
                        <Icon as={FiShield} color="brand.800" fill="gray.300" boxSize="3xs" margin="auto" />
                        <Button leftIcon={<Icon as={FiEye} fill="white" fillOpacity={0.15} />} colorScheme="brand" size="lg" onClick={() => setLastPasswordUnlocked(passwordPath)}>
                            Déchiffrer les données
                        </Button>
                    </Stack>
                </Flex >
        }
    </>
}

type PasswordDetailsProps = {
    passwordPath: string;
};

function PasswordDetails({ passwordPath }: PasswordDetailsProps) {
    const { data: password, isLoading, error } = usePassword(passwordPath)

    if (error) {
        return <Text fontSize="xl">{error?.message}</Text>
    }

    if (isLoading) {
        return <Flex alignItems="center" justifyContent="center" marginTop={20}>
            <Spinner size="lg" />
        </Flex>
    }

    return <Stack spacing={5}>
        <Box>
            <Text>Password</Text>
            <InputGroup>
                <Input value={password?.password} isReadOnly />
                <WriteInputContent content={password?.password || 'error'} />
            </InputGroup>
        </Box>
        <Box>
            <Text>Username</Text>
            <InputGroup>
                <Input value={password?.username ?? ''} isReadOnly />
            </InputGroup>
        </Box>
        <Box>
            <Text>Extra information</Text>
            <Textarea value={password?.extra ?? ''} isReadOnly />
        </Box>
    </Stack>
}

