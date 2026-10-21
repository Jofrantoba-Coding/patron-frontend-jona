import type { FormEvent, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../../appStorage';
import type { InterAuthService } from '../../services/InterAuthService';
import { exitosoFixture } from '../../services/fixtures/auth/exitoso.fixture';
import { useUiIniciarSesionImpl } from './UiIniciarSesionImpl';

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

function fakeSubmitEvent(): FormEvent<HTMLFormElement> {
  return { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>;
}

function fakeService(login: InterAuthService['login']): InterAuthService {
  return { login: vi.fn(login) };
}

function renderImpl(service: InterAuthService) {
  return renderHook(() => useUiIniciarSesionImpl(service), { wrapper });
}

function fillCredentials(
  result: ReturnType<typeof renderImpl>['result'],
  email: string,
  password: string,
): void {
  act(() => {
    result.current.handlerEmailChange(email);
    result.current.handlerPasswordChange(password);
  });
}

describe('useUiIniciarSesionImpl', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('login exitoso persiste la sesion y libera isSubmitting', async () => {
    const service = fakeService(() => Promise.resolve(exitosoFixture));
    const { result } = renderImpl(service);
    fillCredentials(result, 'architect@jona.dev', 'codex123');

    act(() => {
      result.current.handlerLogin(fakeSubmitEvent());
    });

    expect(service.login).toHaveBeenCalledWith('architect@jona.dev', 'codex123');
    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
    expect(localStorage.getItem(STORAGE_KEYS.authenticated)).toBe('true');
    expect(localStorage.getItem(STORAGE_KEYS.token)).toBe(exitosoFixture.token);
  });

  it('login fallido expone el mensaje del error en submitError', async () => {
    const service = fakeService(() => Promise.reject(new Error('Servidor caido.')));
    const { result } = renderImpl(service);
    fillCredentials(result, 'architect@jona.dev', 'codex123');

    act(() => {
      result.current.handlerLogin(fakeSubmitEvent());
    });

    await waitFor(() => {
      expect(result.current.submitError).toBe('Servidor caido.');
    });
    expect(result.current.isSubmitting).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.authenticated)).toBeNull();
  });

  it('datos invalidos no invocan al servicio', () => {
    const service = fakeService(() => Promise.resolve(exitosoFixture));
    const { result } = renderImpl(service);
    fillCredentials(result, 'no-es-email', '123');

    act(() => {
      result.current.handlerLogin(fakeSubmitEvent());
    });

    expect(service.login).not.toHaveBeenCalled();
    expect(result.current.emailError).not.toBe('');
  });
});
