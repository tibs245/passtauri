import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureProps, useDisclosure } from "@chakra-ui/react"

const DEFAULT_CARACTERE_TO_GENERATE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const DEFAULT_NUMERIC_CARACTERE = "1234567890"
const DEFAULT_SPECIAL_CARACTERE = "~!@#$%^&*()_-+={}[]|:;<>,.?"
const DEFAULT_ESPACE_CARACTERE = " "

type GenerateNewPasswordModalProps = UseDisclosureProps;

export default function GenerateNewPasswordModal({ isOpen, onOpen, onClose }: GenerateNewPasswordModalProps) {
    return (
        <Modal isOpen={isOpen || false} onClose={() => onClose?.()}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Generate new password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input value=""></Input>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}