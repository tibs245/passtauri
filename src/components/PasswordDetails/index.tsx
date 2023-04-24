import { usePassword } from "@/hooks/password";
import { FileDto } from "@/types/file";
import { Flex, FlexProps, Button, Icon, Stack, Heading, Text, Spacer, Spinner, Input, Textarea, Box, InputGroup, InputRightElement, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiClipboard, FiEdit, FiEye, FiShield, FiTrash2 } from "react-icons/fi";
import { readText, writeText } from '@tauri-apps/api/clipboard';

const SECOND_DURING_PASSWORD_COPIED = 30;

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
            <InputGroup>
                <Input value={password?.password} isReadOnly />
                <TimeToProgress password={password?.password || 'error'} />
            </InputGroup>
        </Box>
        <Box>
            <Text>Extra information</Text>
            <Textarea value={password?.extra} isReadOnly />
        </Box>
    </Stack>
}

type TimeToProgressProps = {
    password: string;
}

function TimeToProgress({ password }: TimeToProgressProps) {
    const [secondBeforeReset, setSecondBeforeReset] = useState<number>(0)
    const [oldTextClipboard, setOldTextClipboard] = useState<string | null>(null)

    const handleClipboardClick = async () => {
        setOldTextClipboard(await readText())
        await writeText(password);
        setSecondBeforeReset(30); // Pour l'affichage
        let secondBeforeResetIntern = 30; // Pour la fonction
        console.log({ secondBeforeReset })

        let resetInterval = setInterval(() => {
            setSecondBeforeReset(secondBeforeResetIntern - 1);
            secondBeforeResetIntern = secondBeforeResetIntern - 1
        }, 1000)

        setTimeout(() => {
            writeText(oldTextClipboard || '');
            setOldTextClipboard(null);
            if (resetInterval) {
                clearInterval(resetInterval)
            }
            setSecondBeforeReset(0);
        }, SECOND_DURING_PASSWORD_COPIED * 1000)

    }

    return <InputRightElement children={
        secondBeforeReset !== 0 ?
            <CircularProgress value={secondBeforeReset} min={0} max={SECOND_DURING_PASSWORD_COPIED} color='blue.400' size="1.5em">
                <CircularProgressLabel>{secondBeforeReset}</CircularProgressLabel>
            </CircularProgress>
            :
            <Icon as={FiClipboard} color='gray.500' onClick={handleClipboardClick} cursor="pointer" />
    } />
}