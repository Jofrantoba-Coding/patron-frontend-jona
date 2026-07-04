/**
 * Mock server H2H · Jofrantoba Consulting TI (tenant demo: Develtrex)
 * Consola Host-to-Host BCP multi-tenant. Sirve datos de ejemplo y simula
 * transiciones de estado para desarrollo de UI/QA. No cifra, no conecta SFTP real.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const DATA_PATH = path.join(__dirname, 'data', 'mock-data.json');
const PORT = process.env.PORT || 4010;

/** Estado en memoria (se reinicia al reiniciar el proceso). */
let db = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const clone = (v) => JSON.parse(JSON.stringify(v));
const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

// ── helpers de respuesta ──────────────────────────────────────────────────
function send(res, status, body, corrId) {
  const payload = body === undefined ? '' : JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Correlation-Id': corrId || uuid(),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':
      'Authorization,Content-Type,X-Organizacion-Id,X-Correlation-Id,X-Idempotency-Key',
  });
  res.end(payload);
}
const ok = (res, body, c) => send(res, 200, body, c);
const created = (res, body, c) => send(res, 201, body, c);
const accepted = (res, body, c) => send(res, 202, body, c);
const error = (res, status, code, message, c, details) =>
  send(res, status, { code, message, details, traceId: 'trc-' + uuid().slice(0, 8) }, c);

const paginate = (items, q) => {
  const page = Number(q.page || 1);
  const pageSize = Number(q.pageSize || 20);
  return { items, pagination: { page, pageSize, total: items.length } };
};

// transiciones simuladas de acciones sobre planilla
const ACTION_STATE = {
  validar: 'VALIDADA',
  cifrar: 'CIFRADA',
  enviar: 'ENVIADA',
  'reintentar-envio': 'PENDIENTE_ENVIO',
  cancelar: 'ANULADA',
};

// ── agrupación de productos (BCP) para menú/RBAC ────────────────────────────
// Código de producto de planilla → grupo de producto (3 vistas).
const PRODUCTO_GRUPO = { H: 'pagos_masivos', C: 'pagos_masivos', P: 'pagos_masivos', CG: 'pagos_masivos', T: 'transferencias', FA: 'factoring' };
// Tipo de operación → grupo de producto.
const TIPOOP_GRUPO = {
  PAGO_HABER: 'pagos_masivos', PAGO_CTS: 'pagos_masivos', PAGO_PROVEEDOR: 'pagos_masivos',
  PAGO_CHEQUE_GERENCIA: 'pagos_masivos', RETIRO_INVITADO: 'pagos_masivos',
  PAGO_TRANSFERENCIA: 'transferencias', PAGO_FACTORING: 'factoring',
};

/** Filtra operaciones por grupo de producto y/o subtipo (tipo de operación). */
function filtrarOperaciones(items, q) {
  let out = items;
  if (q.producto) out = out.filter((o) => TIPOOP_GRUPO[o.ope_n_id_tipooperacion_code] === q.producto);
  if (q.subtipo) out = out.filter((o) => o.ope_n_id_tipooperacion_code === q.subtipo);
  return out;
}

/** Filtra planillas por grupo de producto y/o subtipo (tipoproducto). */
function filtrarPlanillas(items, q) {
  let out = items;
  if (q.producto) out = out.filter((p) => PRODUCTO_GRUPO[p.pla_n_id_producto_code] === q.producto);
  if (q.subtipo) out = out.filter((p) => p.pla_n_id_tipoproducto_code === q.subtipo);
  return out;
}

