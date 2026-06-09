// InterJErrorPage.ts — JONA Interface + defaults
export interface InterJErrorPage {
  errorCode?: string | number;
  title?: string;
  message?: string;
  onGoHome?: () => void;
  onGoBack?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export const JERROR_PAGE_DEFAULTS: Required<Pick<InterJErrorPage,
  'errorCode' | 'title' | 'message' | 'primaryLabel' | 'secondaryLabel'
>> = {
  errorCode: '404',
  title: 'Page not found',
  message: "The page you're looking for doesn't exist or has been moved.",
  primaryLabel: 'Go home',
  secondaryLabel: 'Go back',
};
