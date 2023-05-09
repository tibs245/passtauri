export type PassFile = {
    filename: string;
    path: string;
    filetype: "FILE" | "DIRECTORY";
    lastModified: string;
    encryptKeysId: string[];
}
