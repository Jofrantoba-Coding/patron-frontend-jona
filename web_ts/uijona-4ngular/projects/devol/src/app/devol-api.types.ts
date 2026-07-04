export type DevolRole = 'OWNER' | 'ADMIN' | 'GESTORCOBRANZA';
export type PrestamoEstado = 'P' | 'A';

export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface Usuario {
  idUsuario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  version: number;
  isRolOwner: boolean;
  isRolAdmin: boolean;
  isRolGestorCobranza: boolean;
  roles: DevolRole[];
}

export interface SessionUser extends Usuario {
  idSesion: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: SessionUser;
}

export interface Cliente {
  idCliente: string;
  dni: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  direccion?: string;
  idUsuario: string;
  numPrestamo: number;
  clienteAsignado: 0 | 1;
  version: number;
  idGestorCliente?: string | null;
  idGestorCobranza?: string | null;
  idUsuarioOwner?: string | null;
  idUsuarioCobrador?: string | null;
}

export interface Prestamo {
  idPrestamo: string;
  fecha: string;
  monto: number;
  tasa: number;
  aDevolver: number;
  devuelto: number;
  estado: PrestamoEstado;
  dni: string;
  idCliente: string;
  idUsuario: string;
  nombre: string;
  apellido: string;
  tipoPrestamo?: string;
  glosa?: string;
  version: number;
  beanCliente?: Cliente;
}

export interface Amortizacion {
  idAmortizacion: string;
  monto: number;
  fecha: string;
  idPrestamo: string;
  idUsuario: string;
  totalAmortizado?: number;
  rolCobrador?: DevolRole;
  idUsuarioCobrador?: string | null;
  nombresCobrador?: string;
  apellidosCobrador?: string;
  version: number;
  beanPrestamo?: Prestamo;
}

export interface GestorCobranza {
  idGestorCobranza: string;
  idUsuarioOwner: string;
  idUsuarioCobrador: string;
  fechaInicio: string;
  fechaFin?: string | null;
  estado: 'A' | 'D';
  version: number;
  beanUsuarioCobrador?: Usuario;
}

export interface RecaudadoResponse {
  fecha: string;
  idUsuario: string;
  totalAmortizado: number;
  items: Amortizacion[];
}

export interface DashboardSummary {
  usuarioId: string;
  clientes: {
    total: number;
    asignados: number;
    sinCobrador: number;
  };
  prestamos: {
    vigentes: number;
    historial: number;
    capitalPrestado: number;
    totalADevolver: number;
    totalDevuelto: number;
    saldoPendiente: number;
  };
  cobranza: {
    cobradoresActivos: number;
    recaudadoHoy: number;
  };
}
