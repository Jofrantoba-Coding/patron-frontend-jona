// @vitest-environment node
import { inject } from 'vitest';
import { createLoginHandler } from './main/loginHandler';
import { createAuthServiceIpc } from './renderer/services/AuthServiceIpc';
import { describeAuthServiceContract } from './shared/services/authServiceContract';
import { createAuthServiceFake } from './shared/services/AuthServiceFake';
import { createAuthServiceHttp } from './shared/services/AuthServiceHttp';
import type { InterAuthService } from './shared/services/InterAuthService';

/** La cadena completa sin Electron: adaptador IPC -> manejador del proceso principal -> servicio. */
const overIpc = (service: InterAuthService) => {
  const handle = createLoginHandler(service);
  return createAuthServiceIpc({ login: (email, password) => handle(email, password) });
};

describeAuthServiceContract('IPC sobre AuthServiceFake', () => overIpc(createAuthServiceFake()));

describeAuthServiceContract(`IPC sobre AuthServiceHttp contra ${inject('apiUrl')}`, () =>
  overIpc(createAuthServiceHttp({ baseUrl: inject('apiUrl') })));
