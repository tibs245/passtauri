import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbProps, Icon } from "@chakra-ui/react";
import { FiFolder, FiHome } from "react-icons/fi";

export type PasswordBreadcrumbProps = BreadcrumbProps & {
    path: string[];
    onClickFolder: (path: string) => void;
}

export default function PassBreadcrumb({ path, onClickFolder, ...rest }: PasswordBreadcrumbProps) {

    return <Breadcrumb {...rest}>
        <BreadcrumbItem>
            <BreadcrumbLink key="ROOT" onClick={() => onClickFolder("ROOT")}><Icon as={FiHome} /></BreadcrumbLink>
        </BreadcrumbItem>

        {
            path?.map(folder => <BreadcrumbItem key={folder}>
                <BreadcrumbLink onClick={() => onClickFolder(folder)} >
                    <Icon as={FiFolder} /> {folder}
                </BreadcrumbLink>
            </BreadcrumbItem>)
        }
    </Breadcrumb >
}