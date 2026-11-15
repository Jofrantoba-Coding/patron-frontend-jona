import { JBUTTON_DEFAULTS, type InterJButton } from './InterJButton.js';
import { JButtonView } from './JButtonView.js';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. */
export const JButtonImpl = (props: InterJButton) => <JButtonView {...JBUTTON_DEFAULTS} {...props} />;
