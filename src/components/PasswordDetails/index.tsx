import { FileDto } from "@/types/file";
import { Flex, FlexProps, Button, Icon, Stack, Heading, Box, Spacer, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { FiEdit, FiEye, FiShield, FiTrash2 } from "react-icons/fi";

export type PasswordHiddenDetails = FlexProps & {
    passwordFile: FileDto
}

export default function PasswordHiddenDetails({ passwordFile, ...rest }: PasswordHiddenDetails) {
    const [isUnlocked, setIsUnlocked] = useState(false);

    return <>
        <Stack direction="row">
            <Heading>{passwordFile.filename}</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiEdit} />} isDisabled colorScheme="primary">Modifier</Button>
            <Button leftIcon={<Icon as={FiTrash2} />} colorScheme="red">Supprimer</Button>
        </Stack>
        {isUnlocked ?

            <Flex alignItems="center" justifyContent="center" marginTop={20} {...rest}>
                <Spinner size="lg" />
            </Flex >
            :
            <Flex alignItems="center" justifyContent="center" marginTop={20} {...rest}>
                <Stack>
                    <Icon as={FiShield} boxSize="3xs" margin="auto" />
                    <Button leftIcon={<Icon as={FiEye} />} size="lg" onClick={() => setIsUnlocked(true)}>Déchiffrer les données</Button>
                </Stack>
            </Flex >
        }
    </>
}