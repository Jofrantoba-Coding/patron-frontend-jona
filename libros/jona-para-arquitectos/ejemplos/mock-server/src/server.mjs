// Servidor mock del contrato ../../contrato-api/login.openapi.yaml. Solo usa módulos de Node.
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { ESCENARIOS, USUARIOS } from './datos.mjs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Correlation-Id, X-Mock-Scenario',
  'Access-Control-Expose-Headers': 'X-Correlation-Id',
};

const FORZADOS = {
  credencialesInvalidas: [401, 'INVALID_CREDENTIALS', 'Usuario o clave incorrectos.'],
  usuarioBloqueado: [403, 'USER_DISABLED', 'El usuario está bloqueado.'],
  errorServidor: [500, 'INTERNAL_ERROR', 'Error interno del servidor.'],
};

/**
 * Crea el servidor (sin escuchar). `escenarioPorDefecto` aplica a las peticiones sin
 * cabecera X-Mock-Scenario; POST /__mock/scenario lo cambia y POST /__mock/reset lo restaura.
 */
export function createMockServer({ escenarioPorDefecto = 'exitoso' } = {}) {
  let escenarioActual = escenarioPorDefecto;

  return createServer(async (req, res) => {
    const traceId = req.headers['x-correlation-id'] || randomUUID();
    const responder = (status, body) => {
      res.writeHead(status, { ...CORS, 'Content-Type': 'application/json', 'X-Correlation-Id': traceId });
      res.end(body === undefined ? undefined : JSON.stringify(body));
    };
    const error = (status, code, message, details = []) => responder(status, { code, message, details, traceId });
    const ruta = `${req.method} ${new URL(req.url, 'http://localhost').pathname}`;

    if (req.method === 'OPTIONS') return responder(204);

    if (ruta === 'POST /__mock/reset') {
      escenarioActual = escenarioPorDefecto;
      return responder(204);
    }

    if (ruta === 'POST /__mock/scenario') {
      const { escenario } = (await leerJson(req)) ?? {};
      if (!ESCENARIOS.includes(escenario)) return error(400, 'UNKNOWN_SCENARIO', `Escenario desconocido: ${escenario}`);
      escenarioActual = escenario;
      return responder(204);
    }

    if (ruta !== 'POST /auth/login') return error(404, 'NOT_FOUND', `Ruta desconocida: ${ruta}`);

    const escenario = req.headers['x-mock-scenario'] ?? escenarioActual;
    if (!ESCENARIOS.includes(escenario)) return error(400, 'UNKNOWN_SCENARIO', `Escenario desconocido: ${escenario}`);

    const body = await leerJson(req);
    const details = validarLogin(body);
    if (details.length > 0) return error(422, 'VALIDATION_ERROR', 'La petición no es válida.', details);

    if (escenario !== 'exitoso') return error(...FORZADOS[escenario]);

    const usuario = USUARIOS.find((u) => u.usuario === body.usuario && u.clave === body.clave);
    if (!usuario) return error(...FORZADOS.credencialesInvalidas);
    if (usuario.bloqueado) return error(...FORZADOS.usuarioBloqueado);

    return responder(200, {
      token: `mock-token-${usuario.id}-${randomUUID()}`,
      user: { id: usuario.id, usuario: usuario.usuario, nombre: usuario.nombre },
    });
  });
}

function validarLogin(body) {
  if (body === undefined) return [{ field: 'body', message: 'El cuerpo debe ser JSON.' }];
  return ['usuario', 'clave']
    .filter((campo) => typeof body?.[campo] !== 'string' || body[campo] === '')
    .map((campo) => ({ field: campo, message: 'Es obligatorio.' }));
}

async function leerJson(req) {
  let texto = '';
  for await (const chunk of req) texto += chunk;
  try {
    return JSON.parse(texto);
  } catch {
    return undefined;
  }
}

// Uso: node src/server.mjs   (PORT=4010, HOST=127.0.0.1, MOCK_SCENARIO=exitoso por defecto)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 4010);
  const host = process.env.HOST ?? '127.0.0.1';
  const server = createMockServer({ escenarioPorDefecto: process.env.MOCK_SCENARIO ?? 'exitoso' });
  server.listen(port, host, () => {
    console.log(`Servidor mock listo en http://${host}:${server.address().port}`);
  });
}
