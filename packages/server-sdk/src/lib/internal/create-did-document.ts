import {DidDocument, VerificationRelation} from '../public.types';
import {KeyPairs} from './key-pairs';

export const createDidDocument = (kps: KeyPairs): DidDocument => {
    return {
        '@context': [
            'https://www.w3.org/ns/did/v1',
            'https://w3id.org/security/suites/ed25519-2020/v1'
        ],
        id: kps.getDid(),
        authentication: [
            kps.getKeyMaterial(VerificationRelation.Authentication)
        ],
        capabilityInvocation: [
            kps.getKeyMaterial(VerificationRelation.CapabilityInvocation)
        ],
        capabilityDelegation: [
            kps.getKeyMaterial(VerificationRelation.CapabilityDelegation)
        ],
        assertionMethod: [
            kps.getKeyMaterial(VerificationRelation.AssertionMethod)
        ]
    };
};
