# Knox Networks TS Server SDK

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
@knox-networks:registry=https://npm.pkg.github.com

//npm.pkg.github.com/:_authToken=<auth_token_here>
```

You can follow the [offical GitHub Packages guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages) to learn how to get a personal access token

## Installation
You can run the following command to install the `@knox-networks/server-sdk` package:
```sh
npm install @knox-networks/server-sdk
```
