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
export declare const UI_HOME_ERROR_DEFAULTS: Required<Pick<InterUiHomeError, 'errorCode' | 'title' | 'message' | 'primaryLabel' | 'secondaryLabel' | 'appTitle' | 'footerText'>>;
