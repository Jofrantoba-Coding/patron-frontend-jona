import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../services/ApiError';
import { createAuthServiceFake } from '../services/AuthServiceFake';
import type { InterAuthService, LoginResult } from '../services/InterAuthService';
import { UiLogin } from '.';
import UiLoginView from './UiLoginView.vue';

const ANA: LoginResult = { token: 't-1', user: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } };

function deferredService() {
  const pending: Array<{ resolve: (r: LoginResult) => void; reject: (e: unknown) => void }> = [];
  const login = vi.fn(() => new Promise<LoginResult>((resolve, reject) => { pending.push({ resolve, reject }); }));
  return { service: { login } satisfies InterAuthService, login, pending };
}

async function submitWith(service: InterAuthService, email: string, password: string) {
  const wrapper = mount(UiLogin, { props: { service } });
  if (email) await wrapper.get('input[aria-label="Correo"]').setValue(email);
  if (password) await wrapper.get('input[aria-label="Contraseña"]').setValue(password);
  await wrapper.get('form').trigger('submit');
  await flushPromises();
  return wrapper;
}

const alertText = (wrapper: ReturnType<typeof mount>) => wrapper.find('[role="alert"]').text();

describe('Inicio de sesión, forma mínima en Vue', () => {
  it('aplica los valores por defecto de presentación', () => {
    const wrapper = mount(UiLogin, { props: { service: createAuthServiceFake() } });

    expect(wrapper.get('h1').text()).toBe('Iniciar sesión');
    expect(wrapper.get('button').text()).toBe('Ingresar');
  });

  it('inicia sesión con credenciales válidas y emite authenticated', async () => {
    const wrapper = await submitWith(createAuthServiceFake(), 'ana@ejemplo.com', 'secreta123');

    const [[result]] = wrapper.emitted('authenticated') as [[LoginResult]];
    expect(result.user.nombre).toBe('Ana Torres');
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it('pide los datos faltantes sin llamar al servicio', async () => {
    const { service, login } = deferredService();

    const wrapper = await submitWith(service, 'ana@ejemplo.com', '');

    expect(alertText(wrapper)).toBe('Ingrese su correo y su contraseña.');
    expect(login).not.toHaveBeenCalled();
  });

  it.each([
    ['credenciales inválidas', createAuthServiceFake(), 'ana@ejemplo.com', 'otra', 'Correo o contraseña incorrectos.'],
    ['un usuario bloqueado', createAuthServiceFake(), 'bloqueado@ejemplo.com', 'secreta123', 'Su usuario está bloqueado. Contacte al administrador.'],
    ['un error del servidor', createAuthServiceFake({ escenario: 'errorServidor' }), 'ana@ejemplo.com', 'secreta123', 'No se pudo iniciar sesión. Intente de nuevo.'],
  ])('informa %s', async (_case, service, email, password, message) => {
    const wrapper = await submitWith(service, email, password);

    expect(alertText(wrapper)).toBe(message);
    expect(wrapper.emitted('authenticated')).toBeUndefined();
  });

  it('evita el doble envío mientras la petición está en curso', async () => {
    const { service, login, pending } = deferredService();
    const wrapper = await submitWith(service, 'ana@ejemplo.com', 'secreta123');

    await wrapper.get('form').trigger('submit');

    expect(login).toHaveBeenCalledTimes(1);
    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
    pending[0].resolve(ANA);
    await flushPromises();
    expect(wrapper.emitted('authenticated')).toHaveLength(1);
  });

  it('limpia el error anterior al reintentar', async () => {
    const { service, pending } = deferredService();
    const wrapper = await submitWith(service, 'ana@ejemplo.com', 'otra');
    pending[0].reject(new ApiError(401, { code: 'INVALID_CREDENTIALS', message: 'x', details: [], traceId: 't' }));
    await flushPromises();
    expect(alertText(wrapper)).toBe('Correo o contraseña incorrectos.');

    await wrapper.get('form').trigger('submit');

    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
});

describe('UiLoginView: render puro', () => {
  it('declara como props exactamente los campos de InterUiLogin', () => {
    const props = Object.keys((UiLoginView as unknown as { props: Record<string, unknown> }).props).sort();

    expect(props).toEqual(['email', 'error', 'isSubmitting', 'onEmailChange', 'onPasswordChange', 'onSubmit',
      'password', 'submitLabel', 'title']);
  });

  it('entrega el valor, no el evento, en onEmailChange', async () => {
    const onEmailChange = vi.fn();
    const wrapper = mount(UiLoginView, { props: { email: '', password: '', onEmailChange } });

    await wrapper.get('input[aria-label="Correo"]').setValue('ana@ejemplo.com');

    expect(onEmailChange).toHaveBeenCalledWith('ana@ejemplo.com');
  });
});
