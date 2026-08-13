/**
 * Núcleo de gráficos — escalas y geometría.
 *
 * Es la parte que decide dónde va cada píxel, así que un error aquí no rompe el
 * build: dibuja un gráfico que miente. Por eso se prueba sola, sin DOM.
 */
import { describe, expect, it } from 'vitest';
import {
  acumular,
  bandasAgrupadas,
  escalaBanda,
  escalaLineal,
  intervaloBonito,
  magnitudDe,
} from './escalas';
import { areaDibujo, barrasHorizontales, barrasVerticales, puntosSerie, rutaArea, rutaLinea } from './geometria';

describe('intervalos legibles', () => {
  it('magnitudDe devuelve la potencia de diez inferior', () => {
    expect(magnitudDe(137)).toBe(100);
    expect(magnitudDe(7)).toBe(1);
    expect(magnitudDe(0.4)).toBe(0.1);
  });

  it('redondea a un múltiplo de 1, 2, 2.5, 5 o 10', () => {
    // Nadie sabe sumar de 137 en 137.
    expect(intervaloBonito(137)).toBe(200);
    expect(intervaloBonito(1.1)).toBe(2);
    expect(intervaloBonito(21)).toBe(25);
    expect(intervaloBonito(6)).toBe(10);
  });

  it('sin decimales, nunca baja de 1', () => {
    expect(intervaloBonito(0.3, false)).toBe(1);
  });

  it('aguanta entradas degeneradas sin romperse', () => {
    expect(intervaloBonito(0)).toBe(1);
    expect(intervaloBonito(Number.NaN)).toBe(1);
  });
});

describe('escala lineal', () => {
  it('ancla el eje en cero cuando todo es positivo', () => {
    // Recortar la base exagera las diferencias: es mentir sin decir falsedades.
    const e = escalaLineal({ valores: [120, 150, 130], largo: 100 });
    expect(e.min).toBe(0);
  });

  it('conserva el mínimo real cuando hay negativos', () => {
    const e = escalaLineal({ valores: [-40, 90], largo: 100 });
    expect(e.min).toBeLessThan(0);
    expect(e.max).toBeGreaterThan(0);
  });

  it('no arrastra error binario en los ticks', () => {
    const e = escalaLineal({ valores: [0, 1], largo: 100 });
    for (const t of e.ticks) {
      expect(String(t)).not.toMatch(/0000000|9999999/);
    }
  });

  it('invertida mapea el máximo arriba (Y crece hacia abajo en SVG)', () => {
    const e = escalaLineal({ valores: [0, 100], largo: 200, invertida: true });
    expect(e.posicion(e.max)).toBeCloseTo(0, 5);
    expect(e.posicion(e.min)).toBeCloseTo(200, 5);
  });

  it('con todos los valores iguales sigue produciendo un rango usable', () => {
    const e = escalaLineal({ valores: [5, 5, 5], largo: 100 });
    expect(e.max).toBeGreaterThan(e.min);
    expect(e.ticks.length).toBeGreaterThan(1);
  });

  it('sin datos no lanza', () => {
    const e = escalaLineal({ valores: [], largo: 100 });
    expect(e.ticks.length).toBeGreaterThan(0);
  });
});

describe('escala de bandas', () => {
  it('reparte el largo y deja aire entre categorías', () => {
    const b = escalaBanda({ cantidad: 4, largo: 400, aire: 0.2 });
    expect(b.paso).toBe(100);
    expect(b.ancho).toBeCloseTo(80, 5);
    expect(b.centro(0)).toBeCloseTo(50, 5);
  });

  it('con cero categorías no divide por cero', () => {
    const b = escalaBanda({ cantidad: 0, largo: 300 });
    expect(Number.isFinite(b.paso)).toBe(true);
  });

  it('las barras agrupadas dejan hueco entre series', () => {
    const g = bandasAgrupadas(100, 2, 2);
    expect(g.ancho).toBeCloseTo(49, 5);
    expect(g.desplazamiento(1)).toBeCloseTo(51, 5);
  });
});

