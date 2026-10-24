/** A row of the price list (`GET /v1/socio-acciones`); `estado` is `A` active or `D` deactivated. */
export interface AccionPrecioRow {
  id_accion_precio: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'A' | 'D';
  precio: number;
}

/** A row of the socio list, with the socio document number and name joined by the server. */
export interface AccionSocioRow {
  id_accion_socio: string;
  id_socio: string;
  numero_doc: string;
  socio: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'A' | 'D';
  precio: number;
  cantidad: number;
}

/** One change of the price list: `I` activates a new price, `A` deactivates a stored one (R-MOCK-26). */
export type PrecioOp = { op: 'I'; precio: number; fecha_inicio: string } | { op: 'A'; id: string; estado: 'D'; fecha_fin: string };

/** One change of the socio list: `I` activates a socio (the server gives it the current price). */
export interface SocioOp {
  op: 'I';
  id_socio: string;
  cantidad: number;
  fecha_inicio: string;
}

export interface SocioAccionesBody {
  precios: PrecioOp[];
  socios: SocioOp[];
}

export interface SocioAcciones {
  precios: AccionPrecioRow[];
  socios: AccionSocioRow[];
}

/**
 * The Socio acciones screen over `/v1/socio-acciones` (R-MOCK-26): a resource with no parent record, two global lists saved together. Failures reject with
 * `ApiError`; the tenant comes from the session.
 */
export interface InterSocioAccionesService {
  /** Both lists, active and deactivated rows. */
  load(): Promise<SocioAcciones>;
  /** Saves the changed ops of both lists atomically; answers the server message and both lists as stored. */
  save(body: SocioAccionesBody): Promise<SocioAcciones & { message: string }>;
}
