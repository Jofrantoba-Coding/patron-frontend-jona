// Valores que test/mockServer.globalSetup.ts entrega a las pruebas (vitest provide/inject).
import 'vitest';

declare module 'vitest' {
  export interface ProvidedContext {
    apiUrl: string;
    apiIsMock: boolean;
  }
}
