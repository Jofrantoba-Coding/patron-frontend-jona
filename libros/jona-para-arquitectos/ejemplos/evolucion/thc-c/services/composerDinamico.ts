// Alternativa (no está en el artículo): el mock se carga con import() dinámico, como en
// web_ts/softcommerce/src/services/serviceComposer.ts. El empaquetador lo deja en un trozo aparte.
import { composeConfig } from '../composeConfig.js';
import { crearCuentaService as real } from './crearCuentaService.js';

export const crearCuentaService: typeof real = composeConfig.register.useMock
  ? { registrar: async (data) => (await import('./crearCuentaService.mock.js')).crearCuentaService.registrar(data) }
  : real;
