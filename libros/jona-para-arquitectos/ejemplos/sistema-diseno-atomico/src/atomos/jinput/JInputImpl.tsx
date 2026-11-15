import { JINPUT_DEFAULTS, type InterJInput } from './InterJInput.js';
import { JInputView } from './JInputView.js';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. */
export const JInputImpl = (props: InterJInput) => <JInputView {...JINPUT_DEFAULTS} {...props} />;
