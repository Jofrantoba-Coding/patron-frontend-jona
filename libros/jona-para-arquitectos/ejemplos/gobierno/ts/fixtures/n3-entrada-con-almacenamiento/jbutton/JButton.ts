import { JBUTTON_DEFAULTS, type InterJButton } from './InterJButton';
import { JButtonView } from './JButtonView';

export const JButton = (props: Partial<InterJButton>) =>
  JButtonView({ ...JBUTTON_DEFAULTS, texto: window.localStorage.getItem('texto') ?? 'Aceptar', ...props });
