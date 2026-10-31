import type { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../services/ApiError';
import { createAuthServiceFake } from '../services/AuthServiceFake';
import { AUTH_SERVICE } from '../services/auth.token';
import type { InterAuthService, LoginResult } from '../services/InterAuthService';
import { UiLoginImplComponent } from './ui-login-impl.component';
import { UiLoginComponent } from './ui-login.component';

const ANA: LoginResult = { token: 't-1', user: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } };

function deferredService() {
  const pending: Array<{ resolve: (r: LoginResult) => void; reject: (e: unknown) => void }> = [];
  const login = vi.fn(() => new Promise<LoginResult>((resolve, reject) => { pending.push({ resolve, reject }); }));
  return { service: { login } satisfies InterAuthService, login, pending };
}

async function render<T>(component: Type<T>, service: InterAuthService = createAuthServiceFake()) {
  TestBed.configureTestingModule({
    imports: [component],
    providers: [provideRouter([]), { provide: AUTH_SERVICE, useValue: service }],
  });
  const fixture = TestBed.createComponent(component);
  const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  await fixture.whenStable();
  const root = fixture.nativeElement as HTMLElement;
  const stable = () => fixture.whenStable();
  const type = async (label: string, value: string) => {
    const input = root.querySelector<HTMLInputElement>(`input[aria-label="${label}"]`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await stable();
  };
  const click = async (name: string) => {
    [...root.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!.click();
    await stable();
  };
  const submitWith = async (email: string, password: string) => {
    await type('Correo', email);
    await type('Contraseña', password);
    await click('Ingresar');
  };
  const status = () => root.querySelector('[role="status"]')!.textContent!.trim();
  const button = (name: string) => [...root.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!;
  return { fixture, navigate, root, stable, submitWith, click, status, button };
}

describe('UiLoginComponent (Plantilla): comportamiento por defecto, sin integración', () => {
  it('pide los datos faltantes', async () => {
    const ui = await render(UiLoginComponent);

    await ui.submitWith('ana@ejemplo.com', '');

    expect(ui.status()).toBe('Ingrese su correo y su contraseña.');
  });

  it('con datos completos no llama a ningún sistema', async () => {
    const ui = await render(UiLoginComponent);

    await ui.submitWith('ana@ejemplo.com', 'secreta123');

    expect(ui.status()).toBe('Datos completos (sin integración).');
    expect(ui.navigate).not.toHaveBeenCalled();
  });
});

describe('UiLoginImplComponent (Implementación y entrada)', () => {
  it('reutiliza la plantilla HTML e inicia sesión navegando a /inicio', async () => {
    const ui = await render(UiLoginImplComponent);

    await ui.submitWith('ana@ejemplo.com', 'secreta123');
    await ui.stable();

    expect(ui.navigate).toHaveBeenCalledWith(['/inicio']);
    expect(ui.status()).toBe('');
  });

  it.each([
    ['credenciales inválidas', createAuthServiceFake(), 'ana@ejemplo.com', 'otra', 'Correo o contraseña incorrectos.'],
    ['un usuario bloqueado', createAuthServiceFake(), 'bloqueado@ejemplo.com', 'secreta123', 'Su usuario está bloqueado. Contacte al administrador.'],
    ['un error del servidor', createAuthServiceFake({ escenario: 'errorServidor' }), 'ana@ejemplo.com', 'secreta123', 'No se pudo iniciar sesión. Intente de nuevo.'],
  ])('informa %s', async (_case, service, email, password, message) => {
    const ui = await render(UiLoginImplComponent, service);

    await ui.submitWith(email, password);
    await ui.stable();

    expect(ui.status()).toBe(message);
    expect(ui.navigate).not.toHaveBeenCalled();
  });

  it('evita el doble envío y deshabilita el botón mientras la petición está en curso', async () => {
    const { service, login, pending } = deferredService();
    const ui = await render(UiLoginImplComponent, service);
    const impl = ui.fixture.componentInstance;

    void impl.login('ana@ejemplo.com', 'secreta123');
    void impl.login('ana@ejemplo.com', 'secreta123');
    await ui.stable();

    expect(login).toHaveBeenCalledTimes(1);
    expect(ui.button('Ingresar').disabled).toBe(true);
    pending[0].resolve(ANA);
    await vi.waitFor(() => expect(ui.navigate).toHaveBeenCalledTimes(1));
  });

  it('limpia el error anterior al reintentar', async () => {
    const { service, pending } = deferredService();
    const ui = await render(UiLoginImplComponent, service);
    await ui.submitWith('ana@ejemplo.com', 'otra');
    pending[0].reject(new ApiError(401, { code: 'INVALID_CREDENTIALS', message: 'x', details: [], traceId: 't' }));
    await vi.waitFor(async () => { await ui.stable(); expect(ui.status()).toBe('Correo o contraseña incorrectos.'); });

    await ui.click('Ingresar');

    expect(ui.status()).toBe('');
  });

  it('delega la navegación secundaria en el enrutador', async () => {
    const ui = await render(UiLoginImplComponent);

    await ui.click('Crear cuenta');

    expect(ui.navigate).toHaveBeenCalledWith(['/crear-cuenta']);
  });
});
