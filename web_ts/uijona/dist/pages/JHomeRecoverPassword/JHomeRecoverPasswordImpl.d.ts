import React from 'react';
import { InterJHomeRecoverPassword } from './InterJHomeRecoverPassword';
type JHomeRecoverPasswordImplProps = Partial<InterJHomeRecoverPassword> & {
    /** Called with email when validation passes */
    onRecover?: (email: string) => void | Promise<void>;
};
export declare const JHomeRecoverPasswordImpl: React.FC<JHomeRecoverPasswordImplProps>;
export {};
