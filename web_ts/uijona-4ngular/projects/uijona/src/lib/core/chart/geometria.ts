// geometria.ts — núcleo de gráficos JONA: layout y rutas SVG.
//
// TypeScript puro. Convierte datos ya escalados en las coordenadas y rutas que
// el template pinta. Ninguna decisión de color vive aquí.
import { acumular, bandasAgrupadas, escalaBanda, escalaLineal, type EscalaLineal } from './escalas';

export interface AreaDibujo {
  x: number;
  y: number;
  ancho: number;
  alto: number;
}

export interface Margenes {
  arriba: number;
  derecha: number;
  abajo: number;
  izquierda: number;
}

/**
 * Márgenes por defecto.
 *
 * <p>El izquierdo es el más ancho porque ahí van las etiquetas de valor, que
 * crecen con el número de dígitos; el de abajo, las de categoría.</p>
 */
export const MARGENES: Margenes = { arriba: 12, derecha: 16, abajo: 32, izquierda: 52 };

export const areaDibujo = (ancho: number, alto: number, m: Margenes = MARGENES): AreaDibujo => ({
  x: m.izquierda,
  y: m.arriba,
  ancho: Math.max(1, ancho - m.izquierda - m.derecha),
  alto: Math.max(1, alto - m.arriba - m.abajo),
});

export interface PuntoXY {
  x: number;
  y: number;
  /** Valor original, para el tooltip y la tabla. */
  valor: number | null;
  indice: number;
}

/**
 * Ruta de una línea, saltando los huecos.
 *
 * <p>Un `null` es «no hay dato», no «vale cero»: la línea se interrumpe. Unir
 * los extremos dibujaría una tendencia que nadie midió.</p>
 */
export function rutaLinea(puntos: PuntoXY[]): string {
  let d = '';
  let levantado = true;
  for (const p of puntos) {
    if (p.valor === null) {
      levantado = true;
      continue;
    }
    d += `${levantado ? 'M' : 'L'}${redondear(p.x)} ${redondear(p.y)} `;
    levantado = false;
  }
  return d.trim();
}

/** Ruta de un área: la línea, bajada a la base y cerrada. */
export function rutaArea(puntos: PuntoXY[], yBase: number): string {
  const tramos: PuntoXY[][] = [];
  let actual: PuntoXY[] = [];
  for (const p of puntos) {
    if (p.valor === null) {
      if (actual.length) tramos.push(actual);
      actual = [];
      continue;
    }
    actual.push(p);
  }
  if (actual.length) tramos.push(actual);

  return tramos
    .map((tramo) => {
      const arriba = tramo.map((p, i) => `${i === 0 ? 'M' : 'L'}${redondear(p.x)} ${redondear(p.y)}`).join(' ');
      const ultimo = tramo[tramo.length - 1];
      const primero = tramo[0];
      return `${arriba} L${redondear(ultimo.x)} ${redondear(yBase)} L${redondear(primero.x)} ${redondear(yBase)} Z`;
    })
    .join(' ');
}

export interface Barra {
  x: number;
  y: number;
  ancho: number;
  alto: number;
  valor: number | null;
  indice: number;
  serie: number;
}

/** Geometría de barras verticales, agrupadas o apiladas. */
export function barrasVerticales(config: {
  seriesDatos: (number | null)[][];
  area: AreaDibujo;
  escalaY: EscalaLineal;
  apilado: boolean;
  aire?: number;
}): Barra[] {
  const { seriesDatos, area, escalaY, apilado, aire } = config;
  const categorias = Math.max(0, ...seriesDatos.map((d) => d.length));
  const banda = escalaBanda({ cantidad: categorias, largo: area.ancho, aire });
  const grupo = apilado ? null : bandasAgrupadas(banda.ancho, seriesDatos.length);
  const { base } = acumular(seriesDatos);
  const yCero = area.y + escalaY.posicion(0);
  const barras: Barra[] = [];

  seriesDatos.forEach((datos, s) => {
    for (let i = 0; i < categorias; i++) {
      const valor = datos[i] ?? null;
      if (valor === null) continue;

      const x = apilado
        ? area.x + banda.inicio(i)
        : area.x + banda.inicio(i) + (grupo?.desplazamiento(s) ?? 0);
      const ancho = apilado ? banda.ancho : (grupo?.ancho ?? banda.ancho);

      let yValor: number;
      let alto: number;
      if (apilado) {
        const desde = base[i];
        const hasta = desde + valor;
        yValor = area.y + escalaY.posicion(hasta);
        alto = Math.abs(escalaY.posicion(desde) - escalaY.posicion(hasta));
        base[i] = hasta;
      } else {
        yValor = area.y + escalaY.posicion(Math.max(0, valor));
        alto = Math.abs(yCero - (area.y + escalaY.posicion(valor)));
      }

      barras.push({
        x: redondear(x),
        y: redondear(yValor),
        ancho: redondear(ancho),
        // Un valor pequeño pero no nulo debe verse: sin mínimo, una barra de
        // 0,3px desaparece y el dato parece ausente en vez de pequeño.
        alto: Math.max(valor === 0 ? 0 : 1, redondear(alto)),
        valor,
        indice: i,
        serie: s,
      });
    }
  });
  return barras;
}

