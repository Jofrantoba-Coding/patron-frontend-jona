// Uso: npm run check -- <carpeta> [--deuda archivo.json]
// Termina en 1 si hay una violación nueva o si la deuda anota algo que ya se corrigió.
import { resolve } from 'node:path';
import { aplicarDeuda, leerDeuda } from './deuda.js';
import { revisar } from './jona-check.js';

const argumentos = process.argv.slice(2);
const posDeuda = argumentos.indexOf('--deuda');
const rutaDeuda = posDeuda >= 0 ? argumentos[posDeuda + 1] : undefined;
const carpeta = argumentos.find((a, i) => !a.startsWith('--') && (posDeuda < 0 || i !== posDeuda + 1));

if (carpeta === undefined || (posDeuda >= 0 && rutaDeuda === undefined)) {
  console.error('Uso: npm run check -- <carpeta> [--deuda archivo.json]');
  process.exit(2);
}

const violaciones = revisar(resolve(carpeta));
const resultado = aplicarDeuda(violaciones, rutaDeuda ? leerDeuda(resolve(rutaDeuda)) : []);
const donde = (v: { archivo: string; linea?: number }) => (v.linea ? `${v.archivo}:${v.linea}` : v.archivo);

console.log(`JONA: ${violaciones.length} violaciones en ${carpeta} (${resultado.toleradas.length} toleradas por la deuda)`);
for (const v of resultado.nuevas) console.log(`  NUEVA    ${v.regla} ${donde(v)} ${v.mensaje}`);
for (const e of resultado.saldadas) console.log(`  SALDADA  ${e.regla} ${e.archivo}: ya no ocurre; quítela de ${rutaDeuda}`);
process.exitCode = resultado.aprobado ? 0 : 1;
