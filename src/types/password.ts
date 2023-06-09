export type Password = {
    name: string;
    brutContent: string;
    username: string;
    password: string;
    otp: string;
    lastUpdated: string;
    extra: string;
}

export type PasswordWithPath = Password & {
    path: string
}
