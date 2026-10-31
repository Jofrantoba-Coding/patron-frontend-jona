import { JBUTTON_DEFAULTS, type InterJButton } from './InterJButton';
import { JButtonView } from './JButtonView';

/** Implementación: aplica los DEFAULTS y dibuja la vista. No hay servicios que inyectar. */
export const JButtonImpl = (props: InterJButton) => <JButtonView {...JBUTTON_DEFAULTS} {...props} />;
