// InterJHomeError.ts — JONA Interface + defaults
export interface InterJHomeError {
  errorCode?: string | number;
  title?: string;
  message?: string;
  onGoHome?: () => void;
  onGoBack?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  appTitle?: string;
  footerText?: string;
}

export const JHOME_ERROR_DEFAULTS: Required<Pick<InterJHomeError,
  'errorCode' | 'title' | 'message' | 'primaryLabel' | 'secondaryLabel' | 'appTitle' | 'footerText'
>> = {
  errorCode: '404',
  title: 'Page not found',
  message: "The page you're looking for doesn't exist or has been moved.",
  primaryLabel: 'Go home',
  secondaryLabel: 'Go back',
  appTitle: 'JONA UI',
  footerText: '© 2026 JONA Pattern',
};
