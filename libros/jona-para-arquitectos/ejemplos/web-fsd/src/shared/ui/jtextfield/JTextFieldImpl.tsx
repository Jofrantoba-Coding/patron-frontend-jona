import { JTEXTFIELD_DEFAULTS, type InterJTextField } from './InterJTextField';
import { JTextFieldView } from './JTextFieldView';

/** Implementación: aplica los DEFAULTS y dibuja la vista. No hay servicios que inyectar. */
export const JTextFieldImpl = (props: InterJTextField) => <JTextFieldView {...JTEXTFIELD_DEFAULTS} {...props} />;
