import { default as React } from '../../../node_modules/react';
import { InterLoginOrganism } from './InterLoginOrganism';

type LoginOrganismImplProps = Partial<InterLoginOrganism> & Pick<InterLoginOrganism, 'onSubmit'> & {
    email?: string;
    password?: string;
    setEmail?: (v: string) => void;
    setPassword?: (v: string) => void;
};
export declare const LoginOrganismImpl: React.FC<LoginOrganismImplProps>;
export {};
