export interface InterJRecoverPassword {
    email: string;
    emailError?: string;
    alertMessage?: string;
    successMessage?: string;
    isLoading?: boolean;
    setEmail: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoToLogin?: () => void;
}
export declare const JRECOVER_PASSWORD_DEFAULTS: Required<Pick<InterJRecoverPassword, 'emailError' | 'alertMessage' | 'successMessage' | 'isLoading'>>;
