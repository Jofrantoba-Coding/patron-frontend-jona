import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  Cliente,
  DashboardSummary,
  GestorCobranza,
  LoginResponse,
  Paginated,
  Prestamo,
  RecaudadoResponse,
} from './devol-api.types';

const MOCK_BASE_URL = 'http://localhost:4020';

@Injectable({ providedIn: 'root' })
export class DevolApiService {
  private readonly http = inject(HttpClient);

  login(correo: string, clave: string) {
    return this.http.post<LoginResponse>(`${MOCK_BASE_URL}/mock/auth/login`, { correo, clave });
  }

  summary(usuarioId: string) {
    return this.http.get<DashboardSummary>(`${MOCK_BASE_URL}/v1/dashboard/summary`, {
      params: { usuarioId },
    });
  }

  clientes(usuarioId: string) {
    return this.http.get<Paginated<Cliente>>(`${MOCK_BASE_URL}/v1/clientes`, {
      params: { usuarioId, pageSize: 50 },
    });
  }

  prestamos(usuarioId: string, estado: 'P' | 'A' = 'P') {
    return this.http.get<Paginated<Prestamo>>(`${MOCK_BASE_URL}/v1/prestamos`, {
      params: { usuarioId, estado, pageSize: 50 },
    });
  }

  cobradores(ownerId: string) {
    return this.http.get<Paginated<GestorCobranza>>(`${MOCK_BASE_URL}/v1/cobradores`, {
      params: { ownerId, pageSize: 50 },
    });
  }

  recaudado(usuarioId: string, fecha: string) {
    return this.http.get<RecaudadoResponse>(`${MOCK_BASE_URL}/v1/amortizaciones/recaudado`, {
      params: { usuarioId, fecha },
    });
  }

  registrarAmortizacion(idPrestamo: string, payload: { monto: number; fecha: string; idGestorCobranza?: string }) {
    return this.http.post(`${MOCK_BASE_URL}/v1/prestamos/${idPrestamo}/amortizaciones`, payload);
  }

  resetMock() {
    return this.http.post<{ status: string; message: string }>(`${MOCK_BASE_URL}/__mock/reset`, {});
  }
}
