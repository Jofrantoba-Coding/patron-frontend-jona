import { describeGrantsServiceContract, grantsSeed } from '../shellServiceContract.snapshot';
import { createAppServicesMock } from './AppServicesMock';

describeGrantsServiceContract('AppServicesMock exitoso', (getSession, getRequestContext) =>
  createAppServicesMock('exitoso', { getSession, getRequestContext, delayMs: 0, seed: grantsSeed }).grants,
);