/**
 * Geometría de barras horizontales.
 *
 * <p>Devuelve el mismo `Barra` que la versión vertical —los ejes son lo único
 * que cambia—, así que el template pinta los mismos `<rect>` sin ramificar. La
 * forma horizontal existe porque con nombres de categoría largos (los estados
 * de una operación, por ejemplo) el rótulo cabe entero a la izquierda en vez de
 * girarse o recortarse.</p>
 */
export function barrasHorizontales(config: {
  seriesDatos: (number | null)[][];
  area: AreaDibujo;
  escalaX: EscalaLineal;
  apilado: boolean;
  aire?: number;
}): Barra[] {
  const { seriesDatos, area, escalaX, apilado, aire } = config;
  const categorias = Math.max(0, ...seriesDatos.map((d) => d.length));
  const banda = escalaBanda({ cantidad: categorias, largo: area.alto, aire });
  const grupo = apilado ? null : bandasAgrupadas(banda.ancho, seriesDatos.length);
  const { base } = acumular(seriesDatos);
  const xCero = area.x + escalaX.posicion(0);
  const barras: Barra[] = [];

  seriesDatos.forEach((datos, s) => {
    for (let i = 0; i < categorias; i++) {
      const valor = datos[i] ?? null;
      if (valor === null) continue;

      const y = apilado
        ? area.y + banda.inicio(i)
        : area.y + banda.inicio(i) + (grupo?.desplazamiento(s) ?? 0);
      const grosor = apilado ? banda.ancho : (grupo?.ancho ?? banda.ancho);

      let x: number;
      let largo: number;
      if (apilado) {
        const desde = base[i];
        const hasta = desde + valor;
        x = area.x + escalaX.posicion(Math.min(desde, hasta));
        largo = Math.abs(escalaX.posicion(hasta) - escalaX.posicion(desde));
        base[i] = hasta;
      } else {
        x = area.x + escalaX.posicion(Math.min(0, valor));
        largo = Math.abs(area.x + escalaX.posicion(valor) - xCero);
      }

      barras.push({
        x: redondear(x),
        y: redondear(y),
        ancho: Math.max(valor === 0 ? 0 : 1, redondear(largo)),
        alto: redondear(grosor),
        valor,
        indice: i,
        serie: s,
      });
    }
  });
  return barras;
}

/** Puntos de una serie de línea/área sobre el centro de cada banda. */
export function puntosSerie(config: {
  datos: (number | null)[];
  area: AreaDibujo;
  escalaY: EscalaLineal;
  categorias: number;
}): PuntoXY[] {
  const { datos, area, escalaY, categorias } = config;
  const banda = escalaBanda({ cantidad: categorias, largo: area.ancho, aire: 0 });
  return datos.map((valor, i) => ({
    x: redondear(area.x + banda.centro(i)),
    y: valor === null ? 0 : redondear(area.y + escalaY.posicion(valor)),
    valor,
    indice: i,
  }));
}

/** Prepara todo lo que el template necesita para pintar. */
export function calcularGrafico(config: {
  seriesDatos: (number | null)[][];
  ancho: number;
  alto: number;
  apilado: boolean;
  permitirDecimales?: boolean;
  /** En horizontal el eje de valores es el X y las categorías van a la izquierda. */
  horizontal?: boolean;
  /** Margen izquierdo a medida: los nombres de categoría necesitan sitio. */
  margenIzquierdo?: number;
}) {
  const { seriesDatos, ancho, alto, apilado, permitirDecimales, horizontal, margenIzquierdo } = config;
  const area = areaDibujo(ancho, alto, {
    ...MARGENES,
    izquierda: margenIzquierdo ?? MARGENES.izquierda,
  });
  const valores = apilado
    ? acumular(seriesDatos).total
    : seriesDatos.flat().filter((v): v is number => v !== null);
  const escalaY = escalaLineal({
    valores: valores.length ? valores : [0],
    // En horizontal, el eje de valores se mide a lo ancho; y NO se invierte,
    // porque en X el valor sí crece hacia la derecha.
    largo: horizontal ? area.ancho : area.alto,
    invertida: !horizontal,
    permitirDecimales,
  });
  return { area, escalaY };
}

/** Medio píxel de desplazamiento en las líneas de rejilla las deja nítidas. */
export const nitido = (v: number): number => Math.round(v) + 0.5;

const redondear = (v: number): number => Math.round(v * 100) / 100;
