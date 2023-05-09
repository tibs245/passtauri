import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbProps, Icon } from "@chakra-ui/react";
import { FiFolder, FiHome } from "react-icons/fi";

export type PasswordBreadcrumbProps = BreadcrumbProps & {
    path: string[];
    onClickFolder: (path: string) => void;
}

export default function PassBreadcrumb({ path, onClickFolder, ...rest }: PasswordBreadcrumbProps) {
    return <Breadcrumb {...rest}>
        <BreadcrumbItem>
            <BreadcrumbLink key="ROOT" onClick={() => onClickFolder("")}><Icon as={FiHome} /></BreadcrumbLink>
        </BreadcrumbItem>

        {
            path?.map((folder, index) => <BreadcrumbItem key={index + '-' + folder}>
                <BreadcrumbLink onClick={() => onClickFolder(path.slice(0, index + 1).join('/'))} >
                    <Icon as={FiFolder} /> {folder}
                </BreadcrumbLink>
            </BreadcrumbItem>)
        }
    </Breadcrumb >
}