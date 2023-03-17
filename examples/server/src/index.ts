import { KnoxClient, CredentialType } from "@knox-networks/server-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const client = new KnoxClient({
    network: {
        credentialAdapterURL: process.env.CREDENTIAL_ADAPTER_URL,
        userServiceURL: process.env.USER_SERVICE_URL,
        registryURL: process.env.REGISTRY_URL,
    },
});

const getCredential = async () => {
    const [did_doc, kps] = await client.identity.generate();

    let token = await client.token.create({
        password: {
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD,
        },
        signer: kps,
    });

    const vc = await client.credential.request({
        signer: kps,
        accessToken: token.token,
        credentialType: CredentialType.BANK_ACCOUNT,
    });

    console.log(did_doc, kps);
    console.log(vc);
};

getCredential().then();
