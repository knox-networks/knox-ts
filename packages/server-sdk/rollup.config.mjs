import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import externals from 'rollup-plugin-node-externals';
import del from 'rollup-plugin-delete';
import pkg from './package.json' assert {type: 'json'};
import copy from 'rollup-plugin-copy';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: './src/index.ts',
        output: [
            // {file: pkg.main, format: 'cjs', sourcemap: true},
            // {file: pkg.module, format: 'es', sourcemap: true}
            {file: 'dist/index.js', format: 'es', sourcemap: true}
        ],
        plugins: [
            del({targets: 'dist/*'}),
            externals({deps: true}),
            nodeResolve({
                extensions: ['.js', '.ts']
            }),
            commonjs(),
            babel({
                babelHelpers: 'runtime',
                exclude: /^(.+\/)?node_modules\/.+$/,
                extensions: ['.js', '.ts']
            }),
            generatePackageJson({
                outputFolder: 'dist',
                baseContents: (pkg) => ({
                    name: pkg.name, // inherits version from root
                    version: pkg.version,
                    description: pkg.description,
                    repository: pkg.repository,
                    author: pkg.author,
                    sideEffects: false,
                    main: pkg.main.replace('dist/', ''),
                    // module: pkg.module.replace('dist/', ''),
                    types: pkg.types.replace('dist/', ''),
                    type: pkg.type,
                    dependencies: pkg.dependencies || {},
                    devDependencies: {}, // keep it blank
                    peerDependencies: pkg.peerDependencies || {},
                    publishConfig: {
                        registry: 'https://npm.pkg.github.com'
                    }
                })
            }),
            copy({
                targets: [{src: 'README.md', dest: 'dist'}]
            })
        ]
    },
    {
        input: './src/index.ts',
        output: [{file: './dist/build/index.js', sourcemap: true}],
        external: [
            '@buf/knox-networks_registry-mgmt.bufbuild_connect-es/registry_api/v1/registry_connect.js',
            '@buf/knox-networks_credential-adapter.bufbuild_connect-es/vc_api/v1/vc_connect.js',
            '@buf/knox-networks_user-mgmt.bufbuild_connect-es/user_api/v1/user_connect.js',
            '@buf/knox-networks_credential-adapter.bufbuild_es/vc_api/v1/vc_pb.js',
            '@bufbuild/connect',
            '@bufbuild/connect-node',
            '@scure/bip39',
            '@scure/bip39/wordlists/english.js',
            'ed25519-keygen/hdkey',
            'multiformats/bases/base58'
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json'
            })
        ]
    },
    {
        input: 'dist/build/index.d.ts',
        output: [{file: pkg.types, format: 'esm'}],
        external: [],
        plugins: [
            dts(),
            del({targets: 'dist/build', hook: 'buildEnd'})
        ]
    }
];
