import { usePassword } from "@/hooks/password";
import { FileDto } from "@/types/file";
import { Flex, FlexProps, Button, Icon, Stack, Heading, Text, Spacer, Spinner, Input, Textarea, Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiEdit, FiEye, FiShield, FiTrash2 } from "react-icons/fi";

export type PasswordHiddenDetails = FlexProps & {
    passwordFile: FileDto
}

export default function PasswordHiddenDetails({ passwordFile, ...rest }: PasswordHiddenDetails) {
    const [lastPasswordUnlocked, setlastPasswordUnlocked] = useState<undefined | string>();

    const isUnlocked = useMemo(() => lastPasswordUnlocked === passwordFile.path, [passwordFile.path, lastPasswordUnlocked])

    return <>
        <Stack direction="row">
            <Heading>{passwordFile.filename}</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiEdit} />} isDisabled colorScheme="primary">Modifier</Button>
            <Button leftIcon={<Icon as={FiTrash2} />} colorScheme="red">Supprimer</Button>
        </Stack>
        {isUnlocked ?
            <PasswordDetails passwordFile={passwordFile} />
            :
            <Flex alignItems="center" justifyContent="center" marginTop={20} {...rest}>
                <Stack>
                    <Icon as={FiShield} boxSize="3xs" margin="auto" />
                    <Button leftIcon={<Icon as={FiEye} />} size="lg" onClick={() => setlastPasswordUnlocked(passwordFile.path)}>Déchiffrer les données</Button>
                </Stack>
            </Flex >
        }
    </>
}


function PasswordDetails({ passwordFile }: PasswordHiddenDetails) {
    const { data: password, isLoading, error } = usePassword(passwordFile.path)

    if (error) {
        return <Text fontSize="xl">{error}</Text>
    }
    if (isLoading) {
        return <Flex alignItems="center" justifyContent="center" marginTop={20}>
            <Spinner size="lg" />
        </Flex>
    }

    return <Stack spacing={5}>
        <Box>
            <Text>Password</Text>
            <Input value={password?.password} isReadOnly />
        </Box>
        <Box>
            <Text>Extra information</Text>
            <Textarea value={password?.extra} isReadOnly />
        </Box>
    </Stack>
}