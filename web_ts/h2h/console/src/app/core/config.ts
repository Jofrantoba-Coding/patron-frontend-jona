import { InjectionToken } from '@angular/core';

/** Base URL del mock server H2H (ver web_ts/h2h/mock-server). */
export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () => 'http://localhost:4010',
});
