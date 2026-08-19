/**
 * Contratos de la integración con Calimaco, el sistema de Casino Atlantic City del que vienen las
 * operaciones y al que se le devuelve el resultado del pago.
 *
 * <p>Lo devuelve `POST api/mantenimientos/h2h/v1/organizacion/calimaco/leer`.</p>
 */

/** Los tres modos, de menos a más efecto fuera. */
export const MODOS_CALIMACO = ['OFFLINE', 'SIMULACION', 'REAL'] as const;
export type ModoCalimaco = (typeof MODOS_CALIMACO)[number];

/**
 * Qué hace cada modo. Se muestra junto al selector porque la diferencia entre ellos no es de grado:
 * `REAL` cambia el estado de pagos en el sistema de un tercero y no se puede deshacer.
 */
export const DESCRIPCION_MODO: Record<ModoCalimaco, string> = {
  OFFLINE: 'No sale ninguna petición. Las respuestas se fabrican y ninguna operación avanza.',
  SIMULACION:
    'Se llaman login, transiciones y consulta —así se detectan credenciales caducadas o permisos'
    + ' que faltan— pero NO se envía el cambio de estado.',
  REAL: 'Se envía el cambio de estado a Calimaco. Marca pagos reales y no se puede deshacer.',
};

/** Los cuatro endpoints, en el orden del flujo. */
export const ENDPOINTS_CALIMACO = ['LOGIN', 'TRANSICIONES', 'REPORTE', 'LOTE'] as const;
export type NombreEndpoint = (typeof ENDPOINTS_CALIMACO)[number];

/**
 * Qué es cada endpoint y para qué se llama.
 *
 * <p>Se muestra en su tarjeta: los nombres de las rutas de Calimaco —`getGrantedNextPayoutStatus`—
 * no dicen nada a quien configura la pantalla sin haber leído su documentación.</p>
 */
export const DESCRIPCION_ENDPOINT: Record<NombreEndpoint, string> = {
  LOGIN: 'Obtiene la sesión con la cuenta de servicio. Es el único que lleva credenciales.',
  TRANSICIONES:
    'Pregunta a qué estados puede pasar un pago. Sirve para fallar antes de mandar un cambio que'
    + ' Calimaco rechazaría a medio lote.',
  REPORTE: 'Consulta los pagos: para conciliar uno y para barrer los que están pendientes.',
  LOTE:
    'Manda el cambio de estado. Es la única llamada irreversible: marca pagos reales en el sistema'
    + ' del casino.',
};

/** Un par nombre/valor: una cabecera HTTP o un parámetro del secreto. */
export interface ParCalimaco {
  nombre: string;
  valor: string;
}

/**
 * Contenido del secreto de un endpoint, **sin la contraseña**.
 *
 * <p>Cada endpoint tiene el suyo, en la ruta de Vault que espeja su ruta HTTP. Están separados
 * porque no todo es común: el lote es `multipart/form-data` y los otros tres `urlencoded`, y su
 * `accept` también difiere. Con un solo secreto esas diferencias vivían en el código del
 * backend.</p>
 *
 * <p>El backend no devuelve la contraseña nunca: manda `tienePassword` en su lugar. Dejar el campo
 * vacío al guardar significa «no la cambies», no «bórrala».</p>
 */
export interface EndpointCalimaco {
  nombre: NombreEndpoint;
  secretRef?: string;
  metodo?: string;
  url?: string;
  contentType?: string;
  /** Si hay una contraseña guardada. El valor no sale de Vault. */
  tienePassword: boolean;
  cabeceras: ParCalimaco[];
  /** Lo demás que declare el secreto: usuario, company, reporte, límites, orden. */
  parametros: ParCalimaco[];
}

/**
 * Estado del candado de PLATAFORMA.
 *
 * <p>No es editable desde aquí —vive en la parametría y una organización no puede contradecirlo—
 * pero se muestra: sin verlo, quien enciende su organización y no ve efecto no tiene forma de
 * saber por qué.</p>
 */
export interface CandadoPlataforma {
  habilitado: boolean;
  forzarApagado: boolean;
  motivo?: string | null;
}

export interface ConfiguracionCalimaco {
  habilitado: boolean;
  modo: ModoCalimaco;
  estadoOrigen?: string | null;
  estadoDestino?: string | null;
  timeoutSegundos: number;
  plataforma: CandadoPlataforma;
  endpoints: EndpointCalimaco[];
}

/** Lo que se manda al guardar un endpoint. La contraseña solo viaja si se escribió una nueva. */
export interface GuardarEndpoint {
  nombre: NombreEndpoint;
  metodo?: string;
  url?: string;
  contentType?: string;
  password?: string;
  cabeceras: ParCalimaco[];
  parametros: ParCalimaco[];
}

/**
 * Lo que se manda al guardar los endpoints.
 *
 * <p><b>No lleva el interruptor.</b> Este guardado reescribe los cuatro secretos de Vault —es lo que
 * hace falta para configurar endpoints— y encender o apagar el aviso no tiene por qué acercarse a una
 * credencial. El interruptor tiene su propio endpoint: {@link GuardarInterruptorCalimaco}. Así cada
 * control tiene un solo escritor.</p>
 */
export interface GuardarCalimaco {
  estadoOrigen?: string;
  estadoDestino?: string;
  timeoutSegundos?: number;
  endpoints: GuardarEndpoint[];
}

/**
 * Encendido y modo de la organización: los dos campos de `tm_orcon`, nada más.
 *
 * <p>Va por `…/organizacion/calimaco/interruptor`, que no toca Vault. Antes esto solo se podía
 * cambiar guardando la página entera, y eso reescribía las cuatro credenciales.</p>
 */
export interface GuardarInterruptorCalimaco {
  habilitado: boolean;
  modo: ModoCalimaco;
}

/** Contrato de la página. La Vista edita en local; la Page persiste. */
export interface CalimacoPageContract {
  cargar(): void;
  guardar(valor: GuardarCalimaco): void;
  guardarInterruptor(valor: GuardarInterruptorCalimaco): void;
}
