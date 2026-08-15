import type { PlanillaDetalleFull, PlanillaFiltro, PlanillaRow } from '../../core/models';

/** Contrato de la página de consulta de planillas (listado + filtros + detalle con etapas). */
export interface PlanillasPageContract {
  rows: PlanillaRow[];
  page: number;
  pageSize: number;
  total: number;
  filtros: PlanillaFiltro;
  detalle: PlanillaDetalleFull | null;
  detalleLoading: string | null;
}

/** Qué le toca a una planilla según su estado. */
export interface SiguientePaso {
  /** Verbo en imperativo: lo que hará el operador, no el nombre del estado destino. */
  accion: string;
  /** Estado destino de la transición, el que espera `onEtapa`. */
  destino: string | null;
  /** `atencion` = el reloj corre en contra; `espera` = depende del banco. */
  tono: 'accion' | 'espera' | 'atencion' | 'cerrado';
  /** Por qué está esperando, cuando no hay nada que hacer. */
  nota?: string;
}

/**
 * Traducción de estado a siguiente paso.
 *
 * <p>Es la misma máquina de estados que ya usa el stepper del detalle, pero
 * expuesta en el listado: una bandeja de trabajo tiene que decir qué hacer sin
 * obligar a abrir cada fila. El operador escanea la columna y sabe dónde está
 * su trabajo del día.</p>
 *
 * <p>Los estados de espera se distinguen de los accionables a propósito:
 * `ENVIADA` no es un pendiente del operador sino del banco, y mezclarlos haría
 * que la bandeja pareciera más cargada de lo que está.</p>
 */
export const SIGUIENTE_PASO: Record<string, SiguientePaso> = {
  GENERADA: { accion: 'Validar', destino: 'VALIDADA', tono: 'accion' },
  VALIDADA: { accion: 'Cifrar', destino: 'CIFRADA', tono: 'accion' },
  PENDIENTE_CIFRADO: { accion: 'Cifrar', destino: 'CIFRADA', tono: 'atencion' },
  CIFRADA: { accion: 'Enviar', destino: 'ENVIADA', tono: 'accion' },
  PENDIENTE_ENVIO: { accion: 'Enviar', destino: 'ENVIADA', tono: 'atencion' },
  ENVIADA: {
    accion: 'Esperando al banco',
    destino: 'RESPUESTA_RECIBIDA',
    tono: 'espera',
    nota: 'La respuesta llega al buzón; se puede forzar la lectura.',
  },
  RESPUESTA_RECIBIDA: {
    accion: 'Decidir',
    destino: 'PROCESADA',
    tono: 'atencion',
    nota: 'La respuesta caduca en el buzón del banco: decide hoy.',
  },
  PROCESADA: { accion: 'Cerrada', destino: null, tono: 'cerrado' },
  PROCESADA_PARCIAL: { accion: 'Cerrada con rechazos', destino: null, tono: 'atencion' },
  RECHAZADA: { accion: 'Rechazada', destino: null, tono: 'atencion' },
  ANULADA: { accion: 'Anulada', destino: null, tono: 'cerrado' },
  ERROR: { accion: 'Revisar error', destino: null, tono: 'atencion' },
  ERROR_CIFRADO: { accion: 'Revisar cifrado', destino: null, tono: 'atencion' },
};

/**
 * Pasos del canal H2W, donde el archivo lo sube una persona al portal del banco.
 *
 * <p>Solo se listan los estados en los que el camino difiere. El resto —generar, validar,
 * cifrar, y los terminales— es idéntico y se hereda de `SIGUIENTE_PASO`.</p>
 *
 * <p>Esto no es cosmético: el backend RECHAZA `/planillas/enviar` sobre una planilla H2W
 * (guarda contra el doble pago). Ofrecer aquí el botón "Enviar" sería ofrecer una acción que
 * siempre falla, y el operador no tendría forma de saber por qué.</p>
 */
export const SIGUIENTE_PASO_H2W: Record<string, SiguientePaso> = {
  // Se conserva por las planillas que YA pasaron por el cifrado antes de que se sacara del flujo
  // H2W. No es un paso que se vaya a ofrecer más: desde VALIDADA se descarga directamente. El TXT
  // en claro sigue existiendo (lo escribe `marcarValidada`), así que también estas se descargan sin
  // cifrar y el operador no acaba con un `.gpg` que el portal no acepta.
  CIFRADA: {
    accion: 'Descargar y subir al portal',
    destino: 'PENDIENTE_ENVIO',
    tono: 'accion',
    nota: 'El archivo no sale por SFTP: hay que subirlo a la banca web.',
  },
  VALIDADA: {
    accion: 'Descargar y subir al portal',
    destino: 'PENDIENTE_ENVIO',
    tono: 'accion',
    // En H2W NO se cifra. El cifrado protege el tramo SFTP, donde el archivo viaja solo hasta el
    // buzón del banco; aquí lo descarga una persona ya autenticada en la consola y lo sube por
    // HTTPS al portal. La envoltura PGP no añadiría protección y sí un paso más que puede fallar
    // —y que dejaba al operador con un `.gpg` que el portal no acepta—.
    nota: 'Se descarga el TXT en claro: en este canal no hace falta cifrar.',
  },
  PENDIENTE_ENVIO: {
    accion: 'Confirmar subida',
    destino: 'ENVIADA',
    tono: 'atencion',
    nota: 'Descargada pero sin confirmar: el banco todavía no la tiene.',
  },
  ENVIADA: {
    accion: 'Cerrar con el resultado del portal',
    destino: 'PROCESADA',
    tono: 'atencion',
    // En H2H aquí se espera al buzón OUT; en H2W no hay buzón que esperar, el resultado
    // está en la pantalla del banco y nadie lo va a traer solo.
    nota: 'En este canal no llega respuesta al buzón: el resultado lo declara el operador.',
  },
};

/**
 * Qué le toca a una planilla, según su estado Y su canal.
 *
 * <p>La modalidad es opcional para no romper a los llamadores que aún no la pasan: sin ella
 * se asume H2H, que es el canal por defecto de todo el sistema.</p>
 */
export const siguientePaso = (
  estado: string | null | undefined,
  modalidad?: string | null
): SiguientePaso => {
  const clave = String(estado ?? '');
  if (String(modalidad ?? '').toUpperCase() === 'H2W' && SIGUIENTE_PASO_H2W[clave]) {
    return SIGUIENTE_PASO_H2W[clave];
  }
  return SIGUIENTE_PASO[clave] ?? { accion: '—', destino: null, tono: 'cerrado' };
};

/**
 * ¿Esta planilla espera a una persona en lugar de avanzar sola?
 *
 * <p>Una planilla `MANUAL` en GENERADA parece "en curso" en la bandeja, pero el ciclo
 * automático no la va a tocar nunca: se queda ahí hasta que alguien la empuje. Sin esta
 * marca, es indistinguible de una que el job procesará en tres minutos.</p>
 */
export const esperaOperador = (row: {
  modoProcesamiento?: string | null;
  modalidadCodigo?: string | null;
}): boolean =>
  String(row.modoProcesamiento ?? '').toUpperCase() === 'MANUAL' ||
  String(row.modalidadCodigo ?? '').toUpperCase() === 'H2W';
