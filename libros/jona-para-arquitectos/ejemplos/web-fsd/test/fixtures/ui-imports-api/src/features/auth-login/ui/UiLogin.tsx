// Violación: la entrada crea su propio adaptador en lugar de recibir el servicio.
import { createAuthServiceFake } from '../api/createAuthServiceFake';

export const service = createAuthServiceFake();
