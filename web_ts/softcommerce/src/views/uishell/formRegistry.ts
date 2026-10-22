// Form registry: the menu `nombre` of a leaf maps to the form it opens. Absent means "not available yet".
import type { ComponentType } from 'react';
import type { Permissions } from '../../domain/permissions';
import { UiLocalidad } from '../uilocalidad';

export type FormComponent = ComponentType<{ permissions: Permissions }>;
export type FormRegistry = Readonly<Record<string, FormComponent>>;

/** Menu `nombre` -> form. W1c-4 swapped the W1b demo stub for Localidad. */
export const formRegistry: FormRegistry = { mi_localidad: UiLocalidad };

/** Own keys only, so a menu `nombre` like `constructor` is never mistaken for a form. */
export const findForm = (registry: FormRegistry, nombre: string): FormComponent | undefined =>
  Object.prototype.hasOwnProperty.call(registry, nombre) ? registry[nombre] : undefined;
