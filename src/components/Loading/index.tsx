import { Flex, Spinner } from "@chakra-ui/react";

export default function Loading() {
    return <Flex height="full" width="full" alignItems="center" justifyContent="center" >
        <Spinner size="xl"
            speed='1s' color="brand"
            emptyColor='gray.200'
        />
    </Flex>
}