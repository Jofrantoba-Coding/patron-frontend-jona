export interface InterLoginOrganism {
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
export declare const LOGIN_ORGANISM_DEFAULTS: Required<Pick<InterLoginOrganism, 'emailError' | 'passwordError' | 'alertMessage' | 'isLoading'>>;
