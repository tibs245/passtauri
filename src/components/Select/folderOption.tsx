import { FolderOption } from "@/types/file";
import { SelectComponentsConfig, GroupBase, chakraComponents } from "chakra-react-select";
import { Text } from "@chakra-ui/react";

export const OptionFolderComponent: SelectComponentsConfig<
    FolderOption,
    false,
    GroupBase<FolderOption>> = {
    Option: ({ children, ...props }) => (
        <chakraComponents.Option {...props}>
            <Text color="gray.400">
                {props.data.parents}
                {props.data.parents.length ? '/' : ''}
            </Text>
            {props.data.name}
        </chakraComponents.Option >
    ),
};
