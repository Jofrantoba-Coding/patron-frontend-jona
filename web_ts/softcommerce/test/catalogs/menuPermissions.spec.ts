import { describe, expect, it } from 'vitest';
import menu from '../../mock-server/data/menu.json';
import permissions from '../../mock-server/data/permissions.json';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { PERMISSION_FLAGS } from '../../src/domain/permissions';
import { CUSTOM_SCREENS, customScreenProblems, menuPermissionProblems } from './menuPermissions';

const flags = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true]));
const entry = (over: Record<string, unknown> = {}) => ({
  slug: 'cosas', formId: 'miCosa', menu: { parent: 'mnGenerales', label: 'Cosa' }, ...over,
});
const nodes = [
  { id_menu: 2, id_menu_padre: 1, menu_item: 'N', descripcion: 'Generales', nombre: 'mnGenerales' },
  { id_menu: 9, id_menu_padre: 2, menu_item: 'S', descripcion: 'Cosa', nombre: 'miCosa' },
];

describe('R-REG-9 menu and permissions consistency', () => {
  it('is consistent when the menu node and the 13 flags exist', () => {
    expect(menuPermissionProblems([entry()], nodes, { miCosa: flags })).toEqual([]);
  });

  it('S-REG-12 names the formId missing in permissions.json', () => {
    expect(menuPermissionProblems([entry()], nodes, {})).toEqual(['cosas: formId "miCosa" has no permissions.json grant']);
  });

  it('S-REF-36 fails when a grant lacks one of the 13 flags', () => {
    const { refresh: _omitted, ...twelve } = flags;
    expect(menuPermissionProblems([entry()], nodes, { miCosa: twelve })).toEqual(['cosas: formId "miCosa" lacks the permission flag "refresh"']);
  });

  it('S-REG-12 names the formId whose menu node is missing, misplaced or mislabeled', () => {
    expect(menuPermissionProblems([entry()], [nodes[0]], { miCosa: flags })).toEqual(['cosas: formId "miCosa" has no menu.json node']);
    expect(menuPermissionProblems([entry({ menu: { parent: 'mnVentas', label: 'Cosa' } })], nodes, { miCosa: flags })).toEqual([
      'cosas: menu node "miCosa" is not under "mnVentas"',
    ]);
    expect(menuPermissionProblems([entry({ menu: { parent: 'mnGenerales', label: 'Otra' } })], nodes, { miCosa: flags })).toEqual([
      'cosas: menu node "miCosa" is labeled "Cosa", the entry says "Otra"',
    ]);
  });

  it('an entry without a formId (a lookup) needs no menu or grant', () => {
    expect(menuPermissionProblems([{ slug: 'monedas' }], [], {})).toEqual([]);
  });

  it('the real registry, menu.json and permissions.json agree', () => {
    expect(menuPermissionProblems(REGISTRY.entries, menu, permissions)).toEqual([]);
  });
});

describe('S-REG-27 custom screens in the consistency test (R-REG-19)', () => {
  const custom = [{ formId: 'mi_SeguridadPerfil', menu: { parent: 'mnGenerales', label: 'Seguridad - Perfil' } }];
  const customNodes = [...nodes, { id_menu: 50, id_menu_padre: 2, menu_item: 'S', descripcion: 'Seguridad - Perfil', nombre: 'mi_SeguridadPerfil' }];

  it('is consistent when the custom screen has its menu node and its 13 flags', () => {
    expect(customScreenProblems(custom, customNodes, { mi_SeguridadPerfil: flags })).toEqual([]);
  });

  it('names the formId missing in permissions.json, missing in menu.json or placed under the wrong parent', () => {
    expect(customScreenProblems(custom, customNodes, {})).toEqual(['custom screen: formId "mi_SeguridadPerfil" has no permissions.json grant']);
    expect(customScreenProblems(custom, nodes, { mi_SeguridadPerfil: flags })).toEqual(['custom screen: formId "mi_SeguridadPerfil" has no menu.json node']);
    expect(customScreenProblems([{ ...custom[0], menu: { parent: 'mnVentas', label: 'Seguridad - Perfil' } }], customNodes, { mi_SeguridadPerfil: flags })).toEqual([
      'custom screen: menu node "mi_SeguridadPerfil" is not under "mnVentas"',
    ]);
  });

  it('the real custom-screen list, menu.json and permissions.json agree', () => {
    expect(CUSTOM_SCREENS.map((s) => s.formId)).toContain('mi_SeguridadPerfil');
    expect(customScreenProblems(CUSTOM_SCREENS, menu, permissions)).toEqual([]);
  });
});
