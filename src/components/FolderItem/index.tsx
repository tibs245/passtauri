import { useDeletePasswordFolder } from "@/hooks/folder";
import { useKeys } from "@/hooks/opengpg"
import { PassFile } from "@/types/file";
import { Spacer, Stack, Icon, Text, StackProps, Popover, PopoverTrigger, Button, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverBody, PopoverArrow, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRightCircle, FiFolder, FiEdit, FiTrash2, FiAlertTriangle } from "react-icons/fi"

type FolderItemProps = React.PropsWithChildren<StackProps> & {
    folder: PassFile
}

export default function FolderItem({ children, folder, ...rest }: FolderItemProps) {
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const { data } = useKeys();
    const { trigger, isMutating } = useDeletePasswordFolder(folder.path);

    const handleDeletePassword = () => {
        trigger()
        // Todo change route if folder is selected
    }

    const canDecrypt = folder.encryptKeysId?.some(keyId =>
        data?.find(key => key.fingerprint == keyId)?.canSign
    ) ?? false

    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        onToggle();
    }

    return <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="auto-end">
        <PopoverTrigger>
            <Stack height="3rem" alignItems="center " direction="row" spacing={6} px={9} role="group" cursor="pointer" onContextMenu={handleClick} {...rest}>
                <Icon as={FiFolder} boxSize={5} fill={canDecrypt ? 'brand.800' : 'white'} />
                <Text>{children}</Text>
                <Spacer />
                <Icon as={FiArrowRightCircle} boxSize={5} display="none" _groupHover={{ display: "block" }} />
            </Stack>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
                <Stack>
                    <Button as={Link} colorScheme="brand" leftIcon={<Icon as={FiEdit} />} href={'/folder/edit' + folder.path} onClick={() => onToggle()}>Modifier</Button>
                    {isConfirmDelete ?
                        <Button colorScheme="red" leftIcon={<Icon as={FiAlertTriangle} />} onClick={handleDeletePassword} isLoading={isMutating}>Sure ?</Button>
                        :
                        <Button colorScheme="red" variant="outline" leftIcon={<Icon as={FiTrash2} />} onClick={() => setIsConfirmDelete(true)} isLoading={isMutating}>Supprimer</Button>
                    }
                </Stack>
            </PopoverBody>
        </PopoverContent>
    </Popover >
}
