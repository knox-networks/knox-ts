import { UserApiService } from '@buf/knox-networks_user-mgmt.bufbuild_connect-es/user_api/v1/user_connect.js'
import { Provider } from '@buf/knox-networks_user-mgmt.bufbuild_es/user_api/v1/user_pb.js'

import { createPromiseClient, PromiseClient } from '@bufbuild/connect'
import { createGrpcTransport } from '@bufbuild/connect-node'
import { bytes } from 'multiformats'
import {
    AuthProvider,
    AuthToken,
    CreateTokenParams,
    GetAuthProviderCallbackParams,
    ProviderCallback,
    VerificationRelation,
} from './public.types'

export class TokenClient {
    private client: PromiseClient<typeof UserApiService>

    public constructor(serviceURL: string) {
        const transport = createGrpcTransport({
            baseUrl: serviceURL,
            httpVersion: '2',
        })

        this.client = createPromiseClient(UserApiService, transport)
    }

    async create(p: CreateTokenParams): Promise<AuthToken> {
        if (p.password) {
            const { authToken } = await this.client.authnWithPassword({
                email: p.password.email,
                password: p.password.password,
            })

            if (!authToken) {
                throw new Error('authToken returned was not defined')
            }

            return {
                token: authToken.token,
                refreshToken: authToken.refreshToken,
                expiresIn: authToken.expiresIn,
                tokenType: authToken.tokenType,
            }
        } else if (p.did) {
            const challenge = await this.parseChallenge(
                p.did.did,
                p.did.challenge
            )

            const signature = p.signer.sign(
                VerificationRelation.Authentication,
                bytes.fromString(challenge.nonce)
            )

            const { authToken } = await this.client.authnWallet({
                signature: signature.ProofValue,
                nonce: challenge.nonce,
                did: p.did.did,
            })

            if (!authToken) {
                throw new Error('authToken returned was not defined')
            }

            return {
                token: authToken.token,
                refreshToken: authToken.refreshToken,
                expiresIn: authToken.expiresIn,
                tokenType: authToken.tokenType,
            }
        } else {
            throw new Error('No authentication method specified')
        }
    }

    async get_auth_provider_callback(
        params: GetAuthProviderCallbackParams
    ): Promise<ProviderCallback> {
        const { providerUrl } = await this.client.authnWithProvider({
            requestOrigin: params.requestOrigin,
            clientState: params.clientState,
            instanceName: params.instanceName,
            provider: providerToProtoProvider(params.provider),
        })

        return {
            providerUrl,
        }
    }

    private async parseChallenge(
        did: string,
        challenge?: { nonce: string }
    ): Promise<{ nonce: string }> {
        if (challenge) {
            return challenge
        } else {
            return await this.client.createAuthnWalletChallenge({
                did,
            })
        }
    }
}

const providerToProtoProvider = (p: AuthProvider): Provider => {
    switch (p) {
        case AuthProvider.Google: {
            return Provider.GOOGLE
        }

        case AuthProvider.Github: {
            return Provider.GITHUB
        }
        case AuthProvider.Facebook: {
            return Provider.FACEBOOK
        }
        case AuthProvider.Cognito: {
            return Provider.COGNITO
        }
        case AuthProvider.Saml: {
            return Provider.SAML
        }
        default: {
            throw new Error('no associated provider found')
        }
    }
}
