import WriteInputContent from "@/components/WriteInputContent";
import { useDeletePassword, usePassword } from "@/hooks/password";
import { FileDto } from "@/types/file";
import { Flex, FlexProps, Button, Icon, Stack, Heading, Text, Spacer, Spinner, Input, Textarea, Box, InputGroup } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiEdit, FiEye, FiShield, FiTrash2 } from "react-icons/fi";

export type PasswordHiddenDetails = FlexProps & {
    passwordFile: FileDto,
    onEditAsked: (passwordFile: FileDto) => void,
    onDeletePassword?: () => void
}

export default function PasswordHiddenDetails({ passwordFile, onEditAsked, onDeletePassword, ...rest }: PasswordHiddenDetails) {

    const [lastPasswordUnlocked, setlastPasswordUnlocked] = useState<undefined | string>();
    const { trigger, isMutating } = useDeletePassword(passwordFile.path);

    const handleDeletePassword = () => {
        trigger()
        onDeletePassword?.();
    }

    const isUnlocked = useMemo(() => lastPasswordUnlocked === passwordFile.path, [passwordFile.path, lastPasswordUnlocked])

    return <>
        <Stack direction="row">
            <Heading>{passwordFile.filename}</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiEdit} />} colorScheme="gray" isDisabled={!isUnlocked} onClick={() => onEditAsked?.(passwordFile)}>Modifier</Button>
            <Button leftIcon={<Icon as={FiTrash2} />} colorScheme="red" onClick={handleDeletePassword} isLoading={isMutating}>Supprimer</Button>
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

type PasswordDetailsProps = Omit<PasswordHiddenDetails, 'onEditAsked' | 'onDeletePassword'>;

function PasswordDetails({ passwordFile }: PasswordDetailsProps) {
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
            <InputGroup>
                <Input value={password?.password} isReadOnly />
                <WriteInputContent content={password?.password || 'error'} />
            </InputGroup>
        </Box>
        <Box>
            <Text>Username</Text>
            <InputGroup>
                <Input value={password?.username} isReadOnly />
            </InputGroup>
        </Box>
        <Box>
            <Text>Extra information</Text>
            <Textarea value={password?.extra ?? ''} isReadOnly />
        </Box>
    </Stack>
}

