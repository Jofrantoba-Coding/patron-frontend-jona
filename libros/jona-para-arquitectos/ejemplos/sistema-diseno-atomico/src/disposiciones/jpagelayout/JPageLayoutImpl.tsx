import { JPAGELAYOUT_DEFAULTS, type InterJPageLayout } from './InterJPageLayout.js';
import { JPageLayoutView } from './JPageLayoutView.js';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. */
export const JPageLayoutImpl = (props: InterJPageLayout) => <JPageLayoutView {...JPAGELAYOUT_DEFAULTS} {...props} />;
