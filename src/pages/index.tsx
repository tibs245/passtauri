import { Stack, Flex, Text, Icon } from "@chakra-ui/react";
import { FiShield } from "react-icons/fi";

export default function Home() {
  return <Flex alignItems="center" justifyContent="center" width="full" height="100%">
    <Stack>
      <Icon as={FiShield} color="brand.800" fill="gray.300" boxSize="3xs" margin="auto" />
      <Text fontSize="2xl">Bienvenue dans votre coffre</Text>
    </Stack>
  </Flex >
}