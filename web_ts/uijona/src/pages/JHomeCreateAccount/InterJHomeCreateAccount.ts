// InterJHomeCreateAccount.ts — JONA Interface + defaults
export interface InterJHomeCreateAccount {
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

export const JHOME_CREATE_ACCOUNT_DEFAULTS: Required<Pick<InterJHomeCreateAccount,
  'nameError' | 'emailError' | 'passwordError' | 'confirmPasswordError' |
  'alertMessage' | 'isLoading' | 'appTitle' | 'footerText'
>> = {
  nameError: '',
  emailError: '',
  passwordError: '',
  confirmPasswordError: '',
  alertMessage: '',
  isLoading: false,
  appTitle: 'JONA UI',
  footerText: '© 2026 JONA Pattern',
};
