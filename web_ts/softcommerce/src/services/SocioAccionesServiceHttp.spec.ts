import { fileURLToPath } from 'node:url';
import { useTestServer } from '../../mock-server/http/test-server';
import { createHttpClient } from './httpClient';
import { createSocioAccionesServiceHttp } from './SocioAccionesServiceHttp';
import { describeSocioAccionesServiceContract } from './socioAccionesServiceContract';

const server = useTestServer({ dataDir: fileURLToPath(new URL('../../mock-server/data', import.meta.url)) });

describeSocioAccionesServiceContract('SocioAccionesServiceHttp against the live mock server', (tenantId) =>
  createSocioAccionesServiceHttp(createHttpClient({ baseUrl: server.url(), getSession: () => ({ tenantId }) })),
);
