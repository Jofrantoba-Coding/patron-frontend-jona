export interface InterUiHomeLogin {
    email: string;
    password: string;
    emailError: string;
    passwordError: string;
    alertMessage: string;
    isLoading: boolean;
    setEmail: (v: string) => void;
    setPassword: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoToCreateAccount?: () => void;
    onGoToRecoverPassword?: () => void;
    appTitle?: string;
    footerText?: string;
}
export declare const UI_HOME_LOGIN_DEFAULTS: Required<Pick<InterUiHomeLogin, 'emailError' | 'passwordError' | 'alertMessage' | 'isLoading' | 'appTitle' | 'footerText'>>;
