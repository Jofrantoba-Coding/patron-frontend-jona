// InterEventsFormFieldMolecule.ts — Observer: Event Contract for FormFieldMolecule
// Declares every event FormFieldMolecule can emit.
// Composes InterEventsInputAtom since FormField wraps an InputAtom.
import { InterEventsInputAtom } from '../../atoms/events/InterEventsInputAtom';

export interface InterEventsFormFieldMolecule extends InterEventsInputAtom {
  /** Fired when validation runs and the field is valid */
  onValid?: (value: string) => void;

  /** Fired when validation runs and the field is invalid — carries error message */
  onInvalid?: (value: string, errorMessage: string) => void;
}
