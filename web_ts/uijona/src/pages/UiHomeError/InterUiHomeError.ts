// InterUiHomeError.ts — JONA Interface + defaults
export interface InterUiHomeError {
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

export const UI_HOME_ERROR_DEFAULTS: Required<Pick<InterUiHomeError,
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
