// InterRecoverPasswordOrganism.ts — JONA Interface + defaults
export interface InterRecoverPasswordOrganism {
  email: string;
  emailError?: string;
  alertMessage?: string;
  successMessage?: string;
  isLoading?: boolean;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoToLogin?: () => void;
}

export const RECOVER_PASSWORD_ORGANISM_DEFAULTS: Required<Pick<InterRecoverPasswordOrganism,
  'emailError' | 'alertMessage' | 'successMessage' | 'isLoading'
>> = {
  emailError: '',
  alertMessage: '',
  successMessage: '',
  isLoading: false,
};
