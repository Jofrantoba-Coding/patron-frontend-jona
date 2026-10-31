import type { InterAuthService } from '../servicios/InterAuthService';
import { crearUiLoginImpl } from './UiLoginImpl';
import { UiLoginView } from './UiLoginView';

export const UiLogin = (servicio: InterAuthService) => UiLoginView(crearUiLoginImpl(servicio));
