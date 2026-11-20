import { JLINK_DEFAULTS, type InterJLink } from './InterJLink.js';
import { JLinkView } from './JLinkView.js';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. */
export const JLinkImpl = (props: InterJLink) => <JLinkView {...JLINK_DEFAULTS} {...props} />;
