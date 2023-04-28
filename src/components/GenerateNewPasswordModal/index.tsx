import WriteInputContent from "@/components/WriteInputContent";
import { useGeneratePassword } from "@/hooks/password";
import { Box, Button, FormControl, FormLabel, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, SimpleGrid, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Switch, UseDisclosureProps } from "@chakra-ui/react"
import { useState } from "react";

import { SubmitHandler, useForm, useWatch } from "react-hook-form";

const DEFAULT_CARACTERE_TO_GENERATE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const DEFAULT_NUMERIC_CARACTERE = "1234567890"
const DEFAULT_SPECIAL_CARACTERE = "~!@#$%^&*()_-+={}[]|:;<>,.?"
const DEFAULT_ESPACE_CARACTERE = " "

type FormValues = {
    size: number;
    alphanumeric: boolean;
    numeric: boolean;
    special: boolean;
    blank: boolean;
}

type GenerateNewPasswordModalProps = Omit<UseDisclosureProps, 'onOpen'> & {
    onApplyPassword: (password: string) => void
};

export default function GenerateNewPasswordModal({ isOpen, onClose, onApplyPassword }: GenerateNewPasswordModalProps) {

    const { trigger, isMutating } = useGeneratePassword();
    const { register, handleSubmit, control, setValue } = useForm<FormValues>({
        defaultValues: {
            size: 64,
            alphanumeric: true,
            numeric: true,
            special: true,
            blank: true
        }
    });

    const [passwordValue, setPasswordValue] = useState("");

    const size = useWatch({ control, name: 'size' })
    const onSubmit = handleSubmit(async (data: FormValues) => {
        let listOfCaractere = "";

        if (data.alphanumeric) {
            listOfCaractere = listOfCaractere + DEFAULT_CARACTERE_TO_GENERATE;
        }

        if (data.numeric) {
            listOfCaractere = listOfCaractere + DEFAULT_NUMERIC_CARACTERE;
        }

        if (data.special) {
            listOfCaractere = listOfCaractere + DEFAULT_SPECIAL_CARACTERE;
        }

        if (data.blank) {
            listOfCaractere = listOfCaractere + DEFAULT_ESPACE_CARACTERE;
        }


        // Trim is to prevent blank charactere in begin and in the end. 
        // It's so ambiguous. I prefer less length
        setPasswordValue((await trigger({ size: Number(data.size), listOfCaractere }))?.trim() ?? '');

    });

    return (
        <Modal isOpen={isOpen || false} onClose={() => onClose?.()}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Generate new password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={onSubmit}>
                        <Stack spacing={5} alignItems="center">
                            <NumberInput>
                                <NumberInputField {...register('size')}
                                    value={size.toString()}
                                    onChange={(val) => setValue('size', Number(val.target.value))} />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Slider
                                flex='1'
                                focusThumbOnChange={false}
                                min={10}
                                max={250}
                                value={size}
                                onChange={(val) => setValue('size', val)}
                            >
                                <SliderTrack >
                                    <SliderFilledTrack {...register('size')} />
                                </SliderTrack>
                                <SliderThumb fontSize='sm' boxSize='32px' children={size} />
                            </Slider>
                            <Box>
                                <Stack direction="row">
                                    <Switch id='alphanumeric' {...register('alphanumeric')} />
                                    <FormLabel htmlFor='alphanumeric'>Alphanumeric</FormLabel>
                                </Stack>
                                <Stack direction="row">
                                    <Switch id='numeric' {...register('numeric')} />
                                    <FormLabel htmlFor='numeric'>Numeric</FormLabel>
                                </Stack>
                                <Stack direction="row">
                                    <Switch id='special' {...register('special')} />
                                    <FormLabel htmlFor='special'>Special Characters</FormLabel>
                                </Stack>
                                <Stack direction="row">
                                    <Switch id='blank' {...register('blank')} />
                                    <FormLabel htmlFor='blank'>Blank Characters</FormLabel>
                                </Stack>
                            </Box>
                            <Button colorScheme='brand' mr={3} type="submit" width="full" isLoading={isMutating}>
                                Generate
                            </Button>
                            <InputGroup>
                                <Input value={passwordValue} onChange={(val) => setPasswordValue(val.target.value)} />
                                <WriteInputContent content={passwordValue} />
                            </InputGroup>
                        </Stack >
                    </form >
                </ModalBody >

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme="brand" onClick={() => onApplyPassword(passwordValue)}>Apply</Button>
                </ModalFooter>
            </ModalContent >
        </Modal >
    )
}
