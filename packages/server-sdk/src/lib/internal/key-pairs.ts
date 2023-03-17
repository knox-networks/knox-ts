import { HDKey } from 'ed25519-keygen/hdkey'
import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { base58btc } from 'multiformats/bases/base58'
import {
    DynamicSigner,
    KeyMaterial,
    VerificationRelation,
} from '../public.types'

const VERIFICATION_PROOF_TYPE = 'Ed25519VerificationKey2020'
const SIGNATURE_PROOF_TYPE = 'Ed25519Signature2020'

const DID_PREFIX = 'did:knox:'

export class KeyPairs implements DynamicSigner {
    public readonly assertionMethodKey: HDKey

    public readonly authenticationKey: HDKey

    public readonly capabilityDelegationKey: HDKey

    public readonly capabilityInvocationKey: HDKey

    public readonly masterKey: HDKey

    public readonly mnemonic: string

    public constructor(mnemonic: string) {
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        this.masterKey = HDKey.fromMasterSeed(seed)

        this.authenticationKey = this.masterKey
        this.capabilityDelegationKey = this.masterKey

        this.capabilityInvocationKey = this.masterKey

        this.assertionMethodKey = this.masterKey

        this.mnemonic = mnemonic
    }

    public getDid(): string {
        return (
            DID_PREFIX + this.getEncodedPublicKey(VerificationRelation.Master)
        )
    }

    public getEncodedPublicKey(rel: VerificationRelation): string {
        return base58btc.encode(this.getKey(rel).publicKeyRaw)
    }

    public getKey(rel: VerificationRelation): HDKey {
        switch (rel) {
            case VerificationRelation.AssertionMethod: {
                return this.assertionMethodKey
            }
            case VerificationRelation.Authentication: {
                return this.authenticationKey
            }
            case VerificationRelation.CapabilityDelegation: {
                return this.capabilityDelegationKey
            }
            case VerificationRelation.CapabilityInvocation: {
                return this.capabilityInvocationKey
            }
            case VerificationRelation.Master: {
                return this.masterKey
            }
            default: {
                throw new Error('Unexpected verification relationship')
            }
        }
    }

    public getKeyMaterial(rel: VerificationRelation): KeyMaterial {
        return {
            id: this.getDid() + '#' + this.getEncodedPublicKey(rel),
            type: this.getVerificationProofType(),
            controller: this.getDid(),
            publicKeyMultibase: this.getEncodedPublicKey(rel),
        }
    }

    public getVerificationProofType(): string {
        return VERIFICATION_PROOF_TYPE
    }

    public sign(
        rel: VerificationRelation,
        message: Uint8Array
    ): {
        ProofValue: Uint8Array
        VerificationMethod: string
        ProofType: string
    } {
        const key = this.getKey(rel)
        const signature = key.sign(message)
        return {
            ProofType: SIGNATURE_PROOF_TYPE,
            VerificationMethod: rel.toString(),
            ProofValue: signature,
        }
    }
}

export const createMnemonic = (): string => {
    return bip39.generateMnemonic(wordlist)
}
