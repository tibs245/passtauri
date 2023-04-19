import { Spacer, Stack, Icon, Text, StackProps } from "@chakra-ui/react";
import { FiArrowRightCircle, FiLock } from "react-icons/fi"

export default function FolderItem({ children, ...rest }: React.PropsWithChildren<StackProps>) {
    return <Stack height="3rem" alignItems="center " direction="row" spacing={6} px={9} role="group" cursor="pointer" {...rest}>
        <Icon as={FiLock} boxSize={5} />
        <Text>{children}</Text>
        <Spacer />
        <Icon as={FiArrowRightCircle} boxSize={5} display="none" _groupHover={{ display: "block" }} />
    </Stack >
}