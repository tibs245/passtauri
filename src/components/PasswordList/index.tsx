import FolderItem from "@/components/FolderItem";
import PasswordItem from "@/components/PasswordItem";
import { useListPassword } from "@/hooks/password";
import { FileDto } from "@/types/file";
import { Stack, StackDivider, StackProps, Text } from "@chakra-ui/react";

export type PasswordListProps = StackProps & {
    path: string[];
    onClickFolder: (path: string) => void;
    onClickPassword: (passwordFile: FileDto) => void;
}

export default function PasswordList({ path, onClickFolder, onClickPassword, ...rest }: PasswordListProps) {
    const { data: listPassword, isLoading, error } = useListPassword(path.join('/'));

    console.log({ listPassword })
    const handleClickFolder = (filename: string) => {
        onClickFolder?.(filename);
    }
    const handleClickPassword = (passwordFile: FileDto) => {
        onClickPassword?.(passwordFile);
    }

    if (error) {
        return <>{error}</>
    }

    if (isLoading) {
        return <Text>"Read secret folder 🫣 .."</Text>
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
                onClick={() => handleClickPassword(password)}>
                {password.filename}</PasswordItem>)}
    </Stack>
}