/** Deriva la bandeja global de documentos uniendo planillas (claro/cifrado) + respuestas. */
function buildDocumentos() {
  const docs = [];
  for (const p of db.planillas) {
    const cifrado = !!p.pla_v_url_cifrado;
    docs.push({
      id: 'PLA-' + p.pla_u_id,
      tipoDocumento: 'PLANILLA',
      producto: PRODUCTO_GRUPO[p.pla_n_id_producto_code] || null,
      productoCode: p.pla_n_id_producto_code,
      subtipo: p.pla_n_id_tipoproducto_code || null,
      nombre: p.pla_v_nombre_archivo,
      formato: p.pla_n_id_formato_code,
      modalidad: p.pla_n_id_modalidad_valid_code,
      estado: p.pla_n_id_estadoplanilla_code,
      tipoRespuesta: null,
      cifrado,
      fecha: p.pla_d_fecha_envio || p.pla_d_fecha_archivo,
      montoTotal: p.pla_dec_montototal,
      totalOperaciones: p.pla_n_total_operaciones,
      urlClaro: p.pla_v_url_claro || null,
      urlCifrado: p.pla_v_url_cifrado || null,
      planillaId: p.pla_u_id,
    });
  }
  for (const r of db.respuestas) {
    const pl = db.planillas.find((x) => x.pla_u_id === r.prb_u_id_planilla);
    const cifrado = !!r.prb_v_url_cifrado;
    docs.push({
      id: 'RES-' + r.prb_u_id,
      tipoDocumento: 'RESPUESTA',
      producto: pl ? PRODUCTO_GRUPO[pl.pla_n_id_producto_code] || null : null,
      productoCode: pl ? pl.pla_n_id_producto_code : null,
      subtipo: pl ? pl.pla_n_id_tipoproducto_code || null : null,
      nombre: r.prb_v_nombre_archivo,
      formato: r.prb_n_id_formato_code,
      modalidad: pl ? pl.pla_n_id_modalidad_valid_code : null,
      estado: r.prb_n_id_tiporespuesta_code,
      tipoRespuesta: r.prb_n_id_tiporespuesta_code,
      cifrado,
      fecha: r.prb_d_fecha_recepcion,
      montoTotal: null,
      totalOperaciones: r.prb_n_total_operaciones,
      urlClaro: r.prb_v_url_claro || null,
      urlCifrado: r.prb_v_url_cifrado || null,
      planillaId: r.prb_u_id_planilla,
    });
  }
  return docs;
}

