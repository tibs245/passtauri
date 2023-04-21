import { Stack, Flex, FlexProps, Text, Icon } from "@chakra-ui/react";
import { FiShield } from "react-icons/fi";

export default function NoSelectedPassword(props: FlexProps) {
    return <Flex alignItems="center" justifyContent="center" width="full" height="100%" {...props}>
        <Stack>
            <Icon as={FiShield} boxSize="3xs" margin="auto" />
            <Text fontSize="2xl">Bienvenue dans votre coffre</Text>
        </Stack>
    </Flex >
}