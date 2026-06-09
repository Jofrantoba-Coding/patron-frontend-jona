import React from 'react';
import { InterJHomeCreateAccount } from './InterJHomeCreateAccount';
type JHomeCreateAccountImplProps = Partial<InterJHomeCreateAccount> & {
    /** Called with name, email, password when validation passes */
    onCreateAccount?: (name: string, email: string, password: string) => void | Promise<void>;
};
export declare const JHomeCreateAccountImpl: React.FC<JHomeCreateAccountImplProps>;
export {};
