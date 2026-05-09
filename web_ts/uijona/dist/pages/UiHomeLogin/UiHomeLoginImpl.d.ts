import { default as React } from '../../../node_modules/react';
import { InterUiHomeLogin } from './InterUiHomeLogin';

type UiHomeLoginImplProps = Partial<InterUiHomeLogin> & {
    /** Called with email + password when validation passes */
    onLogin?: (email: string, password: string) => void | Promise<void>;
};
export declare const UiHomeLoginImpl: React.FC<UiHomeLoginImplProps>;
export {};
