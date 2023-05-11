import { Button, Stack, Text, Input, Box, InputGroup, InputRightElement, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FolderOption, PassFile, PassFolder } from "@/types/file";
import { useTreeFolder } from "@/hooks/folder";
import Select, { OptionFolderComponent, OptionKeyComponent } from "@/components/Select";
import { useMemo } from "react";
import { useKeys } from "@/hooks/opengpg";
import { KeyOption, KeyOptionNewUnknowKey } from "@/types/key";


type FolderFormProps = {
    folderFile: PassFolder,
    onSubmit: SubmitHandler<PassFolder>,
    isMutating: boolean,
    onCancel?: () => void
}


type PassFolderFormValues = Omit<PassFile, "path" | "encryptKeysId"> & {
    filetype: "DIRECTORY";
    children?: PassFolder[];
    path?: FolderOption;
    encryptKeysId: KeyOption[];
}

const passFolderFromPassFolderFormValues = ({ path, encryptKeysId, ...rest }: PassFolderFormValues): PassFolder => {
    return {
        path: path?.value ?? "",
        encryptKeysId: encryptKeysId.map(keyId => keyId.value),
        ...rest
    }
}


const passFolderFormValuesFromPassFolder = ({ path, encryptKeysId, ...rest }: PassFolder, pathOptions: FolderOption[], KeyOptions: KeyOption[]): PassFolderFormValues => {
    return {
        path: pathOptions?.find(p => p.value === path),
        encryptKeysId: encryptKeysId?.map(keyId => KeyOptions.find(k => k.value === keyId) ?? KeyOptionNewUnknowKey(keyId)) ?? [],
        ...rest
    }
}

const mapFolderAndChildren = (passFolder: PassFolder, parents: string[] = []): FolderOption[] => {
    const folder = { value: passFolder.path, label: [...parents, passFolder.filename].join('/'), depth: parents.length, parents: parents.join('/'), name: passFolder.filename }
    const children = passFolder?.children?.map((child) => mapFolderAndChildren(child, [...parents, passFolder.filename]))?.flat() ?? []

    return [folder, ...children]
}

export default function FolderForm({ folderFile, isMutating, onSubmit, onCancel }: FolderFormProps) {
    const { data: keysAvailable } = useKeys();
    const { data: treeFolder } = useTreeFolder();

    const pathOptions = useMemo(() => [{ value: (process.env.NEXT_PUBLIC_PASSWORD_STORE ?? ''), depth: 0, label: 'Home : /', name: 'Home : /', parents: '' }, ...(treeFolder?.map((child) => mapFolderAndChildren(child)).flat() ?? [])], [treeFolder])
    const keysOptions = useMemo((): KeyOption[] => (
        keysAvailable?.map(key => ({
            label: key.user?.[0].name + ' - ' + key.user?.[0].email,
            value: key.fingerprint ?? '', trust: key.ownerTrust,
            isInvalid: key.isInvalid,
            isExpired: key.isExpired,
            isRevoked: key.isRevoked,
            isDisabled: key.isDisabled
        })) ?? []),
        [keysAvailable])


    const { control, register, handleSubmit, formState: { errors } } = useForm<PassFolderFormValues>({
        defaultValues: {
            ...(passFolderFormValuesFromPassFolder(folderFile, pathOptions, keysOptions) ?? {})
        }
    });

    const handleSubmitMapper = (formValues: PassFolderFormValues) => {
        onSubmit(passFolderFromPassFolderFormValues(formValues))
    }

    return (<>
        <form onSubmit={handleSubmit(handleSubmitMapper)}>
            <Stack spacing={5}>
                <Box>
                    <Text>Name of file</Text>
                    <FormControl isInvalid={!!errors.filename}>
                        <InputGroup>
                            <Input {...register("filename", { required: "A folder name is required to save it" })} />
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.filename && errors.filename.message}
                        </FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <Text>Folder Path</Text>
                    <FormControl isInvalid={!!errors.path}>
                        <Select<PassFolderFormValues, FolderOption, false> useBasicStyles
                            placeholder='Select path'
                            options={pathOptions}
                            components={OptionFolderComponent}
                            name="path"
                            control={control}
                        />
                        <FormErrorMessage>
                            {errors.path && errors.path.message}
                        </FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <Text>Key</Text>
                    <FormControl isInvalid={!!errors.path}>
                        <Select<PassFolderFormValues, KeyOption, true> useBasicStyles
                            placeholder='Select keys'
                            options={keysOptions}
                            isMulti
                            components={OptionKeyComponent}
                            isClearable={false}
                            name="encryptKeysId"
                            control={control}
                        />
                        <FormErrorMessage>
                            {errors.path && errors.path.message}
                        </FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <Button colorScheme="red" variant="ghost" onClick={onCancel}>Annuler</Button>
                    <Button colorScheme="blue" type="submit" isLoading={isMutating}>Sauvegarder</Button>
                </Box>
            </Stack>
        </form>
    </>)
}
