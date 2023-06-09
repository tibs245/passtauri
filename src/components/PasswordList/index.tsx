import FolderItem from "@/components/FolderItem";
import Loading from "@/components/Loading";
import PasswordItem from "@/components/PasswordItem";
import { useListPassword } from "@/hooks/password";
import { PassFile } from "@/types/file";
import { Stack, StackDivider, StackProps, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export type PasswordListProps = StackProps & {
    path: string[];
    onClickFolder: (path: string) => void;
}

export default function PasswordList({ path, onClickFolder, ...rest }: PasswordListProps) {
    const router = useRouter();
    const { data: listPassword, isLoading, error } = useListPassword(path.join('/'));

    const handleClickFolder = (PassFile: PassFile) => {
        onClickFolder?.(PassFile.path.replace(process.env.NEXT_PUBLIC_PASSWORD_STORE + '/', ''));
    }

    if (error) {
        return <>{error.message}</>
    }

    if (isLoading) {
        return <Loading />
    }

    return <Stack
        spacing={0}
        divider={<StackDivider borderColor='gray.200' />}
        {...rest}>
        {listPassword?.map(fileItem => fileItem.filetype === "DIRECTORY" ?
            <FolderItem key={fileItem.filename}
                _hover={{ backgroundColor: 'gray.100' }}
                folder={fileItem}
                onClick={() => handleClickFolder(fileItem)}
            >{fileItem.filename}</FolderItem> :
            <PasswordItem key={fileItem.filename}
                _hover={{ backgroundColor: 'gray.100' }}
                onClick={() => router.push(`/password/view${fileItem.path}`)}>
                {fileItem.filename}</PasswordItem>)}
    </Stack>
}