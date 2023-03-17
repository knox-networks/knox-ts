import { CredentialAdapterService } from '@buf/knox-networks_credential-adapter.bufbuild_connect-es/vc_api/v1/vc_connect.js'
import { createPromiseClient, PromiseClient } from '@bufbuild/connect'
import { createGrpcTransport } from '@bufbuild/connect-node'

export class PresentationClient {
    private readonly client: PromiseClient<typeof CredentialAdapterService>

    public constructor(serviceURL: string) {
        const transport = createGrpcTransport({
            baseUrl: serviceURL,
            httpVersion: '2',
        })

        this.client = createPromiseClient(CredentialAdapterService, transport)
    }
}
