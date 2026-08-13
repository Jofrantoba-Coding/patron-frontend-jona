// InterJTimeWheel.ts — JONA Contrato
// Agnostico: tipos, defaults y documentacion. Sin clases ni detalles visuales.

/** Columnas que puede mostrar la rueda. */
export type JTimeWheelParte = 'hour' | 'minute' | 'second';

/** Contrato publico de JTimeWheel. Valor `HH:mm` o `HH:mm:ss`. */
export interface InterJTimeWheel {
  /** Valor en formato 24 h. Con `showSeconds` incluye los segundos. */
  value?: string;
  showSeconds?: boolean;
  /** Salto entre minutos. 5 o 15 acortan la rueda cuando no hace falta precision al minuto. */
  minuteStep?: number;
  /** Salto entre segundos. */
  secondStep?: number;
  disabled?: boolean;
  /** Alto visible en numero de filas. Impar para que haya simetria alrededor del centro. */
  visibleRows?: number;
}

export const JTIMEWHEEL_DEFAULTS = {
  showSeconds: false,
  minuteStep: 1,
  secondStep: 1,
  visibleRows: 5,
  disabled: false,
} as const satisfies Required<
  Pick<InterJTimeWheel, 'showSeconds' | 'minuteStep' | 'secondStep' | 'visibleRows' | 'disabled'>
>;

/** Etiqueta accesible de cada columna. La lee un lector de pantalla en el spinbutton. */
export const JTIMEWHEEL_ETIQUETAS: Record<JTimeWheelParte, string> = {
  hour: 'Hora',
  minute: 'Minutos',
  second: 'Segundos',
};

export const JTIMEWHEEL_MAXIMOS: Record<JTimeWheelParte, number> = {
  hour: 23,
  minute: 59,
  second: 59,
};

/**
 * Alto de cada fila en pixeles.
 *
 * Es una constante y no un input a proposito: el ajuste por scroll-snap calcula
 * el indice dividiendo `scrollTop` entre este valor, asi que tiene que coincidir
 * exactamente con lo que pinta el CSS. Dejarlo configurable invitaria a
 * desincronizar la geometria del calculo.
 */
export const JTIMEWHEEL_ALTO_FILA = 32;

/** `7` → `"07"`. */
export const pad2 = (n: number): string => String(n).padStart(2, '0');

/** `"08:30:05"` → `{hour:8, minute:30, second:5}`. Tolera valor vacio o incompleto. */
export const parseHora = (valor: string | undefined): Record<JTimeWheelParte, number> => {
  const [h = '0', m = '0', s = '0'] = String(valor ?? '').split(':');
  const acota = (n: number, max: number) => (Number.isFinite(n) ? Math.min(max, Math.max(0, n)) : 0);
  return {
    hour: acota(Number(h), 23),
    minute: acota(Number(m), 59),
    second: acota(Number(s), 59),
  };
};

export const formatHora = (
  partes: Record<JTimeWheelParte, number>,
  conSegundos: boolean
): string =>
  conSegundos
    ? `${pad2(partes.hour)}:${pad2(partes.minute)}:${pad2(partes.second)}`
    : `${pad2(partes.hour)}:${pad2(partes.minute)}`;

/** Valores de una columna segun su salto: `minuteStep 15` → [0, 15, 30, 45]. */
export const valoresDe = (parte: JTimeWheelParte, salto: number): number[] => {
  const paso = Math.max(1, Math.floor(salto));
  const valores: number[] = [];
  for (let v = 0; v <= JTIMEWHEEL_MAXIMOS[parte]; v += paso) valores.push(v);
  return valores;
};
