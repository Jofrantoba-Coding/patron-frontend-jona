// Violación: el contrato de la molécula hereda el del átomo; un cambio en JInput rompe a JField.
import type { InterJInput } from '../../atomos/jinput';

export interface InterJField extends InterJInput {
  label: string;
}
