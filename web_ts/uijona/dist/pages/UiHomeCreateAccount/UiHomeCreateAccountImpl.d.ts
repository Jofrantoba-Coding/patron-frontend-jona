import React from 'react';
import { InterUiHomeCreateAccount } from './InterUiHomeCreateAccount';
type UiHomeCreateAccountImplProps = Partial<InterUiHomeCreateAccount> & {
    /** Called with name, email, password when validation passes */
    onCreateAccount?: (name: string, email: string, password: string) => void | Promise<void>;
};
export declare const UiHomeCreateAccountImpl: React.FC<UiHomeCreateAccountImplProps>;
export {};
