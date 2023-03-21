export interface KeyMaterial {
    controller: string

    id: string

    publicKeyMultibase: string

    type: string
}

export interface DidDocument {
    '@context': string[]

    assertionMethod: KeyMaterial[]

    authentication: KeyMaterial[]

    capabilityDelegation: KeyMaterial[]

    capabilityInvocation: KeyMaterial[]

    id: string
}

export enum VerificationRelation {
    Master = 'master',
    Authentication = 'authentication',
    CapabilityDelegation = 'capabilityDelegation',
    CapabilityInvocation = 'capabilityInvocation',
    AssertionMethod = 'assertionMethod',
}

export type SigningResponse = {
    ProofValue: Uint8Array
    VerificationMethod: string
    ProofType: string
}

export interface DynamicSigner {
    getDid(): string

    getKeyMaterial(rel: VerificationRelation): KeyMaterial

    getVerificationProofType(): string

    sign(rel: VerificationRelation, message: Uint8Array): SigningResponse
}

export interface RequestCredentialParams {
    accessToken: string

    challenge?: {
        nonce: string
    }

    signer: DynamicSigner

    credentialType: CredentialType
}

export interface RecoverIdentityParams {
    mnemonic: string
}

export interface CreateTokenParams {
    did?: {
        did: string
        challenge?: {
            nonce: string
        }
    }

    signer: DynamicSigner

    password?: {
        email: string
        password: string
    }
}

export interface AuthToken {
    expiresIn: number

    refreshToken: string

    token: string

    tokenType: string
}

export interface HandleCallbackParams {
    code: string
    state: string
}

export interface NetworkConfig {
    credentialAdapterURL: string

    registryURL: string

    userServiceURL: string
}

export interface KnoxConfig {
    network: NetworkConfig
}

export interface AssociateIdentityParams {
    challenge?: {
        nonce: string
    }

    signer: DynamicSigner

    token: string
}

export interface GetAuthProviderURLParams {
    instanceName: string
    requestOrigin: string
    provider: AuthProvider
    clientState: { [key: string]: unknown }
}

export interface VerifiableCredential {
    credential: string
    credentialType: CredentialType
}

export enum AuthProvider {
    Github = 'github',
    Facebook = 'facebhook',
    Google = 'google',
    Saml = 'saml',
    Cognito = 'cognito',
}

export enum CredentialType {
    BankAccount = 'BankAccount',
    BankCard = 'BankCard',
    PermanentResidentCard = 'PermanentResidentCard',
}
