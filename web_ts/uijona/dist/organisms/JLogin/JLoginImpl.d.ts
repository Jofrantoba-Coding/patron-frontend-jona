import React from 'react';
import { InterJLogin } from './InterJLogin';
type JLoginImplProps = Partial<InterJLogin> & Pick<InterJLogin, 'onSubmit'> & {
    email?: string;
    password?: string;
    setEmail?: (v: string) => void;
    setPassword?: (v: string) => void;
};
export declare const JLoginImpl: React.FC<JLoginImplProps>;
export {};
