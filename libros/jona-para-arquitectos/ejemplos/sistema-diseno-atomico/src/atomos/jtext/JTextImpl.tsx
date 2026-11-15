import { JTEXT_DEFAULTS, type InterJText } from './InterJText.js';
import { JTextView } from './JTextView.js';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. */
export const JTextImpl = (props: InterJText) => <JTextView {...JTEXT_DEFAULTS} {...props} />;
