export type PassFile = {
    filename: string;
    path: string;
    filetype: "FILE" | "DIRECTORY";
    lastModified?: string;
    encryptKeysId?: string[];
}

export type PassFolder = PassFile & {
    filetype: "DIRECTORY";
    children?: PassFolder[];
}

export type FolderOption = {
    label: string;
    value: string;
    depth: number;
    parents: string;
    name: string;
}
