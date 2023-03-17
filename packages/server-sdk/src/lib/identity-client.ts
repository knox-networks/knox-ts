import { RegistryService } from '@buf/knox-networks_registry-mgmt.bufbuild_connect-es/registry_api/v1/registry_connect.js'
import { UserApiService } from '@buf/knox-networks_user-mgmt.bufbuild_connect-es/user_api/v1/user_connect.js'
import { createPromiseClient, PromiseClient } from '@bufbuild/connect'
import { createGrpcTransport } from '@bufbuild/connect-node'
import { createDidDocument } from './internal/create-did-document'
import { bytes } from 'multiformats'
import { createMnemonic, KeyPairs } from './internal/key-pairs'
import {
    DidDocument,
    RecoverIdentityParams,
    AssociateIdentityParams,
    VerificationRelation,
} from './public.types'

export class IdentityClient {
    private readonly client: PromiseClient<typeof UserApiService>

    public readonly registry: PromiseClient<typeof RegistryService>

    public constructor(userServiceURL: string, registryURL: string) {
        const userTransport = createGrpcTransport({
            baseUrl: userServiceURL,
            httpVersion: '2',
        })

        const registryTransport = createGrpcTransport({
            baseUrl: registryURL,
            httpVersion: '2',
        })

        const client = createPromiseClient(UserApiService, userTransport)
        const registry = createPromiseClient(RegistryService, registryTransport)
        this.client = client
        this.registry = registry
    }

    public async generate(): Promise<[DidDocument, KeyPairs]> {
        const mnemonic = createMnemonic()

        const kps = new KeyPairs(mnemonic)

        const did_doc = createDidDocument(kps)

        await this.registry.create({
            did: did_doc.id,
            document: JSON.stringify(did_doc),
        })

        return [did_doc, kps]
    }

    public async recover(
        params: RecoverIdentityParams
    ): Promise<[DidDocument, KeyPairs]> {
        const kps = new KeyPairs(params.mnemonic)

        const did_doc = createDidDocument(kps)

        return [did_doc, kps]
    }

    public async associate(params: AssociateIdentityParams) {
        const did = params.signer.getDid()
        if (params.challenge) {
            const nonce = params.challenge.nonce
            const signature = params.signer.sign(
                VerificationRelation.Authentication,
                bytes.fromString(`${did}.${nonce}`)
            ).ProofValue

            await this.client.registerWallet(
                {
                    did,
                    signature,
                    nonce,
                },
                {
                    headers: {
                        Authorization: `Bearer ${params.token}`,
                    },
                }
            )
        } else {
            const stream = this.client.createRegisterWalletChallenge(
                {},
                {
                    headers: {
                        Authorization: `Bearer ${params.token}`,
                    },
                }
            )

            for await (const { registrationStart } of stream) {
                if (registrationStart.case === 'ok') {
                    break
                } else {
                    const nonce = registrationStart.value
                    const signature = params.signer.sign(
                        VerificationRelation.Authentication,
                        bytes.fromString(`${did}.${nonce}`)
                    ).ProofValue
                    await this.client.registerWallet(
                        {
                            did,
                            signature,
                            nonce,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${params.token}`,
                            },
                        }
                    )
                }
            }
        }
    }
}
