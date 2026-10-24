import { describe, expect, it } from 'vitest';
import menu from '../../../mock-server/data/menu.json';
import permissions from '../../../mock-server/data/permissions.json';
import { UiSocioAcciones } from '../uisocioacciones';
import { findForm, formRegistry } from './formRegistry';

describe('miAccionSocio registration (R-REG-19, D24)', () => {
  it('the menu leaf opens the Socio acciones screen, which is granted the close flag only', () => {
    expect(menu.find((node) => node.nombre === 'miAccionSocio')).toMatchObject({ menu_item: 'S', descripcion: 'Acciones de Socio' });
    expect(findForm(formRegistry, 'miAccionSocio')).toBe(UiSocioAcciones);
    expect(Object.entries(permissions.miAccionSocio).filter(([, granted]) => granted).map(([flag]) => flag)).toEqual(['close']);
  });
});
