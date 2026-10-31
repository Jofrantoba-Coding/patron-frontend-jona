import { JBUTTON_DEFAULTS, type InterJButton } from './InterJButton';
import { JButtonView } from './JButtonView';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. */
export const JButtonImpl = (props: InterJButton) => <JButtonView {...JBUTTON_DEFAULTS} {...props} />;
