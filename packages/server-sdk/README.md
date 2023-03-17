### Knox Networks Server SDK - Digital Identity and Verifiable Credentials
Knox Networks is focused on providing secure, scalable, and user-friendly solutions for digital identity management. Using our server-sdk, developers can easily integrate digital identity capabilities into their projects, including the addition of verifiable credentials that are signed with encryption and shared with third parties through digital wallets.

This open-source Node.js project, coded in TypeScript, demonstrates how to use our server-sdk for digital identity management. It is structured as a monorepo containing two child projects:
1. `examples/server`: A Node.js and TypeScript example of building your own server and installing our server-sdk to make requests to the KnoxClient imported from the @knox-networks/server-sdk package.
2. `packages/server-sdk`: The TypeScript project for the server-sdk, containing the KnoxClient class that developers can use.

Throughout this README, we will use the following terminology:
- DID: Digital Identity Identifier
- VC: Verifiable Credential
- VS: Verifiable Subject

#### Getting Started
###### Configuring npm to Access a GitHub Registry
To access the Knox Networks GitHub registry, add the following lines to your project's `.npmrc` file:

```shell
@knox-networks:registry=https://npm.pkg.github.com @buf:registry=https://buf.build/gen/npm/v1/
```

#### Installing the SDK with npm
Install the server-sdk in your project by running the following command:
```shell
npm install @knox-networks/server-sdk
```

#### Using npm Scripts in the Monorepo
You can run the following npm scripts at the top level of the monorepo, and they will be executed in all the workspaces:
- npm install: Installs all dependencies for the workspaces.
- npm run clean: Cleans the build output for all the workspaces.
- npm run build: Builds all the workspaces, compiling the TypeScript source code into JavaScript.

#### Basic Usage of the Server SDK
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


####Conclusion
Knox Networks is committed to providing secure and user-friendly solutions for digital identity management. We hope that this server-sdk makes it easy for developers to build applications that leverage digital identity and verifiable credentials. If you have any questions, issues, or contributions, please feel free to open an issue or submit a pull request. Happy coding!
