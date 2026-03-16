export interface InterErrorPageOrganism {
    errorCode?: string | number;
    title?: string;
    message?: string;
    onGoHome?: () => void;
    onGoBack?: () => void;
    primaryLabel?: string;
    secondaryLabel?: string;
}
export declare const ERROR_PAGE_ORGANISM_DEFAULTS: Required<Pick<InterErrorPageOrganism, 'errorCode' | 'title' | 'message' | 'primaryLabel' | 'secondaryLabel'>>;
