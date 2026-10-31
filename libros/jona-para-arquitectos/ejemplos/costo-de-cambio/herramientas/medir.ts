import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/** Los pedidos de cambio, en orden. Cada uno es una copia completa de v0 con solo ese cambio aplicado. */
export const CAMBIOS = [
  { id: 'estilo-boton', titulo: 'C1 Estilo del botón' },
  { id: 'campo-recordarme', titulo: 'C2 Campo «recordarme»' },
  { id: 'formato-backend', titulo: 'C3 Formato del backend' },
  { id: 'segunda-vista', titulo: 'C4 Segunda vista' },
  { id: 'prueba-bloqueado', titulo: 'C5 Prueba de usuario bloqueado' },
] as const;

export const VARIANTES = ['directo', 'jona'] as const;

/** El archivo que guarda el estado de la pantalla y decide qué mostrar, en cada variante. */
export const ARCHIVO_LOGICA: Record<(typeof VARIANTES)[number], string> = {
  directo: 'src/login.ts',
  jona: 'src/UiLoginImpl.ts',
};

export interface Lineas {
  agregadas: number;
  eliminadas: number;
}

export interface MedidaCambio {
  /** Archivos con alguna línea de código distinta (modificados, nuevos o eliminados). */
  tocados: string[];
  nuevos: string[];
  eliminados: string[];
  /** ¿El cambio modificó el archivo que guarda el estado y decide qué mostrar? */
  tocaLogica: boolean;
  prod: Lineas;
  prueba: Lineas;
}

export interface MedidaVariante {
  base: { prod: { archivos: number; lineas: number }; prueba: { archivos: number; lineas: number } };
  cambios: Record<string, MedidaCambio>;
}

/** Líneas de código de un archivo: sin líneas en blanco ni líneas que son solo comentario. */
export function lineasDeCodigo(texto: string): string[] {
  const codigo: string[] = [];
  let enBloque = false;
  for (const cruda of texto.split(/\r?\n/)) {
    let resto = cruda.trim();
    while (resto !== '') {
      if (enBloque) {
        const fin = resto.indexOf('*/');
        enBloque = fin < 0;
        resto = fin < 0 ? '' : resto.slice(fin + 2).trim();
      } else if (resto.startsWith('//')) {
        resto = '';
      } else if (resto.startsWith('/*')) {
        enBloque = true;
        resto = resto.slice(2);
      } else {
        codigo.push(resto);
        resto = '';
      }
    }
  }
  return codigo;
}

/** Diferencia por líneas con la subsecuencia común más larga (LCS); compara sin espacios en blanco. */
export function diferencia(antes: string[], despues: string[]): Lineas {
  const a = antes.map((l) => l.replace(/\s+/g, ''));
  const b = despues.map((l) => l.replace(/\s+/g, ''));
  // lcs[i][j] = largo de la LCS entre a[i..] y b[j..].
  const lcs = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const comunes = lcs[0][0];
  return { agregadas: b.length - comunes, eliminadas: a.length - comunes };
}

/** Archivos .ts de una instantánea, con su ruta relativa en formato `src/x.ts` o `test/x.test.ts`. */
function archivosDe(instantanea: string): Map<string, string[]> {
  const archivos = new Map<string, string[]>();
  const recorrer = (carpeta: string): void => {
    for (const nombre of readdirSync(carpeta).sort()) {
      const ruta = join(carpeta, nombre);
      if (statSync(ruta).isDirectory()) recorrer(ruta);
      else if (nombre.endsWith('.ts')) {
        archivos.set(relative(instantanea, ruta).split('\\').join('/'), lineasDeCodigo(readFileSync(ruta, 'utf8')));
      }
    }
  };
  recorrer(instantanea);
  return archivos;
}

const esPrueba = (ruta: string): boolean => ruta.startsWith('test/');

/** Mide una variante: el costo base de v0 y cada cambio contra v0. */
export function medirVariante(raizVariante: string, cambios: readonly string[], archivoLogica: string): MedidaVariante {
  const encontradas = readdirSync(raizVariante).filter((n) => statSync(join(raizVariante, n)).isDirectory()).sort();
  const esperadas = ['v0', ...cambios].sort();
  if (encontradas.join() !== esperadas.join()) {
    throw new Error(`${raizVariante}: instantáneas ${encontradas.join(', ')}; se esperaban ${esperadas.join(', ')}`);
  }

  const v0 = archivosDe(join(raizVariante, 'v0'));
  const contar = (prueba: boolean) => {
    const rutas = [...v0.keys()].filter((r) => esPrueba(r) === prueba);
    return { archivos: rutas.length, lineas: rutas.reduce((total, r) => total + v0.get(r)!.length, 0) };
  };

  const medidas: Record<string, MedidaCambio> = {};
  for (const cambio of cambios) {
    const despues = archivosDe(join(raizVariante, cambio));
    const medida: MedidaCambio = {
      tocados: [], nuevos: [], eliminados: [], tocaLogica: false,
      prod: { agregadas: 0, eliminadas: 0 },
      prueba: { agregadas: 0, eliminadas: 0 },
    };
    for (const ruta of [...new Set([...v0.keys(), ...despues.keys()])].sort()) {
      const d = diferencia(v0.get(ruta) ?? [], despues.get(ruta) ?? []);
      if (d.agregadas + d.eliminadas === 0 && v0.has(ruta) && despues.has(ruta)) continue;
      medida.tocados.push(ruta);
      if (!v0.has(ruta)) medida.nuevos.push(ruta);
      if (!despues.has(ruta)) medida.eliminados.push(ruta);
      const lineas = esPrueba(ruta) ? medida.prueba : medida.prod;
      lineas.agregadas += d.agregadas;
      lineas.eliminadas += d.eliminadas;
    }
    medida.tocaLogica = medida.tocados.includes(archivoLogica);
    medidas[cambio] = medida;
  }
  return { base: { prod: contar(false), prueba: contar(true) }, cambios: medidas };
}

/** Mide las dos variantes del experimento (`<raiz>/variantes/<variante>/<instantánea>`). */
export function medirExperimento(raiz: string): Record<string, MedidaVariante> {
  const ids = CAMBIOS.map((c) => c.id);
  return Object.fromEntries(VARIANTES.map((v) => [v, medirVariante(join(raiz, 'variantes', v), ids, ARCHIVO_LOGICA[v])]));
}

/** Tablas en Markdown, listas para el capítulo. */
export function tablaMarkdown(resultados: Record<string, MedidaVariante>): string {
  const filas = [
    '| Variante | Archivos de producción | Líneas de producción | Archivos de prueba | Líneas de prueba |',
    '|---|---:|---:|---:|---:|',
    ...VARIANTES.map((v) => {
      const { prod, prueba } = resultados[v].base;
      return `| ${v} | ${prod.archivos} | ${prod.lineas} | ${prueba.archivos} | ${prueba.lineas} |`;
    }),
    '',
    '| Cambio | Variante | Archivos tocados (nuevos) | Producción +/− | Pruebas +/− | ¿Toca la lógica? |',
    '|---|---|---:|---:|---:|:---:|',
  ];
  for (const { id, titulo } of CAMBIOS) {
    for (const v of VARIANTES) {
      const m = resultados[v].cambios[id];
      filas.push(
        `| ${titulo} | ${v} | ${m.tocados.length} (${m.nuevos.length}) | +${m.prod.agregadas} / −${m.prod.eliminadas} | +${m.prueba.agregadas} / −${m.prueba.eliminadas} | ${m.tocaLogica ? 'sí' : 'no'} |`,
      );
    }
  }
  return filas.join('\n');
}
