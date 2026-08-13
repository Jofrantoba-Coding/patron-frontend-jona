// escalas.ts — núcleo de gráficos JONA: escalas y ticks.
//
// TypeScript puro: sin Angular, sin React, sin DOM. Es la parte que decide
// DÓNDE va cada cosa, y por eso vive aparte y se prueba sola. El mismo archivo
// se replica en la librería React sin cambiar una línea.

/** Potencia de diez inmediatamente inferior a un número. `137` → `100`. */
export const magnitudDe = (n: number): number => Math.pow(10, Math.floor(Math.log10(Math.abs(n) || 1)));

/**
 * Redondea un intervalo crudo al siguiente múltiplo "legible".
 *
 * <p>Un eje con marcas cada 137 unidades es ilegible aunque el reparto sea
 * perfecto: el lector no sabe sumar de 137 en 137. Se ajusta a un múltiplo de
 * diez de 1, 2, 2.5 o 5, que son los saltos que una persona sigue de un
 * vistazo. Es el mismo criterio que usan las librerías maduras del sector, y no
 * hay motivo para inventar otro.</p>
 */
export function intervaloBonito(crudo: number, permitirDecimales = true): number {
  if (!Number.isFinite(crudo) || crudo <= 0) return 1;
  const magnitud = magnitudDe(crudo);
  const normalizado = crudo / magnitud;
  const multiplos = [1, 2, 2.5, 5, 10];

  let elegido = multiplos[multiplos.length - 1];
  for (const m of multiplos) {
    if (normalizado <= m) {
      elegido = m;
      break;
    }
  }
  const intervalo = elegido * magnitud;
  // Con enteros, un intervalo fraccionario produce etiquetas como "2,5 pagos".
  return permitirDecimales ? intervalo : Math.max(1, Math.round(intervalo));
}

export interface EscalaLineal {
  min: number;
  max: number;
  ticks: number[];
  /** Valor del dominio → posición en píxeles dentro del rango. */
  posicion: (valor: number) => number;
}

/**
 * Escala de valores con ticks legibles.
 *
 * <p>El eje arranca en cero siempre que los datos sean todos positivos: recortar
 * la base exagera las diferencias y es la forma más común de mentir con un
 * gráfico de barras sin decir una sola falsedad.</p>
 */
export function escalaLineal(config: {
  valores: number[];
  largo: number;
  ticksDeseados?: number;
  permitirDecimales?: boolean;
  /** Invierte la dirección: en SVG la Y crece hacia abajo. */
  invertida?: boolean;
}): EscalaLineal {
  const { valores, largo, ticksDeseados = 5, permitirDecimales = true, invertida = false } = config;
  const finitos = valores.filter((v) => Number.isFinite(v));

  let min = finitos.length ? Math.min(...finitos) : 0;
  let max = finitos.length ? Math.max(...finitos) : 0;

  // Todo positivo → base en cero. Con negativos se conserva el mínimo real,
  // porque ahí el cero es una referencia y no el suelo.
  if (min > 0) min = 0;
  if (max < 0) max = 0;
  if (min === max) max = min + 1;

  const intervalo = intervaloBonito((max - min) / Math.max(1, ticksDeseados), permitirDecimales);
  const minAjustado = Math.floor(min / intervalo) * intervalo;
  const maxAjustado = Math.ceil(max / intervalo) * intervalo;

  const ticks: number[] = [];
  // Se acumula con multiplicación y no sumando: sumar 0.1 repetidamente
  // arrastra error binario y saca ticks como 0.30000000000000004.
  const pasos = Math.round((maxAjustado - minAjustado) / intervalo);
  for (let i = 0; i <= pasos; i++) {
    ticks.push(Number((minAjustado + i * intervalo).toFixed(10)));
  }

  const span = maxAjustado - minAjustado || 1;
  const posicion = (valor: number): number => {
    const t = (valor - minAjustado) / span;
    return invertida ? largo - t * largo : t * largo;
  };

  return { min: minAjustado, max: maxAjustado, ticks, posicion };
}

export interface EscalaBanda {
  /** Inicio de la banda de la categoría `i`. */
  inicio: (i: number) => number;
  /** Ancho de una banda completa (incluye el aire entre categorías). */
  paso: number;
  /** Ancho útil de la banda, ya descontado el aire. */
  ancho: number;
  /** Centro de la banda: donde se ancla una línea o una etiqueta. */
  centro: (i: number) => number;
}

/**
 * Escala de categorías (bandas).
 *
 * @param aire proporción de la banda que queda vacía entre categorías (0–1).
 */
export function escalaBanda(config: { cantidad: number; largo: number; aire?: number }): EscalaBanda {
  const { cantidad, largo, aire = 0.24 } = config;
  const n = Math.max(1, cantidad);
  const paso = largo / n;
  const ancho = paso * (1 - aire);
  const margen = (paso - ancho) / 2;
  return {
    paso,
    ancho,
    inicio: (i) => i * paso + margen,
    centro: (i) => i * paso + paso / 2,
  };
}

/**
 * Reparte el ancho de una banda entre varias series contiguas.
 *
 * <p>El hueco de 2px entre barras vecinas no es decorativo: sin él dos barras
 * de series distintas se leen como un único bloque bicolor.</p>
 */
export function bandasAgrupadas(anchoBanda: number, series: number, hueco = 2) {
  const n = Math.max(1, series);
  const anchoSerie = Math.max(1, (anchoBanda - hueco * (n - 1)) / n);
  return {
    ancho: anchoSerie,
    desplazamiento: (indiceSerie: number) => indiceSerie * (anchoSerie + hueco),
  };
}

/** Acumulados por categoría para las formas apiladas. */
export function acumular(seriesDatos: (number | null)[][]): { base: number[]; total: number[] } {
  const largo = Math.max(0, ...seriesDatos.map((d) => d.length));
  const base = new Array(largo).fill(0);
  const total = new Array(largo).fill(0);
  for (const datos of seriesDatos) {
    for (let i = 0; i < largo; i++) total[i] += datos[i] ?? 0;
  }
  return { base, total };
}
