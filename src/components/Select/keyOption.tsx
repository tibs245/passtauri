import { KeyOption } from "@/types/key";
import { Text, Stack } from "@chakra-ui/react";
import { SelectComponentsConfig, GroupBase, chakraComponents } from "chakra-react-select";

export const OptionKeyComponent: SelectComponentsConfig<
    KeyOption,
    true,
    GroupBase<KeyOption>> = {
    Option: ({ children, ...props }) => {
        const key = props.data;
        const isNotSelected = key.trust !== "ULTIMATE" || key.isDisabled || key.isExpired || key.isInvalid || key.isRevoked

        let errorMessage = undefined;

        if (key.isDisabled) {
            errorMessage = "This key is disabled"
        } else if (key.isExpired) {
            errorMessage = "This key is expired"
        } else if (key.isInvalid) {
            errorMessage = "This key is invalid"
        } else if (key.isRevoked) {
            errorMessage = "This key is revoked"
        } else if (key.trust !== "ULTIMATE") {
            errorMessage = "This key is not trusted with ultimate level"
        }

        return (<chakraComponents.Option {...props}>
            <Stack>
                {isNotSelected ?
                    <Text color="red.400">{children} - {errorMessage}</Text> :
                    <Text>{children}</Text>}

                <Text color="gray.400" fontSize="xs">{key.value}</Text>
            </Stack>
        </chakraComponents.Option >
        )
    },
};