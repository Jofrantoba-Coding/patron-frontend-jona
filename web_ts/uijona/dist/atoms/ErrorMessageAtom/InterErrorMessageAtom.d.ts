export type ErrorMessageType = 'error' | 'description';
export interface InterErrorMessageAtom {
    message?: string;
    type?: ErrorMessageType;
    id?: string;
    className?: string;
}
