import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../../mock-server/registry/index.js';
import { CUSTOM_SCREENS } from '../../../test/catalogs/menuPermissions';
import { findForm, formRegistry } from './formRegistry';

/** W3-20 20.5: every Wave 3 master and custom screen opens a form from the menu (R-REG-9, R-REG-19); the menu nodes and grants are in wave3.completeness.spec. */
const MASTERS = ['bancos', 'trabajadores', 'vendedores', 'transportistas', 'proveedores', 'clientes', 'items', 'usuarios'];

describe('the form registry opens every Wave 3 screen', () => {
  it.each(MASTERS)('%s opens a form from its formId', (slug) => {
    expect(findForm(formRegistry, REGISTRY.bySlug.get(slug).formId), slug).toBeDefined();
  });

  it.each(CUSTOM_SCREENS.map((screen) => screen.formId))('the custom screen %s opens a form', (formId) => {
    expect(findForm(formRegistry, formId), formId).toBeDefined();
  });
});
