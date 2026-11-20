import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { SesionUsuario } from '../../dominio/SesionUsuario';
import { UiSesion, type InterServicioSesion } from './index';

const ANA: SesionUsuario = { usuario: { nombre: 'Ana' }, permisos: { eliminar: true } };

function servicio(respuesta: SesionUsuario | undefined): InterServicioSesion {
  return { actual: vi.fn(async () => undefined), entrar: vi.fn(async () => respuesta), salir: vi.fn(async () => {}) };
}

const campoClave = (container: HTMLElement) => container.querySelector<HTMLInputElement>('input[type="password"]')!;

describe('UiSesion', () => {
  it('la contraseña va en un campo password con current-password, y el correo con username: el gestor de contraseñas los reconoce', () => {
    const { container } = render(<UiSesion servicio={servicio(ANA)} onEntro={() => {}} />);

    expect(campoClave(container).getAttribute('autocomplete')).toBe('current-password');
    expect(screen.getByRole('textbox', { name: 'Correo' }).getAttribute('autocomplete')).toBe('username');
  });

  it('con credenciales incorrectas, un mensaje que no dice cuál falló, y la contraseña no queda escrita', async () => {
    const { container } = render(<UiSesion servicio={servicio(undefined)} onEntro={() => {}} />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Correo' }), 'ana@ejemplo.com');
    await userEvent.type(campoClave(container), 'otra');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect((await screen.findByRole('alert')).textContent).toBe('Correo o contraseña incorrectos.');
    expect(campoClave(container).value).toBe('');
  });

  it('al entrar, entrega la sesión que respondió el servidor a quien compone la pantalla', async () => {
    const onEntro = vi.fn();
    const { container } = render(<UiSesion servicio={servicio(ANA)} onEntro={onEntro} />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Correo' }), 'ana@ejemplo.com');
    await userEvent.type(campoClave(container), 'secreta123');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(onEntro).toHaveBeenCalledWith(ANA);
  });
});
