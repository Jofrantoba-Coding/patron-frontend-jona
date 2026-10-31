#!/usr/bin/env node
// Paso de publicación: regenera api-publica.json con la superficie actual y la versión de package.json.
// Se niega si esa versión no sube lo que el cambio exige (por ejemplo, un MAJOR sin subir el mayor).
// Uso: npm run api:actualizar
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { calcularSuperficie } from './superficie.mjs';
import { clasificarCambio, cumpleIncremento, versionMinima } from './version.mjs';

const RUTA_API = new URL('../api-publica.json', import.meta.url);
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const actual = calcularSuperficie();

if (existsSync(RUTA_API)) {
  const anterior = JSON.parse(readFileSync(RUTA_API, 'utf8'));
  const { nivel, cambios } = clasificarCambio(anterior, actual);
  for (const cambio of cambios) console.log(`${cambio.nivel.padEnd(5)} ${cambio.detalle}`);
  console.log(`Cambio ${nivel} desde ${anterior.version}.`);
  if (!cumpleIncremento(anterior.version, version, nivel)) {
    console.error(`La versión ${version} no alcanza: suba package.json al menos a ${versionMinima(anterior.version, nivel)}.`);
    process.exit(1);
  }
}

writeFileSync(RUTA_API, `${JSON.stringify({ version, ...actual }, null, 2)}\n`);
console.log(`api-publica.json actualizado a ${version}.`);
