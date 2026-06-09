export interface InterJErrorPage {
    errorCode?: string | number;
    title?: string;
    message?: string;
    onGoHome?: () => void;
    onGoBack?: () => void;
    primaryLabel?: string;
    secondaryLabel?: string;
}
export declare const JERROR_PAGE_DEFAULTS: Required<Pick<InterJErrorPage, 'errorCode' | 'title' | 'message' | 'primaryLabel' | 'secondaryLabel'>>;
