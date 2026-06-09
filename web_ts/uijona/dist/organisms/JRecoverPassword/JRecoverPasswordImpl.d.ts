import React from 'react';
import { InterJRecoverPassword } from './InterJRecoverPassword';
type JRecoverPasswordImplProps = Partial<InterJRecoverPassword> & Pick<InterJRecoverPassword, 'onSubmit'> & {
    email?: string;
    setEmail?: (v: string) => void;
};
export declare const JRecoverPasswordImpl: React.FC<JRecoverPasswordImplProps>;
export {};
