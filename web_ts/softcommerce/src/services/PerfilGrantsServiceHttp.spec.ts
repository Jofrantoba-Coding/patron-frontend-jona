import { useTestServer } from '../../mock-server/http/test-server';
import { createHttpClient } from './httpClient';
import { createPerfilGrantsServiceHttp } from './PerfilGrantsServiceHttp';
import { describePerfilGrantsServiceContract, perfilGrantsSeed } from './perfilGrantsServiceContract';

const server = useTestServer({ seed: perfilGrantsSeed });

describePerfilGrantsServiceContract('PerfilGrantsServiceHttp against the live mock server', (getSession) =>
  createPerfilGrantsServiceHttp(createHttpClient({ baseUrl: server.url(), getSession })),
);
