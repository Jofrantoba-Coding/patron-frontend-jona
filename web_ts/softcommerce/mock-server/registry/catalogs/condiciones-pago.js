import { referenceCatalog } from './reference.js';

/**
 * Condición de Pago (`RegisterCondicionPago`): descripcion up to 255 (accent in its message), `dias_pago` as an
 * integer of two digits where 0 is valid, and the CR/CO/OB/TA radios with no default. First proof of the
 * integer field (G4). The id is a string with no pad evidence in the desktop; three digits are inferred (flagged for W6).
 */
export const condicionesPago = referenceCatalog({
  slug: 'condiciones-pago', idKey: 'id_condicion_pago', entity: 'una Condición de Pago', formId: 'miCondicionPago', title: 'Condicion de Pago',
  descripcion: { max: 255, msgLabel: 'su Descripción' },
  fields: [
    { name: 'dias_pago', kind: 'number', label: 'Dias de Pago', msgLabel: 'sus Dias de Pago', required: true, scale: 0, max: 2, normalize: ['digits'] },
    {
      name: 'tipo', kind: 'options', label: 'Tipo de Pago', required: true, display: 'radio',
      options: [{ value: 'CR', label: 'Crédito' }, { value: 'CO', label: 'Contado' }, { value: 'OB', label: 'Operación Bancaria' }, { value: 'TA', label: 'Tarjeta' }],
    },
  ],
  columns: [{ key: 'dias_pago', header: 'Dias de Pago' }, { key: 'tipo_label', header: 'Tipo de Pago' }],
});
