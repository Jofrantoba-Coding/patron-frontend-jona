import { JIMAGE_DEFAULTS, type InterJImage } from './InterJImage.js';
import { JImageView } from './JImageView.js';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. */
export const JImageImpl = (props: InterJImage) => <JImageView {...JIMAGE_DEFAULTS} {...props} />;
