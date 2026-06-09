import React from 'react';
import { InterJHomeLogin } from './InterJHomeLogin';
type JHomeLoginImplProps = Partial<InterJHomeLogin> & {
    /** Called with email + password when validation passes */
    onLogin?: (email: string, password: string) => void | Promise<void>;
};
export declare const JHomeLoginImpl: React.FC<JHomeLoginImplProps>;
export {};
