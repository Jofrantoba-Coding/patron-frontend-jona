export interface InterUiHomeRecoverPassword {
    email: string;
    emailError: string;
    alertMessage: string;
    successMessage: string;
    isLoading: boolean;
    setEmail: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoToLogin?: () => void;
    appTitle?: string;
    footerText?: string;
}
export declare const UI_HOME_RECOVER_PASSWORD_DEFAULTS: Required<Pick<InterUiHomeRecoverPassword, 'emailError' | 'alertMessage' | 'successMessage' | 'isLoading' | 'appTitle' | 'footerText'>>;
