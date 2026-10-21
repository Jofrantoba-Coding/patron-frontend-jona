// Form registry: the menu `nombre` of a leaf maps to the form it opens. Absent means "not available yet".
import type { ComponentType } from 'react';
import type { Permissions } from '../../domain/permissions';
import { UiDemoStub } from '../uidemostub';

export type FormComponent = ComponentType<{ permissions: Permissions }>;
export type FormRegistry = Readonly<Record<string, FormComponent>>;

/** W1b registers only the demo stub; the Localidad form replaces it in W1c-4. */
export const formRegistry: FormRegistry = { demo_stub: UiDemoStub };

/** Own keys only, so a menu `nombre` like `constructor` is never mistaken for a form. */
export const findForm = (registry: FormRegistry, nombre: string): FormComponent | undefined =>
  Object.prototype.hasOwnProperty.call(registry, nombre) ? registry[nombre] : undefined;
