import FolderItem from "@/components/FolderItem";
import PasswordItem from "@/components/PasswordItem";
import { useSearchPassword } from "@/hooks/password";
import { FileDto } from "@/types/file";
import { Stack, StackDivider, StackProps, Text } from "@chakra-ui/react";

export type PasswordListProps = StackProps & {
    path: string[];
    searchWord: string;
    onClickFolder: (searchWord: string) => void;
    onClickPassword: (passwordFile: FileDto) => void;
}

export default function SearchResult({ path, searchWord, onClickFolder, onClickPassword, ...rest }: PasswordListProps) {
    const { data: listPassword, isLoading, error } = useSearchPassword(path.join('/'), searchWord);

    console.log({ listPassword })
    const handleClickFolder = (filedto: FileDto) => {
        onClickFolder?.(filedto.path.replace(process.env.NEXT_PUBLIC_PASSWORD_STORE ?? '', ''));
    }
    const handleClickPassword = (passwordFile: FileDto) => {
        onClickPassword?.(passwordFile);
    }

    if (error) {
        return <Text>{error.message}</Text>
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
                onClick={() => handleClickFolder(password)}
            >
                <Stack spacing={0}>
                    <Text fontSize="xs" color="gray.600">{password.path.replace(process.env.NEXT_PUBLIC_PASSWORD_STORE ?? '', '').replace(password?.filename ?? '', '')}</Text>
                    <Text>{password.filename}</Text>
                </Stack>
            </FolderItem> :
            <PasswordItem key={password.filename}
                _hover={{ backgroundColor: 'gray.100' }}
                onClick={() => handleClickPassword(password)}>
                <Stack spacing={0}>
                    <Text fontSize="xs" color="gray.600">{password.path.replace(process.env.NEXT_PUBLIC_PASSWORD_STORE ?? '', '').replace(password?.filename ?? '', '')}</Text>
                    <Text>{password.filename}</Text>
                </Stack>
            </PasswordItem>)}
    </Stack>
}