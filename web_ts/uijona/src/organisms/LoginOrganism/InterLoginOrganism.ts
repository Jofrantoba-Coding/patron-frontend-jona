// InterLoginOrganism.ts — JONA Interface + defaults
export interface InterLoginOrganism {
  // state
  email: string;
  password: string;
  emailError?: string;
  passwordError?: string;
  alertMessage?: string;
  isLoading?: boolean;
  // setters
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  // handlers
  onSubmit: (e: React.FormEvent) => void;
  onGoToCreateAccount?: () => void;
  onGoToRecoverPassword?: () => void;
}

export const LOGIN_ORGANISM_DEFAULTS: Required<Pick<InterLoginOrganism,
  'emailError' | 'passwordError' | 'alertMessage' | 'isLoading'
>> = {
  emailError: '',
  passwordError: '',
  alertMessage: '',
  isLoading: false,
};
