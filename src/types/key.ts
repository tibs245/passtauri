export type Key = {
    fingerprint?: string;
    issuer?: string;
    lastUpdate: Date;
    hasSecret: boolean;
    isExpired: boolean;
    isRevoked: boolean;
    isInvalid: boolean;
    isDisabled: boolean;
    canSign: boolean;
    canEncrypt: boolean;
    canCertify: boolean;
    user: GpgUser[];
    ownerTrust: Validity;
}


export type KeyOption = {
    label: string;
    value: string;
    trust: Validity;
    isExpired: boolean;
    isRevoked: boolean;
    isInvalid: boolean;
    isDisabled: boolean;
}

export const KeyOptionNewUnknowKey = (keyId: string): KeyOption => {
    return {
        label: keyId,
        value: keyId,
        trust: "UNKNOWN",
        isExpired: false,
        isRevoked: false,
        isInvalid: false,
        isDisabled: false,
    }
}

export type GpgUser = {
    validity: Validity;
    name: string;
    email: string;
    comment: string;
    isRevoked: boolean;
    isInvalid: boolean;
}

export type Validity = "UNKNOWN" | "UNDEFINED" | "NEVER" | "MARGINAL" | "FULL" | "ULTIMATE"