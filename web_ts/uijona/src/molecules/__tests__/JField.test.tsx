import { render, screen } from '@testing-library/react';
import { JTextBox } from '../../atoms/JTextBox';
import { JField } from '../JField';
import { seriousViolations } from '../../__tests__/quality/axe';

describe('JField (R-FRM-1)', () => {
  it('S-FRM-1: the label is the exact accessible name and the control is required', () => {
    render(
      <JField id="usuario" label="Usuario" required>
        {(aria) => <JTextBox {...aria} />}
      </JField>,
    );

    const box = screen.getByRole('textbox', { name: 'Usuario' });
    expect(box).toHaveAttribute('id', 'usuario');
    expect(box).toBeRequired();
  });

  it('S-FRM-1: an optional field is not required', () => {
    render(
      <JField id="alias" label="Alias">
        {(aria) => <JTextBox {...aria} />}
      </JField>,
    );

    expect(screen.getByRole('textbox', { name: 'Alias' })).not.toBeRequired();
  });

  it('S-FRM-2: describes the control by the help, then the error, and marks it invalid', () => {
    const field = (error?: string) => (
      <JField id="usuario" label="Usuario" description="Máximo 50 caracteres" error={error}>
        {(aria) => <JTextBox {...aria} />}
      </JField>
    );
    const { rerender } = render(field('Ingrese Usuario'));
    const box = screen.getByRole('textbox', { name: 'Usuario' });

    expect(box).toHaveAccessibleDescription('Máximo 50 caracteres Ingrese Usuario');
    expect(box).toHaveAttribute('aria-invalid', 'true');

    rerender(field(undefined));

    expect(box).not.toHaveAttribute('aria-invalid');
    expect(box).toHaveAccessibleDescription('Máximo 50 caracteres');
    expect(screen.queryByText('Ingrese Usuario')).toBeNull();
  });

  it('S-FRM-2: an error alone is the whole description', () => {
    render(
      <JField id="clave" label="Clave" error="Ingrese Clave">
        {(aria) => <JTextBox type="password" {...aria} />}
      </JField>,
    );

    expect(screen.getByLabelText('Clave')).toHaveAccessibleDescription('Ingrese Clave');
  });

  it('S-FRM-3: field errors are not live regions', () => {
    render(
      <>
        {['Usuario', 'Clave', 'Correo'].map((label) => (
          <JField key={label} id={label} label={label} error={`Ingrese ${label}`}>
            {(aria) => <JTextBox {...aria} />}
          </JField>
        ))}
      </>,
    );

    expect(screen.getAllByText(/^Ingrese /)).toHaveLength(3);
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it('S-FRM-4: the required marker is visible, hidden from AT and outside the name', () => {
    render(
      <JField id="usuario" label="Usuario" required>
        {(aria) => <JTextBox {...aria} />}
      </JField>,
    );

    const marker = screen.getByText('*');
    expect(marker).toHaveAttribute('aria-hidden', 'true');
    expect(marker).toHaveAttribute('title', 'obligatorio');
    expect(screen.getByRole('textbox', { name: 'Usuario' })).toBeInTheDocument();
  });

  it('S-FRM-4: takes a custom required label and shows no marker when optional', () => {
    const { rerender } = render(
      <JField id="usuario" label="User" required requiredLabel="required">
        {(aria) => <JTextBox {...aria} />}
      </JField>,
    );

    expect(screen.getByText('*')).toHaveAttribute('title', 'required');

    rerender(
      <JField id="usuario" label="User">
        {(aria) => <JTextBox {...aria} />}
      </JField>,
    );

    expect(screen.queryByText('*')).toBeNull();
  });

  it('as="fieldset" names a group by the label and describes it', () => {
    render(
      <JField id="sexo" label="Sexo" as="fieldset" description="Elija una opción" error="Seleccione Sexo">
        {(aria) => (
          <>
            <label><input type="radio" name="sexo" aria-invalid={aria['aria-invalid']} /> F</label>
            <label><input type="radio" name="sexo" aria-invalid={aria['aria-invalid']} /> M</label>
          </>
        )}
      </JField>,
    );

    const group = screen.getByRole('group', { name: 'Sexo' });
    expect(group).toHaveAccessibleDescription('Elija una opción Seleccione Sexo');
    expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no serious axe violations', async () => {
    const { container } = render(
      <JField id="usuario" label="Usuario" required description="Máximo 50 caracteres" error="Ingrese Usuario">
        {(aria) => <JTextBox {...aria} />}
      </JField>,
    );

    expect(await seriousViolations(container)).toEqual([]);
  });
});
