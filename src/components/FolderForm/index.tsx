import { Button, Stack, Text, Input, Box, InputGroup, FormControl, FormErrorMessage, Spinner, Flex } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FolderOption, PassFile, PassFolder } from "@/types/file";
import Select, { OptionFolderComponent, OptionKeyComponent, usePathOptions, useKeysOptions } from "@/components/Select";
import { KeyOption, KeyOptionNewUnknowKey } from "@/types/key";
import Loading from "@/components/Loading";

type FolderFormProps = {
    folderFile: PassFolder,
    onSubmit: SubmitHandler<PassFolder>,
    isMutating: boolean,
    onCancel?: () => void
}

type FolderFormLoadedProps = {
    folderFile: PassFolder,
    onSubmit: SubmitHandler<PassFolder>,
    isMutating: boolean,
    onCancel?: () => void,
    pathOptions: FolderOption[],
    keysOptions: KeyOption[],
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
    const pathArray = path.split('/')
    const parentPath = pathArray?.slice(0, pathArray.length - 1)?.join('/')
    return {
        path: pathOptions?.find(p => p.value === parentPath),
        encryptKeysId: encryptKeysId?.map(keyId => KeyOptions.find(k => k.value === keyId) ?? KeyOptionNewUnknowKey(keyId)) ?? [],
        ...rest
    }
}

export default function LoadFolderForm(props: FolderFormProps) {
    const { pathOptions, isPathOptionsValidating } = usePathOptions();
    const { keysOptions, isKeysOptionsValidating } = useKeysOptions();

    return (isKeysOptionsValidating || isPathOptionsValidating) ?
        <Loading /> :
        <FolderForm pathOptions={pathOptions} keysOptions={keysOptions} {...props} />
}

function FolderForm({ folderFile, isMutating, onSubmit, onCancel, pathOptions, keysOptions }: FolderFormLoadedProps) {
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
