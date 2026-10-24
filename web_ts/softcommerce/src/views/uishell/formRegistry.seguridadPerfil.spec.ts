import { describe, expect, it } from 'vitest';
import menu from '../../../mock-server/data/menu.json';
import { UiSeguridadPerfil } from '../uiseguridadperfil';
import { findForm, formRegistry } from './formRegistry';

describe('mi_SeguridadPerfil registration (R-REG-19, D24)', () => {
  it('the menu leaf opens the Seguridad - Perfil screen', () => {
    const leaf = menu.find((node) => node.nombre === 'mi_SeguridadPerfil');

    expect(leaf).toMatchObject({ menu_item: 'S', descripcion: 'Seguridad - Perfil' });
    expect(findForm(formRegistry, 'mi_SeguridadPerfil')).toBe(UiSeguridadPerfil);
  });
});
