# Knox Networks TS Server SDK
Knox Networks is focused on providing secure, scalable, and user-friendly solutions for digital identity management. Using our server-sdk, developers can easily integrate digital identity capabilities into their projects, including the addition of verifiable credentials that are signed with encryption and shared with third parties through digital wallets.

This open-source Node.js project, coded in TypeScript, demonstrates how to use our server-sdk for digital identity management. It is structured as a monorepo containing two child projects:
1. `examples/server`: A Node.js and TypeScript example of building your own server and installing our server-sdk to make requests to the KnoxClient imported from the @knox-networks/server-sdk package.
2. `packages/server-sdk`: The TypeScript project for the server-sdk, containing the KnoxClient class that developers can use.

## Prequisites
### Package.json
In your package.json you need to have added `type`: `module` as one of key-value pair. So your package.json could look something like this:
```json
{
    "name": "@knox-networks/server-sdk",
    "version": "1.0.0",
    "private": true,
    "description": "",
    "license": "ISC",
    "author": "",
    "type": "module",
    "scripts": {
    },
    "dependencies": {
    },
}
```

### GitHub Access
In order to download a package published to GitHub packages, you will need a Personal GitHub Access Token in your .npmrc, alongside the configuration for the Knox Networks GitHub Registry. So your `.npmrc` should look something like:
```
@buf:registry https://buf.build/gen/npm/v1
@knox-networks:registry=https://npm.pkg.github.com

//npm.pkg.github.com/:_authToken=<auth_token_here>
```

You can follow the [offical GitHub Packages guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages) to learn how to get a personal access token

## Installation
You can run the following command to install the `@knox-networks/server-sdk` package:
```sh
npm install @knox-networks/server-sdk@1.0.0
```

## Basic Usage of the Server SDK
Here's a simple example of how to use the server-sdk:
```javascript
import * as Knox from "@knox-networks/server-sdk"; 
const client = new Knox.KnoxClient({ network: { credentialAdapterURL: process.env.CREDENTIAL_ADAPTER_URL, userServiceURL: process.env.USER_SERVICE_URL, registryURL: process.env.REGISTRY_URL, }, }); // A signer object is needed for signing DID documents signer: null  
const createWallet = async () => { const [did_doc, kps] = await client.identity.generate();console.log(did_doc, kps); }; createWallet().then();
```

To use the SDK, follow these steps:
1. Import the @knox-networks/server-sdk package.
2. Create a new KnoxClient instance, providing the required configuration options.
3. Use the identity.generate() method to create a new DID document and keypair.

4. In this example, we print the DID document and keypair to the console.
npm install @knox-networks/server-sdk
```
