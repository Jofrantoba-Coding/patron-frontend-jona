import type { InterUiLogin } from '../uilogin/InterUiLogin';
import type { InterJButton } from './InterJButton';

export const JButtonView = ({ texto }: InterJButton, _login?: InterUiLogin) => `<button>${texto}</button>`;
