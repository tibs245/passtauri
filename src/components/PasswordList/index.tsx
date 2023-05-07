import FolderItem from "@/components/FolderItem";
import PasswordItem from "@/components/PasswordItem";
import { useListPassword } from "@/hooks/password";
import { Stack, StackDivider, StackProps, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export type PasswordListProps = StackProps & {
    path: string[];
    onClickFolder: (path: string) => void;
}

export default function PasswordList({ path, onClickFolder, ...rest }: PasswordListProps) {
    const router = useRouter();
    const { data: listPassword, isLoading, error } = useListPassword(path.join('/'));

    const handleClickFolder = (filename: string) => {
        onClickFolder?.(filename);
    }

    if (error) {
        return <>{error.message}</>
    }

    if (isLoading) {
        return <Text>Read secret folder 🫣 ..</Text>
    }

    return <Stack
        spacing={0}
        divider={<StackDivider borderColor='gray.200' />}
        {...rest}>
        {listPassword?.map(password => password.filetype === "DIRECTORY" ?
            <FolderItem key={password.filename}
                _hover={{ backgroundColor: 'gray.100' }}
                onClick={() => handleClickFolder(password.filename)}
            >{password.filename}</FolderItem> :
            <PasswordItem key={password.filename}
                _hover={{ backgroundColor: 'gray.100' }}
                onClick={() => router.push(`/password/view${password.path}`)}>
                {password.filename}</PasswordItem>)}
    </Stack>
}