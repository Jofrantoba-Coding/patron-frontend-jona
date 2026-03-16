import { InterEventsInputAtom } from '../../atoms/events/InterEventsInputAtom';
export interface InterEventsFormFieldMolecule extends InterEventsInputAtom {
    onValid?: (value: string) => void;
    onInvalid?: (value: string, errorMessage: string) => void;
}
