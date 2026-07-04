import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { JBadge, JButton, JDataTable, JMetricCard, type JDataTableColumn, type JDataTableRow } from 'uijona';
import { DevolApiService } from './devol-api.service';
import type { Cliente, DashboardSummary, GestorCobranza, Prestamo, RecaudadoResponse, SessionUser } from './devol-api.types';

@Component({
  selector: 'app-root',
  imports: [CommonModule, JButton, JBadge, JDataTable, JMetricCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly api = inject(DevolApiService);
  private readonly money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

  readonly correo = signal('owner@devol.test');
  readonly clave = signal('demo123');
  readonly fechaRecaudado = signal('2026-07-04');
  readonly amortizacionMonto = signal('50');
  readonly selectedPrestamoId = signal<string | null>(null);

  readonly user = signal<SessionUser | null>(null);
  readonly summary = signal<DashboardSummary | null>(null);
  readonly clientes = signal<Cliente[]>([]);
  readonly prestamos = signal<Prestamo[]>([]);
  readonly cobradores = signal<GestorCobranza[]>([]);
  readonly recaudado = signal<RecaudadoResponse | null>(null);
  readonly loading = signal(false);
  readonly busyAction = signal(false);
  readonly error = signal('');
  readonly notice = signal('');

  readonly clienteColumns: JDataTableColumn[] = [
    { key: 'dni', header: 'DNI', sortable: true },
    { key: 'cliente', header: 'Cliente', sortable: true },
    { key: 'telefono', header: 'Telefono' },
    { key: 'prestamos', header: 'Prestamos', align: 'right', sortable: true },
    { key: 'asignacion', header: 'Asignacion' },
  ];

  readonly prestamoColumns: JDataTableColumn[] = [
    { key: 'fecha', header: 'Fecha', sortable: true },
    { key: 'cliente', header: 'Cliente', sortable: true },
    { key: 'tipo', header: 'Tipo' },
    { key: 'monto', header: 'Monto', align: 'right', sortable: true },
    { key: 'devuelto', header: 'Devuelto', align: 'right', sortable: true },
    { key: 'saldo', header: 'Saldo', align: 'right', sortable: true },
  ];

  readonly recaudadoColumns: JDataTableColumn[] = [
    { key: 'fecha', header: 'Fecha', sortable: true },
    { key: 'cliente', header: 'Cliente', sortable: true },
    { key: 'monto', header: 'Monto', align: 'right', sortable: true },
    { key: 'cobrador', header: 'Cobrador' },
  ];

  readonly clienteRows = computed<JDataTableRow[]>(() =>
    this.clientes().map((cliente) => ({
      id: cliente.idCliente,
      dni: cliente.dni,
      cliente: `${cliente.nombre} ${cliente.apellido}`,
      telefono: cliente.telefono || '-',
      prestamos: cliente.numPrestamo,
      asignacion: cliente.clienteAsignado ? 'Con cobrador' : 'Libre',
    })),
  );

  readonly prestamoRows = computed<JDataTableRow[]>(() =>
    this.prestamos().map((prestamo) => ({
      id: prestamo.idPrestamo,
      fecha: prestamo.fecha,
      cliente: `${prestamo.nombre} ${prestamo.apellido}`,
      tipo: prestamo.tipoPrestamo || '-',
      monto: this.formatMoney(prestamo.monto),
      devuelto: this.formatMoney(prestamo.devuelto),
      saldo: this.formatMoney(prestamo.aDevolver - prestamo.devuelto),
    })),
  );

  readonly recaudadoRows = computed<JDataTableRow[]>(() =>
    (this.recaudado()?.items ?? []).map((item) => ({
      id: item.idAmortizacion,
      fecha: item.fecha,
      cliente: item.beanPrestamo ? `${item.beanPrestamo.nombre} ${item.beanPrestamo.apellido}` : item.idPrestamo,
      monto: this.formatMoney(item.monto),
      cobrador: `${item.nombresCobrador ?? ''} ${item.apellidosCobrador ?? ''}`.trim() || item.rolCobrador || '-',
    })),
  );

  readonly selectedPrestamo = computed<Prestamo | null>(() => {
    const prestamos = this.prestamos();
    return prestamos.find((item) => item.idPrestamo === this.selectedPrestamoId()) ?? prestamos[0] ?? null;
  });

  readonly selectedPrestamoSaldo = computed(() => {
    const prestamo = this.selectedPrestamo();
    return prestamo ? Math.max(prestamo.aDevolver - prestamo.devuelto, 0) : 0;
  });

  readonly rowKey = (row: JDataTableRow, index: number) => String(row['id'] ?? index);

  ngOnInit(): void {
    void this.login();
  }

  async login(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    this.notice.set('');
    try {
      const response = await firstValueFrom(this.api.login(this.correo(), this.clave()));
      this.user.set(response.user);
      await this.loadWorkspace();
      this.notice.set('Sesion demo conectada al mockserver');
    } catch (err) {
      this.error.set(this.errorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }

  async loadWorkspace(): Promise<void> {
    const user = this.user();
    if (!user) return;

    const [summary, clientes, prestamos, recaudado, cobradores] = await Promise.all([
      firstValueFrom(this.api.summary(user.idUsuario)),
      firstValueFrom(this.api.clientes(user.idUsuario)),
      firstValueFrom(this.api.prestamos(user.idUsuario, 'P')),
      firstValueFrom(this.api.recaudado(user.idUsuario, this.fechaRecaudado())),
      firstValueFrom(this.api.cobradores(user.idUsuario)),
    ]);

    this.summary.set(summary);
    this.clientes.set(clientes.items);
    this.prestamos.set(prestamos.items);
    this.recaudado.set(recaudado);
    this.cobradores.set(cobradores.items);
    this.selectedPrestamoId.set(prestamos.items[0]?.idPrestamo ?? null);
  }

  selectPrestamo(row: JDataTableRow): void {
    this.selectedPrestamoId.set(String(row['id']));
  }

  async registrarAmortizacion(): Promise<void> {
    const prestamo = this.selectedPrestamo();
    const monto = Number(this.amortizacionMonto());
    if (!prestamo) {
      this.error.set('Seleccione un prestamo vigente');
      return;
    }
    if (!Number.isFinite(monto) || monto <= 0) {
      this.error.set('Monto de amortizacion invalido');
      return;
    }

    this.busyAction.set(true);
    this.error.set('');
    this.notice.set('');
    try {
      await firstValueFrom(
        this.api.registrarAmortizacion(prestamo.idPrestamo, {
          monto,
          fecha: this.fechaRecaudado(),
          idGestorCobranza: this.cobradores()[0]?.idGestorCobranza,
        }),
      );
      await this.loadWorkspace();
      this.notice.set('Amortizacion registrada en el mockserver');
    } catch (err) {
      this.error.set(this.errorMessage(err));
    } finally {
      this.busyAction.set(false);
    }
  }

  async resetMock(): Promise<void> {
    this.busyAction.set(true);
    this.error.set('');
    this.notice.set('');
    try {
      await firstValueFrom(this.api.resetMock());
      await this.loadWorkspace();
      this.notice.set('Datos del mock restaurados');
    } catch (err) {
      this.error.set(this.errorMessage(err));
    } finally {
      this.busyAction.set(false);
    }
  }

  setCorreo(event: Event): void {
    this.correo.set((event.target as HTMLInputElement).value);
  }

  setClave(event: Event): void {
    this.clave.set((event.target as HTMLInputElement).value);
  }

  setFechaRecaudado(event: Event): void {
    this.fechaRecaudado.set((event.target as HTMLInputElement).value);
  }

  setAmortizacionMonto(event: Event): void {
    this.amortizacionMonto.set((event.target as HTMLInputElement).value);
  }

  formatMoney(value: number): string {
    return this.money.format(value || 0);
  }

  roleText(user: SessionUser | null): string {
    return user?.roles.join(' / ') || '-';
  }

  private errorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as { message?: string } | null;
      return body?.message || err.message;
    }
    return err instanceof Error ? err.message : String(err);
  }
}
