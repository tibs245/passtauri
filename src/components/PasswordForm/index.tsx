import { useDeletePassword, usePassword, useUpdatePassword } from "@/hooks/password";
import { FileDto } from "@/types/file";
import { Flex, FlexProps, Button, Icon, Stack, Heading, Text, Spacer, Spinner, Input, Textarea, Box, InputGroup, InputRightElement, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { FiXCircle, FiCpu, FiTrash2 } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form";
import { Password } from "@/types/password";


export type PasswordHiddenDetails = {
    passwordFile: FileDto,
    onDeletePassword?: () => void
    onUpdatePassword?: (newName: string) => void
}

export default function PasswordHiddenDetails({ passwordFile, onUpdatePassword, onDeletePassword }: PasswordHiddenDetails) {
    const { data: password, isLoading, error } = usePassword(passwordFile.path)
    const { trigger, isMutating } = useDeletePassword(passwordFile.path);

    const { trigger: triggerUpdatePassword, isMutating: isUpdatePasswordMutating } = useUpdatePassword(passwordFile.path);

    const handleUpdatePassword = async (password: Password) => {
        await triggerUpdatePassword(password);
        onUpdatePassword?.(password.name)
    }

    const handleDeletePassword = () => {
        trigger()
        onDeletePassword?.();
    }


    if (error) {
        return <Text fontSize="xl">{error}</Text>
    }
    if (isLoading || !password) {
        return <Flex alignItems="center" justifyContent="center" marginTop={20}>
            <Spinner size="lg" />
        </Flex>
    }

    return <>
        <Stack direction="row">
            <Heading>{passwordFile.filename}</Heading>
            <Spacer />
            <Button leftIcon={<Icon as={FiXCircle} />} colorScheme="red" variant="ghost">Annuler</Button>
            <Button leftIcon={<Icon as={FiTrash2} />} colorScheme="red" onClick={handleDeletePassword} isLoading={isMutating}>Supprimer</Button>
        </Stack>
        <PasswordForm passwordDetails={password} isMutating={isUpdatePasswordMutating} onSubmit={handleUpdatePassword} />
    </>
}

type PasswordFormProps = {
    passwordDetails: Password,
    onSubmit: SubmitHandler<Password>,
    isMutating: boolean
}

function PasswordForm({ passwordDetails, isMutating, onSubmit }: PasswordFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<Password>({
        defaultValues: {
            ...passwordDetails
        }
    });
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
                <Box>
                    <Text>Name of file</Text>
                    <FormControl isInvalid={!!errors.password}>
                        <InputGroup>
                            <Input {...register("name", { required: "A name is required to save it, the site_name+login ?" })} />
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.name && errors.name.message}
                        </FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <Text>Password</Text>
                    <FormControl isInvalid={!!errors.password}>
                        <InputGroup>
                            <Input {...register("password", { required: "A password is required to save it" })} />
                            <InputRightElement><Icon as={FiCpu} /></InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.password && errors.password.message}
                        </FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <Text>Username</Text>
                    <FormControl>
                        <Input {...register("username")} />
                    </FormControl>
                </Box>
                <Box>
                    <Text>Otp</Text>
                    <FormControl>
                        <Input {...register("otp")} />
                    </FormControl>
                </Box>
                <Box>
                    <Text>Extra information</Text>
                    <Textarea {...register("extra")} />
                </Box>
                <Box>
                    <Button colorScheme="red" variant="ghost">Annuler</Button>
                    <Button colorScheme="blue" type="submit" isLoading={isMutating}>Sauvegarder</Button>
                </Box>
            </Stack>
        </form>)
}
