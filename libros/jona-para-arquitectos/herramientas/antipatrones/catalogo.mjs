// Lee las fichas de antipatrones de los capítulos y arma el catálogo por capítulo del capítulo 12.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const CAPITULOS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'capitulos');
export const CAPITULO_12 = '12-evolucion-y-antipatrones.md';
export const INICIO = '<!-- CATALOGO:INICIO -->';
export const FIN = '<!-- CATALOGO:FIN -->';

const leer = (archivo) => readFileSync(join(CAPITULOS, archivo), 'utf8').replace(/\r\n/g, '\n');

/** Archivos de capítulo, en orden. */
export function capitulos() {
  return readdirSync(CAPITULOS).filter((f) => /^\d\d-.*\.md$/.test(f)).sort();
}

/** Todas las fichas: una ancla `ap-N-k` seguida de su título con la gravedad. */
export function fichas() {
  const resultado = [];
  for (const archivo of capitulos()) {
    const texto = leer(archivo);
    const titulo = texto.match(/^# Capítulo \d+\. (.+)$/m)?.[1] ?? archivo;
    for (const m of texto.matchAll(/<a id="(ap-(\d+)-\d+)"><\/a>\n###\s+(🔴|🟠|🟡)\s+(.+)/g)) {
      resultado.push({ archivo, capitulo: Number(m[2]), tituloCapitulo: titulo, ancla: m[1], gravedad: m[3], nombre: m[4].trim() });
    }
  }
  return resultado;
}

/** El bloque Markdown del catálogo por capítulo. */
export function bloqueCatalogo(lista = fichas()) {
  const lineas = ['| | Antipatrón | Capítulo |', '|:-:|---|---|'];
  for (const f of lista) {
    const enlace = f.archivo === CAPITULO_12 ? `#${f.ancla}` : `${f.archivo}#${f.ancla}`;
    lineas.push(`| ${f.gravedad} | [${f.nombre}](${enlace}) | ${f.capitulo}. ${f.tituloCapitulo} |`);
  }
  return lineas.join('\n');
}

/** El texto del capítulo 12 entre los marcadores. */
export function bloqueActual() {
  const texto = leer(CAPITULO_12);
  const i = texto.indexOf(INICIO);
  const j = texto.indexOf(FIN);
  if (i < 0 || j < i) throw new Error(`faltan los marcadores ${INICIO} … ${FIN} en ${CAPITULO_12}`);
  return texto.slice(i + INICIO.length, j).trim();
}

/** Enlaces a fichas que aparecen en el capítulo 12: `archivo.md#ap-N-k` o `#ap-12-k`. */
export function enlacesDelCapitulo12() {
  const texto = leer(CAPITULO_12);
  return [...texto.matchAll(/\]\(((?:\d\d-[^)#]+\.md)?)#(ap-\d+-\d+)\)/g)].map((m) => ({ archivo: m[1] || CAPITULO_12, ancla: m[2] }));
}
