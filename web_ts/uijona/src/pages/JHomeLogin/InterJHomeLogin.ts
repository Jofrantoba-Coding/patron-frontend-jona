// InterJHomeLogin.ts — JONA Interface + defaults
export interface InterJHomeLogin {
  // state
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  alertMessage: string;
  isLoading: boolean;
  // setters
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  // handlers
  onSubmit: (e: React.FormEvent) => void;
  onGoToCreateAccount?: () => void;
  onGoToRecoverPassword?: () => void;
  // layout labels
  appTitle?: string;
  footerText?: string;
}

export const JHOME_LOGIN_DEFAULTS: Required<Pick<InterJHomeLogin,
  'emailError' | 'passwordError' | 'alertMessage' | 'isLoading' | 'appTitle' | 'footerText'
>> = {
  emailError: '',
  passwordError: '',
  alertMessage: '',
  isLoading: false,
  appTitle: 'JONA UI',
  footerText: '© 2026 JONA Pattern',
};
