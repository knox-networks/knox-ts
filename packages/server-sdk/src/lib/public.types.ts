import { CredentialType } from '@buf/knox-networks_credential-adapter.bufbuild_es/vc_api/v1/vc_pb.js'

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

export interface NetworkConfig {
    credentialAdapterURL: string

    registryURL: string

    userServiceURL: string
}

export interface KnoxConfig {
    network: NetworkConfig
}

export interface RegisterIdentityParams {
    challenge?: {
        nonce: string
    }

    signer: DynamicSigner

    token: string
}

export interface VerifiableCredential {
    credential: string

    credentialType: CredentialType
}

export { CredentialType }

export const getCredentialTypeName = (type: CredentialType): string => {
    switch (type) {
        case CredentialType.BANK_ACCOUNT:
            return 'BankAccount'
        case CredentialType.BANK_CARD:
            return 'BankCard'
        case CredentialType.PERMANENT_RESIDENT_CARD:
            return 'PermanentResidentCard'
        default:
            throw new Error('No credential type matched')
    }
}
