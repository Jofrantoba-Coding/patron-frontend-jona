import { InjectionToken } from '@angular/core';

const localOverride = (key: string): string | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
};

/** Base URL del mock server H2H (ver web_ts/h2h/mock-server). */
export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () => localOverride('H2H_MOCK_BASE') ?? 'http://localhost:4010',
});

/** Base URL del backend Java H2H real. Override: localStorage.H2H_BACKEND_BASE. */
export const H2H_BACKEND_BASE = new InjectionToken<string>('H2H_BACKEND_BASE', {
  providedIn: 'root',
  factory: () => localOverride('H2H_BACKEND_BASE') ?? 'http://localhost:9001/api/mantenimientos/h2h/v1',
});
