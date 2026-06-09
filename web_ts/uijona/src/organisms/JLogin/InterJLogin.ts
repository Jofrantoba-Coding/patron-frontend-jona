// InterJLogin.ts — JONA Interface + defaults
export interface InterJLogin {
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

export const JLOGIN_DEFAULTS: Required<Pick<InterJLogin,
  'emailError' | 'passwordError' | 'alertMessage' | 'isLoading'
>> = {
  emailError: '',
  passwordError: '',
  alertMessage: '',
  isLoading: false,
};
