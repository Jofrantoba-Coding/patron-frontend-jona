import { JCHECKBOX_DEFAULTS, type InterJCheckbox } from './InterJCheckbox';
import { JCheckboxView } from './JCheckboxView';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. */
export const JCheckboxImpl = (props: InterJCheckbox) => <JCheckboxView {...JCHECKBOX_DEFAULTS} {...props} />;
