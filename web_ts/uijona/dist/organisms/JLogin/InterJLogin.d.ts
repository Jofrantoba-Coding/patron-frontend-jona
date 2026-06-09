export interface InterJLogin {
    email: string;
    password: string;
    emailError?: string;
    passwordError?: string;
    alertMessage?: string;
    isLoading?: boolean;
    setEmail: (v: string) => void;
    setPassword: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoToCreateAccount?: () => void;
    onGoToRecoverPassword?: () => void;
}
export declare const JLOGIN_DEFAULTS: Required<Pick<InterJLogin, 'emailError' | 'passwordError' | 'alertMessage' | 'isLoading'>>;
