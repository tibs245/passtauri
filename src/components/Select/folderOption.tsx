import { FolderOption, PassFolder } from "@/types/file";
import { SelectComponentsConfig, GroupBase, chakraComponents } from "chakra-react-select";
import { Text } from "@chakra-ui/react";
import { useTreeFolder } from "@/hooks/folder";
import { useMemo } from "react"

const mapFolderAndChildren = (passFolder: PassFolder, parents: string[] = []): FolderOption[] => {
    const folder = { value: passFolder.path, label: [...parents, passFolder.filename].join('/'), depth: parents.length, parents: parents.join('/'), name: passFolder.filename }
    const children = passFolder?.children?.map((child) => mapFolderAndChildren(child, [...parents, passFolder.filename]))?.flat() ?? []

    return [folder, ...children]
}

export const usePathOptions = () => {
    const { data: treeFolder } = useTreeFolder();

    return useMemo(() => [{
        value: (process.env.NEXT_PUBLIC_PASSWORD_STORE ?? ''),
        depth: 0,
        label: 'Home : /',
        name: 'Home : /',
        parents: ''
    },
    ...(treeFolder?.map((child) => mapFolderAndChildren(child)).flat() ?? [])], [treeFolder])
}


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
