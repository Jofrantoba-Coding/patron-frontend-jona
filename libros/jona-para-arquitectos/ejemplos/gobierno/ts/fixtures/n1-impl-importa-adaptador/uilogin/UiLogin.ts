import { crearUiLoginImpl } from './UiLoginImpl';
import { UiLoginView } from './UiLoginView';

export const UiLogin = () => UiLoginView(crearUiLoginImpl());
