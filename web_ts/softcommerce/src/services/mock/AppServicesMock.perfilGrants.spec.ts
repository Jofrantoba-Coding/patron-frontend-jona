import { describePerfilGrantsServiceContract, perfilGrantsSeed } from '../perfilGrantsServiceContract';
import { createAppServicesMock } from './AppServicesMock';

describePerfilGrantsServiceContract('AppServicesMock exitoso', (getSession) =>
  createAppServicesMock('exitoso', { getSession, delayMs: 0, seed: perfilGrantsSeed }).perfilGrants,
);
