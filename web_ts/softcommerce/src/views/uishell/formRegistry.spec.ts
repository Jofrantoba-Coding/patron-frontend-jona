import { describe, expect, it } from 'vitest';
import { UiLocalidad } from '../uilocalidad';
import { findForm, formRegistry } from './formRegistry';

describe('formRegistry', () => {
  it('registers Localidad under mi_localidad, replacing the demo stub', () => {
    expect(findForm(formRegistry, 'mi_localidad')).toBe(UiLocalidad);
    expect(findForm(formRegistry, 'demo_stub')).toBeUndefined();
  });

  it('has no form for an unregistered name, including names inherited from Object', () => {
    expect(findForm(formRegistry, 'miFormularioInexistente')).toBeUndefined();
    expect(findForm(formRegistry, 'constructor')).toBeUndefined();
    expect(findForm(formRegistry, 'toString')).toBeUndefined();
  });
});
