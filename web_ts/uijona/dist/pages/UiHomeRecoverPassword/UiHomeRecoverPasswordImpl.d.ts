import React from 'react';
import { InterUiHomeRecoverPassword } from './InterUiHomeRecoverPassword';
type UiHomeRecoverPasswordImplProps = Partial<InterUiHomeRecoverPassword> & {
    /** Called with email when validation passes */
    onRecover?: (email: string) => void | Promise<void>;
};
export declare const UiHomeRecoverPasswordImpl: React.FC<UiHomeRecoverPasswordImplProps>;
export {};
