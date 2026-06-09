// InterJHomeRecoverPassword.ts — JONA Interface + defaults
export interface InterJHomeRecoverPassword {
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

export const JHOME_RECOVER_PASSWORD_DEFAULTS: Required<Pick<InterJHomeRecoverPassword,
  'emailError' | 'alertMessage' | 'successMessage' | 'isLoading' | 'appTitle' | 'footerText'
>> = {
  emailError: '',
  alertMessage: '',
  successMessage: '',
  isLoading: false,
  appTitle: 'JONA UI',
  footerText: '© 2026 JONA Pattern',
};
