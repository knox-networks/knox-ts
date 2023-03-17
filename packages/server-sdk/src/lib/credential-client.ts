import { CredentialAdapterService } from '@buf/knox-networks_credential-adapter.bufbuild_connect-es/vc_api/v1/vc_connect.js'
import { CredentialType } from '@buf/knox-networks_credential-adapter.bufbuild_es/vc_api/v1/vc_pb.js'
import { createPromiseClient, PromiseClient } from '@bufbuild/connect'
import { createGrpcTransport } from '@bufbuild/connect-node'
import { bytes } from 'multiformats'
import {
    RequestCredentialParams,
    VerifiableCredential,
    VerificationRelation,
} from './public.types'

export class CredentialClient {
    private readonly client: PromiseClient<typeof CredentialAdapterService>

    public constructor(serviceURL: string) {
        const transport = createGrpcTransport({
            baseUrl: serviceURL,
            httpVersion: '2',
        })

        this.client = createPromiseClient(CredentialAdapterService, transport)
    }

    public async request(
        params: RequestCredentialParams
    ): Promise<VerifiableCredential> {
        const did = params.signer.getDid()
        const credentialType = params.credentialType
        const challenge = await this.parseChallenge(
            did,
            params.accessToken,
            credentialType,
            params.challenge
        )

        const signature = params.signer.sign(
            VerificationRelation.Authentication,
            bytes.fromString(challenge.nonce)
        ).ProofValue

        const { credential } = await this.client.issueVerifiableCredential(
            {
                did,
                signature,
                nonce: challenge.nonce,
                credentialType: credentialType,
            },
            {
                headers: {
                    Authorization: `Bearer ${params.accessToken}`,
                },
            }
        )

        return {
            credential,
            credentialType: params.credentialType,
        }
    }

    private async parseChallenge(
        did: string,
        accessToken: string,
        credentialType: CredentialType,
        challenge?: { nonce: string }
    ): Promise<{ nonce: string }> {
        if (challenge) {
            return challenge
        } else {
            const challenge = await this.client.createIssuanceChallenge(
                {
                    did,
                    credentialType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            return challenge
        }
    }
}
