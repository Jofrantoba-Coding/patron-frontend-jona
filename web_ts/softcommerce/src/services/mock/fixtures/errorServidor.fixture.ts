import type { ScenarioFixture } from './types';

export const errorServidorFixture: ScenarioFixture = {
  kind: 'error',
  status: 500,
  code: 'INTERNAL_ERROR',
  message: 'The server is not available. Try again in a few minutes.',
};
