import { describe, expect, it } from 'vitest';
import { UiDemoStub } from '../uidemostub';
import { findForm, formRegistry } from './formRegistry';

describe('formRegistry', () => {
  it('registers the demo stub under demo_stub', () => {
    expect(findForm(formRegistry, 'demo_stub')).toBe(UiDemoStub);
  });

  it('has no form for an unregistered name, including names inherited from Object', () => {
    expect(findForm(formRegistry, 'mi_localidad')).toBeUndefined();
    expect(findForm(formRegistry, 'constructor')).toBeUndefined();
    expect(findForm(formRegistry, 'toString')).toBeUndefined();
  });
});
