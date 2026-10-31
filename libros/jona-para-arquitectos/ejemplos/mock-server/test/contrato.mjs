// Validación de respuestas contra ../contrato-api/login.openapi.yaml (solo en pruebas).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { parse } from 'yaml';

const RUTA_CONTRATO = fileURLToPath(new URL('../../contrato-api/login.openapi.yaml', import.meta.url));
export const contrato = parse(readFileSync(RUTA_CONTRATO, 'utf8'));

const ID = 'https://ejemplos.jona/login.openapi';
const ajv = new Ajv2020({ strict: false, allErrors: true });
ajv.addSchema({ $id: ID, components: contrato.components });

/** Devuelve la lista de errores de esquema (vacía si la respuesta cumple el contrato). */
export function erroresDeRespuesta(ruta, metodo, status, body) {
  const respuesta = contrato.paths[ruta]?.[metodo]?.responses?.[String(status)];
  if (!respuesta) return [`el contrato no declara ${status} para ${metodo.toUpperCase()} ${ruta}`];
  const ref = respuesta.content['application/json'].schema.$ref;
  const validar = ajv.compile({ $ref: `${ID}${ref}` });
  return validar(body) ? [] : validar.errors.map((e) => `${e.instancePath} ${e.message}`);
}
