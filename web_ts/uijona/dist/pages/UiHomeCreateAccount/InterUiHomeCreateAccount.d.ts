export interface InterUiHomeCreateAccount {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    nameError: string;
    emailError: string;
    passwordError: string;
    confirmPasswordError: string;
    alertMessage: string;
    isLoading: boolean;
    setName: (v: string) => void;
    setEmail: (v: string) => void;
    setPassword: (v: string) => void;
    setConfirmPassword: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoToLogin?: () => void;
    appTitle?: string;
    footerText?: string;
}
export declare const UI_HOME_CREATE_ACCOUNT_DEFAULTS: Required<Pick<InterUiHomeCreateAccount, 'nameError' | 'emailError' | 'passwordError' | 'confirmPasswordError' | 'alertMessage' | 'isLoading' | 'appTitle' | 'footerText'>>;
