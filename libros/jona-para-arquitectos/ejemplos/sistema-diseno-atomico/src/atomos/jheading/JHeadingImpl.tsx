import { JHEADING_DEFAULTS, type InterJHeading } from './InterJHeading.js';
import { JHeadingView } from './JHeadingView.js';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. */
export const JHeadingImpl = (props: InterJHeading) => <JHeadingView {...JHEADING_DEFAULTS} {...props} />;
