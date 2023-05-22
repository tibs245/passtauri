import { Key, KeyOption } from "@/types/key";
import { Text, Stack } from "@chakra-ui/react";
import { SelectComponentsConfig, GroupBase, chakraComponents } from "chakra-react-select";
import { useKeys } from "@/hooks/opengpg";
import { useMemo } from "react"
import { SWRConfiguration } from "swr";
import { TauriError } from "@/types/tauriError";

export const useKeysOptions = (options: SWRConfiguration<Key[], TauriError> = {}) => {
    const {
        data: keysAvailable,
        isLoading: isKeysOptionsLoading,
        isValidating: isKeysOptionsValidating,
        error: errorKeysOptions
    } = useKeys({ revalidateOnFocus: false, revalidateOnReconnect: false, ...options ?? {} });

    return {
        isKeysOptionsLoading,
        isKeysOptionsValidating,
        errorKeysOptions,
        keysOptions: useMemo((): KeyOption[] => (
            keysAvailable?.map(key => ({
                label: key.user?.[0].name + ' - ' + key.user?.[0].email,
                value: key.fingerprint ?? '',
                trust: key.ownerTrust,
                isInvalid: key.isInvalid,
                isExpired: key.isExpired,
                isRevoked: key.isRevoked,
                isDisabled: key.isDisabled
            })) ?? []),
            [keysAvailable])
    }
}

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