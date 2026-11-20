/**
 * Moléculas: lo que ningún átomo resuelve solo. JField asocia etiqueta, ayuda y error con
 * el campo; JSearchBox guarda el borrador y entrega el término al enviar.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { JField, JSearchBox } from '../src/index';
import { violacionesGraves } from './axe';

describe('JField', () => {
  it('la etiqueta nombra el campo', () => {
    render(<JField label="Nombre" value="Teclado" />);

    expect(screen.getByRole('textbox', { name: 'Nombre' })).toHaveProperty('value', 'Teclado');
  });

  it('la ayuda y el error describen el campo, y el error lo marca inválido', () => {
    render(<JField label="Precio" value="0" hint="En soles, con dos decimales" error="Debe ser mayor que cero" />);

    const campo = screen.getByRole('textbox', { name: 'Precio' });
    const descripcion = campo.getAttribute('aria-describedby')!.split(' ').map((id) => document.getElementById(id)?.textContent);
    expect(descripcion).toEqual(['En soles, con dos decimales', 'Debe ser mayor que cero']);
    expect(campo.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toBe('Debe ser mayor que cero');
  });

  it('dos campos en la misma pantalla no comparten identificadores', () => {
    render(<><JField label="Nombre" value="" /><JField label="SKU" value="" /></>);

    expect(screen.getByRole('textbox', { name: 'Nombre' }).id).not.toBe(screen.getByRole('textbox', { name: 'SKU' }).id);
  });

  it('es controlado: el valor lo guarda quien lo usa', async () => {
    function Formulario() {
      const [nombre, setNombre] = useState('');
      return <><JField label="Nombre" value={nombre} onChange={setNombre} /><output>{nombre}</output></>;
    }
    render(<Formulario />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Nombre' }), 'Mouse');

    expect(screen.getByRole('status').textContent).toBe('Mouse');
  });

  it('con ayuda y error no tiene violaciones graves', async () => {
    const { container } = render(<JField label="Precio" value="0" hint="En soles" error="Debe ser mayor que cero" required />);

    expect(await violacionesGraves(container)).toEqual([]);
  });

  it('contraseña: un campo password con el autocompletado que espera el gestor de contraseñas', () => {
    const { container } = render(<><JField label="Correo" type="email" autoComplete="username" value="" /><JField label="Contraseña" type="password" autoComplete="current-password" value="" /></>);

    const clave = container.querySelector('input[type="password"]')!;
    expect(clave.getAttribute('autocomplete')).toBe('current-password');
    expect(clave.id).toBe(screen.getByText('Contraseña').getAttribute('for'));
    expect(screen.getByRole('textbox', { name: 'Correo' }).getAttribute('autocomplete')).toBe('username');
    // @ts-expect-error el autocompletado es una lista cerrada: un texto libre no compila.
    void (<JField label="Contraseña" type="password" autoComplete="contraseña" value="" />);
  });
});

describe('JSearchBox', () => {
  it('entrega el término recortado al enviar, no en cada tecla', async () => {
    const onSearch = vi.fn();
    render(<JSearchBox label="Buscar productos" onSearch={onSearch} />);

    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar productos' }), '  tecl  ');
    expect(onSearch).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('tecl');
  });

  it('Enter también envía', async () => {
    const onSearch = vi.fn();
    render(<JSearchBox label="Buscar productos" onSearch={onSearch} />);

    await userEvent.type(screen.getByRole('searchbox'), 'mouse{Enter}');

    expect(onSearch).toHaveBeenCalledWith('mouse');
  });

  it('es una región de búsqueda sin violaciones graves', async () => {
    const { container } = render(<JSearchBox label="Buscar productos" onSearch={() => {}} />);

    expect(screen.getByRole('search', { name: 'Buscar productos' })).toBeDefined();
    expect(await violacionesGraves(container)).toEqual([]);
  });
});
