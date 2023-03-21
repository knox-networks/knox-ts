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

    // Commenting out until following issue is resolved https://github.com/paulmillr/ed25519-keygen/issues/5
    await client.identity.associate({
        token: token.token,
        signer: kps,
    });

    const vc = await client.credential.request({
        signer: kps,
        accessToken: token.token,
        credentialType: CredentialType.BankAccount,
    });

    console.log(did_doc, kps);
    console.log(vc);
};

getCredential().then();
