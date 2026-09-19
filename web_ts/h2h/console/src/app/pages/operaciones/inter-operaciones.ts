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

/** Estado terminal de la anulación. */
export const ESTADO_OPE_ANULADA = 'ANULADA';

/** Solo se informa a Calimaco lo que el banco ya pagó. */
export const ESTADO_OPE_CONFIRMADO = 'PAGO_CONFIRMADO';

/** Estado final: ya se le dijo al sistema de origen y no hay nada más que hacer. */
export const ESTADO_OPE_INFORMADO = 'PAGO_INFORMADO';

/**
 * Estados desde los que el backend NO deja anular, con el motivo que se muestra.
 *
 * <p>Espeja `ANULACION_NEGADA` de `ProcessOperacionesH2h`. La autoridad sigue siendo el backend
 * —el 422 se muestra tal cual llegue—; esto solo evita el viaje y, sobre todo, explica en pantalla
 * por qué la acción no está disponible en vez de esconder el botón sin decir nada.</p>
 */
export const ANULACION_NEGADA: Record<string, string> = {
  PAGO_CONFIRMADO:
    'el banco ya confirmó el pago. Anular contradiría un hecho registrado; si el dinero debe volver, eso es una operación nueva (extorno).',
  CONTABILIZADA:
    'el asiento ya fue contabilizado hacia afuera. Se corrige por la vía contable, no anulando el origen.',
};

/**
 * Estado en el que el tope de reintentos deja una operación: detenida, esperando una decisión.
 *
 * <p>Es el único desde el que se reactiva, y la razón está en cómo la excluye el backend: `ERROR`
 * la saca del barrido automático (`listarProgramables` exige `REGISTRADA`) y **también** del camino
 * manual (`problemaDeProgramable` exige lo mismo). Nadie la puede mover, que es justo lo que pide
 * la política `MARCAR_REVISION`; esta pantalla es la única salida de ahí.</p>
 */
export const ESTADO_OPE_ERROR = 'ERROR';

/** Estado al que vuelve tras el rescate: de vuelta en el pool. */
export const ESTADO_OPE_REGISTRADA = 'REGISTRADA';

/**
 * Los dos modos con los que una operación puede volver al pool.
 *
 * <p>No hay un tercero ni un valor por defecto. `AUTOMATICO` la devuelve al barrido —volverá a
 * salir sola en cuanto un lote la tome— y `MANUAL` la deja programable solo a mano. Elegir por el
 * operador sería decidir en su nombre si el dato que la hizo fallar ya está corregido.</p>
 */
export const MODOS_ENVIO: ReadonlyArray<{ code: string; label: string; ayuda: string }> = [
  {
    code: 'AUTOMATICO',
    label: 'Automático',
    ayuda: 'Vuelve al barrido: el job la tomará en el próximo lote que le corresponda.',
  },
  {
    code: 'MANUAL',
    label: 'Manual',
    ayuda: 'Queda en el pool pero fuera del barrido: solo saldrá si alguien la programa a mano.',
  },
];

/**
 * Por qué NO se reactiva desde cada estado, con el hecho que lo bloquea.
 *
 * <p>Espeja `REACTIVACION_NEGADA` de `ProcessOperacionesH2h`. La autoridad sigue siendo el backend
 * —el 422 se muestra tal cual llegue—; esto solo evita el viaje y explica en pantalla por qué la
 * acción no está disponible.</p>
 *
 * <p>La regla real es más estricta que este mapa: se niega **todo salvo `ERROR`**. El mapa solo
 * pone texto a los casos previsibles; un estado que no figure aquí también queda negado, con un
 * texto genérico. Escrito al revés —lista de prohibidos— cada alta en el catálogo de estados
 * abriría una puerta que nadie decidió abrir.</p>
 */
export const REACTIVACION_NEGADA: Record<string, string> = {
  REGISTRADA:
    'ya está en REGISTRADA, es decir en el pool: no hay nada que rescatar. Si no entra en ningún lote, el motivo está en su modo de envío o en sus reservas, no en su estado.',
  PAGO_CONFIRMADO:
    'el banco ya confirmó el pago. Volver a ponerla en el pool crearía un segundo pago al mismo beneficiario.',
  PAGO_RECHAZADO:
    'el banco la devolvió con un código de rechazo. Reintentarla sin corregir el dato que rechazó repetiría el mismo rechazo; corrija el dato y cargue una operación nueva.',
  PAGO_INFORMADO:
    'ya se le informó al sistema de origen. Reabrirla aquí dejaría a los dos sistemas contando cosas distintas.',
  CONTABILIZADA:
    'el asiento ya salió hacia afuera. Se corrige por la vía contable, no reabriendo el origen.',
  ANULADA:
    'está anulada, que es un estado final. Si el pago debe hacerse, es una operación nueva.',
};

/**
 * Situación de una operación dentro del flujo.
 *
 * <p>Es el hecho más operativo de una operación y hasta ahora no se veía: una
 * ya comprometida en una planilla no se puede meter en otra programación, y
 * cuando el listado no lo dice, el operador lo descubre al intentarlo.</p>
 *
 * <p>Se deriva de `idPlanillaVigente`. Ojo con una particularidad del backend:
 * el mapeo de resultados <b>omite las columnas nulas</b>, así que la clave no
 * llega como `null`, sino que directamente no viene. Por eso la comprobación es
 * de presencia de valor y no de igualdad con `null`.</p>
 */
export interface SituacionOperacion {
  etiqueta: string;
  comprometida: boolean;
}

export const situacionOperacion = (idPlanillaVigente: unknown): SituacionOperacion =>
  idPlanillaVigente
    ? { etiqueta: 'En planilla', comprometida: true }
    : { etiqueta: 'Libre', comprometida: false };

/**
 * Modalidad de validación, que sale de la tríada `atributos`.
 *
 * <p>No es un detalle técnico: en `H2W` la planilla queda «pendiente de firma»
 * en la banca web y alguien tiene que entrar a firmarla con su token, mientras
 * que en `H2H` sale sola. Dos operaciones idénticas en pantalla pueden exigir
 * trabajo humano distinto, y eso merecía estar a la vista.</p>
 */
export const modalidadDe = (atributos: unknown): string => {
  const a = atributos as { modalidadValidacion?: string } | null | undefined;
  return a?.modalidadValidacion ?? '—';
};

/** Cuenta de cargo (de dónde sale el dinero), también en la tríada. */
export const cuentaCargoDe = (atributos: unknown): string => {
  const a = atributos as
    | { cuentaCargo?: { numeroCuenta?: string; entidadFinanciera?: string } }
    | null
    | undefined;
  const c = a?.cuentaCargo;
  return c?.numeroCuenta ? `${c.entidadFinanciera ?? ''} ${c.numeroCuenta}`.trim() : '—';
};

export const META_TODAS: OperacionMeta = {
  eyebrow: 'Operación',
  heading: 'Todas las operaciones',
  description: 'Todas las operaciones cargadas para el flujo H2H. Use el panel para filtrar.',
  subtipos: [],
};

