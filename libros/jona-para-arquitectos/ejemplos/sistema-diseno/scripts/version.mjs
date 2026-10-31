// Clasifica la diferencia entre dos superficies públicas según el versionado semántico.

/**
 * @typedef {'MAJOR' | 'MINOR' | 'PATCH'} Nivel
 * @typedef {{ nivel: Nivel, detalle: string }} Cambio
 * @typedef {import('./superficie.mjs').Superficie} Superficie
 */

const GRAVEDAD = { PATCH: 0, MINOR: 1, MAJOR: 2 };

/**
 * MAJOR rompe a quien ya usa el paquete; MINOR solo agrega; PATCH no toca la superficie.
 * @param {Superficie} anterior
 * @param {Superficie} actual
 * @returns {{ nivel: Nivel, cambios: Cambio[] }}
 */
export function clasificarCambio(anterior, actual) {
  /** @type {Cambio[]} */
  const cambios = [];
  const major = (detalle) => cambios.push({ nivel: 'MAJOR', detalle });
  const minor = (detalle) => cambios.push({ nivel: 'MINOR', detalle });

  for (const [nombre, antes] of Object.entries(anterior.exports)) {
    const ahora = actual.exports[nombre];
    if (!ahora) { major(`${nombre}: exportación eliminada`); continue; }
    if (ahora.kind !== antes.kind) { major(`${nombre}: pasó de ${antes.kind} a ${ahora.kind}`); continue; }
    if (antes.definition !== ahora.definition) major(`${nombre}: el tipo cambió`);

    const propsAntes = antes.props ?? {};
    const propsAhora = ahora.props ?? {};
    for (const [prop, p] of Object.entries(propsAntes)) {
      const q = propsAhora[prop];
      if (!q) major(`${nombre}.${prop}: propiedad eliminada`);
      else if (p.optional && !q.optional) major(`${nombre}.${prop}: pasó de opcional a obligatoria`);
      else if (p.type !== q.type) major(`${nombre}.${prop}: el tipo cambió de ${p.type} a ${q.type}`);
      else if (!p.optional && q.optional) minor(`${nombre}.${prop}: pasó de obligatoria a opcional`);
    }
    for (const [prop, q] of Object.entries(propsAhora)) {
      if (prop in propsAntes) continue;
      if (q.optional) minor(`${nombre}.${prop}: propiedad opcional nueva`);
      else major(`${nombre}.${prop}: propiedad obligatoria nueva`);
    }
  }
  for (const nombre of Object.keys(actual.exports)) {
    if (!(nombre in anterior.exports)) minor(`${nombre}: exportación nueva`);
  }

  /** @type {Nivel} */
  const nivel = cambios.reduce((max, c) => (GRAVEDAD[c.nivel] > GRAVEDAD[max] ? c.nivel : max), 'PATCH');
  return { nivel, cambios };
}

const partes = (version) => version.split('.').map(Number);

/**
 * La menor versión que admite un cambio de cierto nivel.
 * @param {string} anterior
 * @param {Nivel} nivel
 */
export function versionMinima(anterior, nivel) {
  const [mayor, menor, parche] = partes(anterior);
  if (nivel === 'MAJOR') return `${mayor + 1}.0.0`;
  if (nivel === 'MINOR') return `${mayor}.${menor + 1}.0`;
  return `${mayor}.${menor}.${parche}`;
}

/**
 * ¿La versión nueva sube al menos lo que el cambio exige?
 * @param {string} anterior
 * @param {string} actual
 * @param {Nivel} nivel
 */
export function cumpleIncremento(anterior, actual, nivel) {
  const a = partes(actual);
  const m = partes(versionMinima(anterior, nivel));
  for (let i = 0; i < 3; i++) if (a[i] !== m[i]) return a[i] > m[i];
  return true;
}
