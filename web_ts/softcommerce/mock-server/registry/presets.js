/**
 * Reusable field presets, merged under the field that names them
 * (`{ name: 'estado', kind: 'boolean', preset: 'estado' }`). Wave 2 adds each
 * preset with the first catalog that needs it (`descripcion` in W2-2).
 * @type {Record<string, Record<string, any>>}
 */
export const PRESETS = {
  // `descripcion` of the reference catalogs; the desktop message says "su Descripcion" (no accent).
  descripcion: { kind: 'text', label: 'Descripción', required: true, max: 100, msgLabel: 'su Descripcion' },
};

/** @param {Record<string, any>} field */
export function applyPreset(field) {
  if (field.preset === undefined) return field;
  if (!Object.hasOwn(PRESETS, field.preset)) throw new Error(`field "${field.name}": unknown preset "${field.preset}"`);
  return { ...PRESETS[field.preset], ...field };
}
