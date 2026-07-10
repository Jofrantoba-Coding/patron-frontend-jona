import type { ProductoGrupo } from '../../core/models';

export interface Subtipo {
  code: string;
  label: string;
}

export interface OperacionMeta {
  eyebrow: string;
  heading: string;
  description: string;
  subtipos: Subtipo[];
}

export const TIPOOP_GRUPO: Record<string, ProductoGrupo> = {
  PAGOMASIVO_ABONO_PROVEEDOR: 'pagos_masivos',
  PAGOMASIVO_CHEQUE_GERENCIA: 'pagos_masivos',
  PAGOMASIVO_CTS_TRABAJADOR: 'pagos_masivos',
  PAGOMASIVO_HABERES_TRABAJADOR: 'pagos_masivos',
  TRANSFERENCIA_CUENTA_PROPIA: 'transferencias',
  TRANSFERENCIA_TERCEROS: 'transferencias',
  TRANSFERENCIA_INTERBANCARIA: 'transferencias',
  FACTORING_E: 'factoring',
  FACTORING_TOTAL: 'factoring',
  FACTORING_PAGO_VENCIMIENTO: 'factoring',
  PAGO_HABER: 'pagos_masivos',
  PAGO_CTS: 'pagos_masivos',
  PAGO_PROVEEDOR: 'pagos_masivos',
  PAGO_CHEQUE_GERENCIA: 'pagos_masivos',
  RETIRO_INVITADO: 'pagos_masivos',
  PAGO_TRANSFERENCIA: 'transferencias',
  PAGO_FACTORING: 'factoring',
};

export const META: Record<ProductoGrupo, OperacionMeta> = {
  pagos_masivos: {
    eyebrow: 'Producto · Pagos Masivos',
    heading: 'Pagos Masivos',
    description: 'Operaciones de Haberes, CTS, Proveedores y Cheque de Gerencia.',
    subtipos: [
      { code: '', label: 'Todos los subtipos' },
      { code: 'PAGOMASIVO_HABERES_TRABAJADOR', label: 'Haberes' },
      { code: 'PAGOMASIVO_CTS_TRABAJADOR', label: 'CTS' },
      { code: 'PAGOMASIVO_ABONO_PROVEEDOR', label: 'Proveedores' },
      { code: 'PAGOMASIVO_CHEQUE_GERENCIA', label: 'Cheque de Gerencia' },
    ],
  },
  transferencias: {
    eyebrow: 'Producto · Transferencias',
    heading: 'Transferencias',
    description: 'Transferencias a cuentas propias/terceros BCP e interbancarias (CCE/BCR).',
    subtipos: [
      { code: '', label: 'Todos los subtipos' },
      { code: 'TRANSFERENCIA_CUENTA_PROPIA', label: 'Cuenta propia' },
      { code: 'TRANSFERENCIA_TERCEROS', label: 'Terceros BCP' },
      { code: 'TRANSFERENCIA_INTERBANCARIA', label: 'Interbancaria' },
    ],
  },
  factoring: {
    eyebrow: 'Producto · Factoring Electrónico',
    heading: 'Factoring Electrónico',
    description: 'Planillas de Confirming (Factoring Electrónico) por bloques de documentos.',
    subtipos: [
      { code: '', label: 'Todos los subtipos' },
      { code: 'FACTORING_E', label: 'E-Factoring' },
      { code: 'FACTORING_TOTAL', label: 'Factoring Total' },
      { code: 'FACTORING_PAGO_VENCIMIENTO', label: 'Pago al vencimiento' },
    ],
  },
};

export const META_TODAS: OperacionMeta = {
  eyebrow: 'Operación',
  heading: 'Todas las operaciones',
  description: 'Todas las operaciones cargadas para el flujo H2H. Use el panel para filtrar.',
  subtipos: [],
};

