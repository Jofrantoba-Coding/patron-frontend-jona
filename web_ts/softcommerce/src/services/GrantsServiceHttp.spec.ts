import { useTestServer } from '../../mock-server/http/test-server';
import { createGrantsServiceHttp } from './GrantsServiceHttp';
import { createHttpClient } from './httpClient';
import { describeGrantsServiceContract, grantsSeed } from './shellServiceContract.snapshot';

const server = useTestServer({ seed: grantsSeed });

describeGrantsServiceContract('GrantsServiceHttp against the live mock server', (getSession, getRequestContext) =>
  createGrantsServiceHttp(createHttpClient({ baseUrl: server.url(), getSession, getRequestContext })),
);
