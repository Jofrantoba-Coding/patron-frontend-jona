import { describeSocioAccionesServiceContract } from '../socioAccionesServiceContract';
import { createAppServicesMock } from './AppServicesMock';

describeSocioAccionesServiceContract('AppServicesMock', (tenantId) => createAppServicesMock('exitoso', { getSession: () => ({ tenantId }), delayMs: 0 }).socioAcciones);
