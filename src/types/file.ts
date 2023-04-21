export type FileDto = {
    filename: string;
    path: string;
    filetype: "FILE" | "DIRECTORY";
    lastModified: string;
}