describe('geometría', () => {
  const area = areaDibujo(400, 200);

  it('el área de dibujo descuenta los márgenes', () => {
    expect(area.ancho).toBeLessThan(400);
    expect(area.alto).toBeLessThan(200);
  });

  it('la línea se interrumpe en los huecos, no los une', () => {
    // Un null es "no hay dato", no "vale cero": unirlo dibujaría una tendencia
    // que nadie midió.
    const escalaY = escalaLineal({ valores: [0, 10], largo: area.alto, invertida: true });
    const puntos = puntosSerie({ datos: [1, null, 3], area, escalaY, categorias: 3 });
    const d = rutaLinea(puntos);
    expect((d.match(/M/g) ?? []).length).toBe(2);
  });

  it('el área se cierra contra la base', () => {
    const escalaY = escalaLineal({ valores: [0, 10], largo: area.alto, invertida: true });
    const puntos = puntosSerie({ datos: [1, 2, 3], area, escalaY, categorias: 3 });
    expect(rutaArea(puntos, area.y + area.alto)).toMatch(/Z$/);
  });

  it('las barras apiladas se montan una sobre otra', () => {
    const datos = [
      [10, 10],
      [5, 5],
    ];
    const escalaY = escalaLineal({ valores: [15], largo: area.alto, invertida: true });
    const barras = barrasVerticales({ seriesDatos: datos, area, escalaY, apilado: true });
    const cat0 = barras.filter((b) => b.indice === 0);
    expect(cat0).toHaveLength(2);
    // El segundo segmento queda por encima del primero.
    expect(cat0[1].y).toBeLessThan(cat0[0].y);
  });

  it('las barras agrupadas no se solapan', () => {
    const datos = [
      [10, 10],
      [5, 5],
    ];
    const escalaY = escalaLineal({ valores: [10], largo: area.alto, invertida: true });
    const barras = barrasVerticales({ seriesDatos: datos, area, escalaY, apilado: false });
    const [a, b] = barras.filter((x) => x.indice === 0);
    expect(a.x + a.ancho).toBeLessThanOrEqual(b.x);
  });

  it('un valor pequeño pero no nulo sigue siendo visible', () => {
    // Sin alto mínimo, 0,3px desaparece y el dato parece ausente.
    const escalaY = escalaLineal({ valores: [0, 1000], largo: area.alto, invertida: true });
    const barras = barrasVerticales({ seriesDatos: [[1]], area, escalaY, apilado: false });
    expect(barras[0].alto).toBeGreaterThanOrEqual(1);
  });

  it('los nulos no generan barra', () => {
    const escalaY = escalaLineal({ valores: [10], largo: area.alto, invertida: true });
    const barras = barrasVerticales({ seriesDatos: [[10, null]], area, escalaY, apilado: false });
    expect(barras).toHaveLength(1);
  });

  it('las barras horizontales crecen hacia la derecha desde el cero', () => {
    // En X el valor SÍ crece hacia la derecha: la escala no se invierte.
    const escalaX = escalaLineal({ valores: [0, 100], largo: area.ancho });
    const barras = barrasHorizontales({ seriesDatos: [[100]], area, escalaX, apilado: false });
    expect(barras[0].x).toBeCloseTo(area.x, 0);
    expect(barras[0].ancho).toBeGreaterThan(area.ancho * 0.9);
  });

  it('las barras horizontales apiladas se encadenan hacia la derecha', () => {
    const escalaX = escalaLineal({ valores: [30], largo: area.ancho });
    const barras = barrasHorizontales({
      seriesDatos: [[10], [20]],
      area,
      escalaX,
      apilado: true,
    });
    const [a, b] = barras.filter((x) => x.indice === 0);
    expect(b.x).toBeGreaterThan(a.x);
    expect(b.x).toBeCloseTo(a.x + a.ancho, 0);
  });

  it('cada categoría horizontal ocupa su propia franja', () => {
    const escalaX = escalaLineal({ valores: [10], largo: area.ancho });
    const barras = barrasHorizontales({ seriesDatos: [[5, 8]], area, escalaX, apilado: false });
    expect(barras[0].y).toBeLessThan(barras[1].y);
    expect(barras[0].y + barras[0].alto).toBeLessThanOrEqual(barras[1].y);
  });

  it('acumular suma por categoría tratando los nulos como cero', () => {
    const { total } = acumular([
      [1, 2],
      [3, null],
    ]);
    expect(total).toEqual([4, 2]);
  });
});
