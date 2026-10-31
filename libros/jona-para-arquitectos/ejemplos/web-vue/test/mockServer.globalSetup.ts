import { spawn, type ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { TestProject } from 'vitest/node';

const MOCK_SERVER = fileURLToPath(new URL('../../mock-server/src/server.mjs', import.meta.url));

declare module 'vitest' {
  export interface ProvidedContext {
    /** URL base contra la que corre la suite de contrato de AuthServiceHttp. */
    apiUrl: string;
    /** false cuando CONTRATO_API_URL apunta a un backend real (sin escenarios). */
    apiIsMock: boolean;
  }
}

/**
 * Sin variables: arranca el servidor mock en un puerto libre y lo detiene al terminar.
 * Con CONTRATO_API_URL=<url>: corre la misma suite contra ese backend.
 */
export default async function setup(project: TestProject): Promise<(() => void) | undefined> {
  const external = process.env.CONTRATO_API_URL;
  if (external) {
    project.provide('apiUrl', external);
    project.provide('apiIsMock', false);
    return undefined;
  }

  const child: ChildProcess = spawn(process.execPath, [MOCK_SERVER], {
    env: { ...process.env, PORT: '0' },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const url = await new Promise<string>((resolve, reject) => {
    child.stdout?.on('data', (chunk) => {
      const match = /http:\/\/127\.0\.0\.1:\d+/.exec(String(chunk));
      if (match) resolve(match[0]);
    });
    child.on('exit', (code) => reject(new Error(`El servidor mock terminó con código ${code}`)));
  });
  project.provide('apiUrl', url);
  project.provide('apiIsMock', true);
  return () => {
    child.kill();
  };
}
