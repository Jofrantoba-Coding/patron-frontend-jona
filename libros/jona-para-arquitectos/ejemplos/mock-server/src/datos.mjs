// Datos de prueba acordados en el contrato de API (ver ../../contrato-api/login.openapi.yaml).
export const USUARIOS = [
  { id: 1, usuario: 'ana@ejemplo.com', clave: 'secreta123', nombre: 'Ana Torres', bloqueado: false },
  { id: 2, usuario: 'bloqueado@ejemplo.com', clave: 'secreta123', nombre: 'Usuario Bloqueado', bloqueado: true },
];

/** Escenarios que una petición puede pedir con la cabecera X-Mock-Scenario. */
export const ESCENARIOS = ['exitoso', 'credencialesInvalidas', 'usuarioBloqueado', 'errorServidor'];
