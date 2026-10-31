import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { UILOGIN_DEFAULTS } from './InterUiLogin';
import { useUiLoginBase } from './UiLoginBase';
import { UiLoginView } from './UiLoginView';

/** Otra entrada (como una historia de Storybook): vista + modelo base, sin integración. */
function UiLoginSinIntegracion() {
  const { setError: _setError, setIsSubmitting: _setIsSubmitting, ...viewModel } = useUiLoginBase();
  return <UiLoginView {...UILOGIN_DEFAULTS} {...viewModel} />;
}

describe('UiLoginBase: punto de sustitución 1 (interfaz sin integración)', () => {
  it('valida los datos con su comportamiento por defecto', async () => {
    const user = userEvent.setup();
    render(<UiLoginSinIntegracion />);

    await user.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByRole('alert').textContent).toBe('Ingrese su correo y su contraseña.');

    await user.type(screen.getByLabelText('Correo'), 'ana@ejemplo.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreta123');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
