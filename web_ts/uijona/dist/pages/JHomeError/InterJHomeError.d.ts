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
export declare const JHOME_ERROR_DEFAULTS: Required<Pick<InterJHomeError, 'errorCode' | 'title' | 'message' | 'primaryLabel' | 'secondaryLabel' | 'appTitle' | 'footerText'>>;
