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

export type GpgUser = {
    validity: Validity;
    name: string;
    email: string;
    comment: string;
    isRevoked: boolean;
    isInvalid: boolean;
}

export type Validity = "UNKNOWN" | "UNDEFINED" | "NEVER" | "MARGINAL" | "FULL" | "ULTIMATE"