import React from 'react';
import { InterRecoverPasswordOrganism } from './InterRecoverPasswordOrganism';
type RecoverPasswordOrganismImplProps = Partial<InterRecoverPasswordOrganism> & Pick<InterRecoverPasswordOrganism, 'onSubmit'> & {
    email?: string;
    setEmail?: (v: string) => void;
};
export declare const RecoverPasswordOrganismImpl: React.FC<RecoverPasswordOrganismImplProps>;
export {};