/** Aplica los filtros de query a la bandeja de documentos. */
function filtrarDocumentos(docs, q) {
  let out = docs;
  if (q.producto) out = out.filter((d) => d.producto === q.producto);
  if (q.subtipo) out = out.filter((d) => d.subtipo === q.subtipo);
  if (q.tipoDocumento) out = out.filter((d) => d.tipoDocumento === q.tipoDocumento);
  if (q.estado) out = out.filter((d) => d.estado === q.estado);
  if (q.formato) out = out.filter((d) => d.formato === q.formato);
  if (q.modalidad) out = out.filter((d) => d.modalidad === q.modalidad);
  if (q.cifrado != null) out = out.filter((d) => String(d.cifrado) === String(q.cifrado));
  if (q.fechaDesde) out = out.filter((d) => (d.fecha || '').slice(0, 10) >= q.fechaDesde);
  if (q.fechaHasta) out = out.filter((d) => (d.fecha || '').slice(0, 10) <= q.fechaHasta);
  return out;
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// ── router ─────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const corr = req.headers['x-correlation-id'] || uuid();
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const seg = url.pathname.split('/').filter(Boolean); // ej: ['v1','planillas','{id}','enviar']
  const q = Object.fromEntries(url.searchParams);
  const method = req.method.toUpperCase();

  if (method === 'OPTIONS') return send(res, 204, undefined, corr);

  const body = method === 'GET' ? {} : await readBody(req);
  const p = url.pathname;

  try {
    // health del propio mock
    if (p === '/__mock/health') return ok(res, { status: 'UP', mock: 'h2h', tenant: 'DEVELTREX' }, corr);

    // Auth
    if (p === '/mock/auth/login' && method === 'POST') {
      return ok(res, {
        accessToken: 'mock.jwt.token',
        refreshToken: 'mock.refresh.token',
        expiresIn: 3600,
        tenant: db.tenantContext.tenant,
        user: db.tenantContext.user,
      }, corr);
    }
    if (p === '/v1/me/context' && method === 'GET') return ok(res, db.tenantContext, corr);

    // Tenant
    if (p === '/v1/tenants/current' && method === 'GET') return ok(res, db.tenantContext.tenant, corr);
    if (p === '/v1/tenants' && method === 'GET') return ok(res, paginate([db.tenantContext.tenant], q), corr);
    if (p === '/v1/tenants' && method === 'POST') return created(res, db.tenantContext.tenant, corr);

    // Dashboard + monitoreo
    if (p === '/v1/dashboard/summary' && method === 'GET') return ok(res, db.dashboardSummary, corr);
    if (p === '/v1/monitoring/health' && method === 'GET') return ok(res, db.health, corr);

    // Catálogos
    if (p === '/v1/catalogs' && method === 'GET') return ok(res, db.catalogs, corr);
    if (seg[0] === 'v1' && seg[1] === 'catalogs' && seg[2] && method === 'GET') {
      const cat = decodeURIComponent(seg[2]);
      if (!db.catalogs[cat]) return error(res, 404, 'NOT_FOUND', `Catálogo ${cat} no existe`, corr);
      return ok(res, { catalogo: cat, items: db.catalogs[cat] }, corr);
    }

    // Operaciones
    if (p === '/v1/operaciones' && method === 'GET') return ok(res, paginate(filtrarOperaciones(db.operaciones, q), q), corr);
    if (p === '/v1/operaciones/manual' && method === 'POST') {
      const nueva = {
        ...clone(db.operaciones[0]),
        ope_u_id: uuid(),
        ope_v_idempotency_key: body.idempotencyKey || 'manual:' + Date.now(),
        ope_v_sistema_origen: body.sistemaOrigen || 'MANUAL',
        ope_v_referencia_origen: body.referenciaOrigen || 'MAN-' + Date.now(),
        ope_n_id_tipooperacion_code: body.tipoOperacion || 'PAGO_PROVEEDOR',
        ope_n_id_estadooperacion_code: 'REGISTRADA',
        ope_n_id_moneda_code: body.moneda || 'PEN',
        ope_dec_montototal: body.montoTotal ?? 0,
        ope_v_glosa: body.glosa || 'Operación manual',
        beneficiario: body.beneficiario
          ? {
              ben_n_id_tipodocumento_code: body.beneficiario.tipoDocumento,
              ben_v_numerodocumento: body.beneficiario.numeroDocumento,
              ben_v_nombre: body.beneficiario.nombre,
            }
          : clone(db.operaciones[0].beneficiario),
        cuenta: body.cuenta
          ? {
              entidadFinanciera: body.cuenta.entidadFinanciera || 'BCP',
              tipoCuenta: body.cuenta.tipoCuenta,
              numeroCuenta: body.cuenta.numeroCuenta || null,
              cuentaInterbancaria: body.cuenta.cuentaInterbancaria || null,
              moneda: body.cuenta.moneda || 'PEN',
            }
          : clone(db.operaciones[0].cuenta),
      };
      db.operaciones.unshift(nueva);
      return created(res, nueva, corr);
    }
    if (p === '/v1/operaciones/carga' && method === 'POST') {
      return accepted(res, {
        cargaId: uuid(),
        estado: 'VALIDADA_CON_ERRORES',
        totalFilas: 100,
        filasValidas: 97,
        filasError: 3,
        errores: [{ fila: 12, campo: 'cuentaInterbancaria', message: 'CCI inválido' }],
      }, corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'operaciones' && seg[2] && !seg[3] && method === 'GET') {
      const op = db.operaciones.find((o) => o.ope_u_id === seg[2]);
      return op ? ok(res, op, corr) : error(res, 404, 'NOT_FOUND', 'Operación no encontrada', corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'operaciones' && seg[3] === 'anular' && method === 'PATCH') {
      const op = db.operaciones.find((o) => o.ope_u_id === seg[2]);
      if (!op) return error(res, 404, 'NOT_FOUND', 'Operación no encontrada', corr);
      op.ope_n_id_estadooperacion_code = 'ANULADA';
      return ok(res, op, corr);
    }

    // Planillas
    if (p === '/v1/planillas' && method === 'GET') return ok(res, paginate(filtrarPlanillas(db.planillas, q), q), corr);
    if (p === '/v1/planillas/generar' && method === 'POST') {
      const nueva = {
        ...clone(db.planillas[0]),
        pla_u_id: uuid(),
        pla_n_id_producto_code: body.producto || 'H',
        pla_n_id_formato_code: body.formato || 'XML',
        pla_n_id_estadoplanilla_code: 'GENERADA',
        pla_v_cuenta_cargo: body.cuentaCargo || db.planillas[0].pla_v_cuenta_cargo,
        pla_n_id_moneda_code: body.moneda || 'PEN',
        pla_n_total_operaciones: (body.operacionIds || []).length || 1,
        pla_d_fecha_envio: null,
      };
      db.planillas.unshift(nueva);
      return created(res, nueva, corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'planillas' && seg[2] && !seg[3] && method === 'GET') {
      const pl = db.planillas.find((x) => x.pla_u_id === seg[2]);
      return pl ? ok(res, pl, corr) : error(res, 404, 'NOT_FOUND', 'Planilla no encontrada', corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'planillas' && seg[3] === 'preview' && method === 'GET') {
      const pl = db.planillas.find((x) => x.pla_u_id === seg[2]);
      if (!pl) return error(res, 404, 'NOT_FOUND', 'Planilla no encontrada', corr);
      const xml = pl.pla_n_id_formato_code === 'XML';
      return ok(res, {
        planillaId: pl.pla_u_id,
        formato: pl.pla_n_id_formato_code,
        contentType: xml ? 'application/xml' : 'text/plain',
        contenido: xml
          ? '<Document><CstmrCdtTrfInitn>...</CstmrCdtTrfInitn></Document>'
          : '01|H|20260630|PEN|418200.00|842',
        checksum: pl.pla_n_checksum,
      }, corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'planillas' && seg[3] === 'detalles' && method === 'GET') {
      const det = db.planillaDetalles.filter((d) => d.pld_u_id_planilla === seg[2]);
      return ok(res, paginate(det, q), corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'planillas' && ACTION_STATE[seg[3]] && method === 'POST') {
      const pl = db.planillas.find((x) => x.pla_u_id === seg[2]);
      if (!pl) return error(res, 404, 'NOT_FOUND', 'Planilla no encontrada', corr);
      const anterior = pl.pla_n_id_estadoplanilla_code;
      pl.pla_n_id_estadoplanilla_code = ACTION_STATE[seg[3]];
      return accepted(res, {
        planillaId: pl.pla_u_id,
        estadoAnterior: anterior,
        estadoActual: pl.pla_n_id_estadoplanilla_code,
        message: 'Acción ejecutada en mock',
        traceId: 'trc-' + uuid().slice(0, 8),
      }, corr);
    }

    // Respuestas
    if (p === '/v1/respuestas' && method === 'GET') {
      let items = db.respuestas;
      if (q.planillaId) items = items.filter((r) => r.prb_u_id_planilla === q.planillaId);
      return ok(res, paginate(items, q), corr);
    }
    if (p === '/v1/respuestas/cargar-manual' && method === 'POST') {
      const nueva = {
        ...clone(db.respuestas[0]),
        prb_u_id: uuid(),
        prb_u_id_planilla: body.planillaId || db.respuestas[0].prb_u_id_planilla,
        prb_n_id_tiporespuesta_code: body.tipoRespuesta || 'RES',
        prb_v_nombre_archivo: body.nombreArchivo || 'RESPUESTA.xml',
      };
      db.respuestas.unshift(nueva);
      return created(res, nueva, corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'respuestas' && seg[3] === 'procesar' && method === 'POST') {
      const rb = db.respuestas.find((r) => r.prb_u_id === seg[2]);
      if (!rb) return error(res, 404, 'NOT_FOUND', 'Respuesta no encontrada', corr);
      const pl = db.planillas.find((x) => x.pla_u_id === rb.prb_u_id_planilla);
      if (pl) pl.pla_n_id_estadoplanilla_code = rb.prb_n_operaciones_error > 0 ? 'PROCESADA_PARCIAL' : 'PROCESADA';
      return accepted(res, {
        respuestaId: rb.prb_u_id,
        planillaId: rb.prb_u_id_planilla,
        estadoPlanilla: pl ? pl.pla_n_id_estadoplanilla_code : 'PROCESADA',
        operacionesActualizadas: rb.prb_n_total_operaciones,
        ok: rb.prb_n_operaciones_ok,
        error: rb.prb_n_operaciones_error,
        traceId: 'trc-' + uuid().slice(0, 8),
      }, corr);
    }

    // Documentos (bandeja global: planillas + respuestas, claro/cifrado)
    if (p === '/v1/documentos' && method === 'GET') {
      return ok(res, paginate(filtrarDocumentos(buildDocumentos(), q), q), corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'documentos' && seg[2] && seg[3] === 'download' && method === 'GET') {
      const doc = buildDocumentos().find((d) => d.id === seg[2]);
      if (!doc) return error(res, 404, 'NOT_FOUND', 'Documento no encontrado', corr);
      const variante = q.variante === 'cifrado' ? 'cifrado' : 'claro';
      const urlv = variante === 'cifrado' ? doc.urlCifrado : doc.urlClaro;
      if (!urlv) return error(res, 404, 'NOT_FOUND', `El documento no tiene variante ${variante}`, corr);
      return ok(res, {
        documentoId: doc.id,
        variante,
        url: urlv,
        nombre: doc.nombre,
        contentType: doc.formato === 'XML' ? 'application/xml' : 'text/plain',
      }, corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'documentos' && seg[2] && seg[3] === 'preview' && method === 'GET') {
      const doc = buildDocumentos().find((d) => d.id === seg[2]);
      if (!doc) return error(res, 404, 'NOT_FOUND', 'Documento no encontrado', corr);
      const xml = doc.formato === 'XML';
      let contenido;
      if (doc.tipoDocumento === 'PLANILLA') {
        contenido = xml
          ? '<?xml version="1.0" encoding="UTF-8"?>\n<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.09">\n  <CstmrCdtTrfInitn>\n    <GrpHdr><MsgId>' + doc.nombre + '</MsgId><NbOfTxs>' + (doc.totalOperaciones || 0) + '</NbOfTxs></GrpHdr>\n    <!-- ... ' + (doc.totalOperaciones || 0) + ' operaciones ... -->\n  </CstmrCdtTrfInitn>\n</Document>'
          : '1' + String(doc.totalOperaciones || 0).padStart(6, '0') + '20260630C' + (doc.productoCode || '') + '  ' + (doc.montoTotal || 0).toFixed(2) + '\n2A19...BENEFICIARIO 1...' + '\n3F...DETALLE...';
      } else {
        // Respuesta BCP: contenido según tipo (-RES / -VAL / -RES2 / -PAR)
        contenido = doc.tipoRespuesta === 'VAL'
          ? 'ARCHIVO: ' + doc.nombre + '\nRESULTADO: RECHAZADO\nError en la línea 2, posición 25: El valor del campo no es válido.\nOperaciones OK: ' + (doc.totalOperaciones || 0 - (doc.totalOperaciones || 0)) + ' - Con Error: ' + (doc.totalOperaciones || 0)
          : 'ARCHIVO: ' + doc.nombre + '\nRESULTADO: ' + (doc.tipoRespuesta || 'RES') + '\nTotal operaciones: ' + (doc.totalOperaciones || 0) + '\n(contenido normalizado de la respuesta BCP)';
      }
      return ok(res, {
        documentoId: doc.id,
        tipoDocumento: doc.tipoDocumento,
        nombre: doc.nombre,
        formato: doc.formato,
        contentType: xml ? 'application/xml' : 'text/plain',
        contenido,
      }, corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'documentos' && seg[2] && !seg[3] && method === 'GET') {
      const doc = buildDocumentos().find((d) => d.id === seg[2]);
      return doc ? ok(res, doc, corr) : error(res, 404, 'NOT_FOUND', 'Documento no encontrado', corr);
    }

    // Beneficiarios
    if (p === '/v1/beneficiarios' && method === 'GET') return ok(res, paginate(db.beneficiarios || [], q), corr);
    if (seg[0] === 'v1' && seg[1] === 'beneficiarios' && seg[2] && seg[3] === 'cuentas' && method === 'GET') {
      const cuentas = db.operaciones
        .filter((o) => (db.beneficiarios || []).some((b) => b.ben_u_id === seg[2] && b.ben_v_numerodocumento === o.beneficiario.ben_v_numerodocumento))
        .map((o) => o.cuenta);
      return ok(res, { items: cuentas }, corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'beneficiarios' && seg[2] && !seg[3] && method === 'GET') {
      const b = (db.beneficiarios || []).find((x) => x.ben_u_id === seg[2]);
      return b ? ok(res, b, corr) : error(res, 404, 'NOT_FOUND', 'Beneficiario no encontrado', corr);
    }

    // Estructuras de archivo
    if (p === '/v1/estructuras' && method === 'GET') {
      let items = db.estructuras || [];
      if (q.producto) items = items.filter((e) => e.producto === q.producto);
      if (q.formato) items = items.filter((e) => e.formato === q.formato);
      return ok(res, { items }, corr);
    }

    // Certificados
    if (p === '/v1/certificados' && method === 'GET') return ok(res, { items: db.certificados }, corr);
    if (p === '/v1/certificados' && method === 'POST') {
      const nuevo = { ...clone(db.certificados[0]), certificadoId: uuid(), alias: body.alias || 'nuevo-cert' };
      db.certificados.unshift(nuevo);
      return created(res, nuevo, corr);
    }
    if (seg[0] === 'v1' && seg[1] === 'certificados' && seg[3] === 'rotar' && method === 'PATCH') {
      const cert = db.certificados.find((c) => c.certificadoId === seg[2]);
      if (!cert) return error(res, 404, 'NOT_FOUND', 'Certificado no encontrado', corr);
      cert.alias = body.nuevoAlias || cert.alias;
      cert.diasParaVencer = 726;
      return ok(res, cert, corr);
    }

    // Identidad / RBAC
    if (p === '/v1/identity/users' && method === 'GET') return ok(res, { items: db.identity.users }, corr);
    if (p === '/v1/identity/roles' && method === 'GET') return ok(res, { items: db.identity.roles }, corr);
    if (p === '/v1/rbac/effective-permissions' && method === 'GET') {
      return ok(res, { roles: db.tenantContext.user.roles, permissions: db.tenantContext.user.permissions }, corr);
    }

    // Auditoría
    if (p === '/v1/audit/events' && method === 'GET') return ok(res, paginate(db.audit, q), corr);

    return error(res, 404, 'ROUTE_NOT_FOUND', `Ruta ${method} ${p} no implementada en el mock`, corr);
  } catch (e) {
    return error(res, 500, 'INTERNAL_ERROR', String(e && e.message ? e.message : e), corr);
  }
});

server.listen(PORT, () => {
  console.log(`\n  Mock H2H · Jofrantoba Consulting TI (tenant: Develtrex)`);
  console.log(`  Escuchando en  http://localhost:${PORT}`);
  console.log(`  Health         http://localhost:${PORT}/__mock/health\n`);
});
