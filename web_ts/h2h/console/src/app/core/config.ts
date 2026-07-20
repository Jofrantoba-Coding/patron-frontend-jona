import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

const localOverride = (key: string): string | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
};

/**
 * Base URL del mock server H2H (ver web_ts/h2h/mock-server).
 * Solo para endpoints sin backend real todavía. Override: localStorage.H2H_MOCK_BASE.
 */
export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () => localOverride('H2H_MOCK_BASE') ?? environment.mockBaseUrl,
});

/**
 * Base URL del backend Java H2H real, servido a través del gateway
 * (OAuth2 + TokenRelay). Override: localStorage.H2H_BACKEND_BASE.
 */
export const H2H_BACKEND_BASE = new InjectionToken<string>('H2H_BACKEND_BASE', {
  providedIn: 'root',
  factory: () => localOverride('H2H_BACKEND_BASE') ?? environment.h2hBackendBase,
});
