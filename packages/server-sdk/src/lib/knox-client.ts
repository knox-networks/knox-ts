import { CredentialClient } from './credential-client'
import { IdentityClient } from './identity-client'
import { PresentationClient } from './presentation-client'
import { KnoxConfig } from './public.types'
import { TokenClient } from './token-client'

export class KnoxClient {
    public readonly credential: CredentialClient

    public readonly identity: IdentityClient

    public readonly presentation: PresentationClient

    public readonly token: TokenClient

    public constructor(config: KnoxConfig) {
        if (!config.network.credentialAdapterURL) {
            throw new Error('Missing credentialAdapterURL')
        }

        if (!config.network.userServiceURL) {
            throw new Error('Missing userServiceURL')
        }

        if (!config.network.registryURL) {
            throw new Error('Missing registryURL')
        }

        this.credential = new CredentialClient(
            config.network.credentialAdapterURL
        )

        this.identity = new IdentityClient(
            config.network.userServiceURL,
            config.network.registryURL
        )

        this.presentation = new PresentationClient(
            config.network.credentialAdapterURL
        )

        this.token = new TokenClient(config.network.userServiceURL)
    }
}
