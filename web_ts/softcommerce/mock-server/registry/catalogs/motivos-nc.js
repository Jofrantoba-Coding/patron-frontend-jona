import { referenceCatalog } from './reference.js';

/**
 * Motivo de Nota de Crédito (`RegisterMotivoNotaCredito`): the tipo (P compra, C venta, Y débito venta) comes first, then
 * the descripcion; the string id pads to three (`PanelTFMotivoNC`). [DEVIATION] the desktop messages say "una MotivoNotaCredito"
 * and the tipo one names "Familia"; the web port words the real entity and field.
 */
export const motivosNc = referenceCatalog({
  slug: 'motivos-nc', idKey: 'id_motivo_nc', entity: 'un Motivo de Nota de Crédito', formId: 'miMotivoNotaCredito', title: 'Motivo de Nota de Credito',
  descripcion: false,
  fields: [
    {
      name: 'tipo', kind: 'options', label: 'Tipo', required: true, display: 'select',
      options: [{ value: 'P', label: 'NOTA CREDITO COMPRA' }, { value: 'C', label: 'NOTA CREDITO VENTA' }, { value: 'Y', label: 'NOTA DEBITO VENTA' }],
    },
    { name: 'descripcion', preset: 'descripcion', normalize: ['upper'] },
  ],
  columns: [{ key: 'tipo_label', header: 'Tipo' }, { key: 'descripcion', header: 'Descripción' }],
});
