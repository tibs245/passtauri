import { useKeys } from "@/hooks/password";
import { Spacer, Stack, Icon, Text, StackProps } from "@chakra-ui/react";
import { FiArrowRightCircle, FiFolder } from "react-icons/fi"

type FolderItemProps = React.PropsWithChildren<StackProps> & {
    keys: string[]
}

export default function FolderItem({ children, keys, ...rest }: FolderItemProps) {
    const { data } = useKeys();

    const canDecrypt = keys?.some(keyId =>
        data?.find(key => key.fingerprint == keyId)?.canSign
    ) ?? false

    console.log({ data, keys, canDecrypt })
    return <Stack height="3rem" alignItems="center " direction="row" spacing={6} px={9} role="group" cursor="pointer" {...rest}>
        <Icon as={FiFolder} boxSize={5} fill={canDecrypt ? 'brand.800' : 'white'} />
        <Text>{children}</Text>
        <Spacer />
        <Icon as={FiArrowRightCircle} boxSize={5} display="none" _groupHover={{ display: "block" }} />
    </Stack >
}