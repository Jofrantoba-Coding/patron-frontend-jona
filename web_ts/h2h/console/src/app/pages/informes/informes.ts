import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JBadge, JButton, JCard, JCardContent, JCardHeader, JCardTitle, JDialog, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { InformesViewComponent } from './informes-view.component';
import type { CrearInforme } from './inter-informes';

/**
 * Programaciones de informe al sistema de origen.
 *
 * <p>Habla con {@code api/mantenimientos/h2h/v1/informes/*}. La regla de que solo se pueden programar
 * operaciones en {@code PAGO_CONFIRMADO} la impone el backend en tres sitios —los candidatos, la
 * revalidación al crear y un índice único en la base—; esta Page no la reimplementa, porque tener dos
 * definiciones de «programable» es cómo acaban divergiendo.</p>
 */
@Component({
  selector: 'app-informes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JCard, JCardHeader, JCardTitle, JCardContent, JBadge, JButton, JDialog],
  templateUrl: './informes-view.component.html',
})
export class InformesPage extends InformesViewComponent {
  private readonly api = inject(ApiService);

  constructor() {
    super();
    this.recargar();
  }

  protected override recargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.api.informeListar().subscribe({
      next: (lista) => this.setProgramaciones(lista),
      error: (err) => {
        this.cargando.set(false);
        this.error.set(this.mensaje(err, 'No se pudieron cargar las programaciones.'));
      },
    });
  }

  protected override buscarCandidatos(): void {
    this.buscando.set(true);
    this.error.set(null);
    this.api.informeCandidatos(this.grupo() || null, this.moneda() || null).subscribe({
      next: (datos) => this.setCandidatos(datos),
      error: (err) => {
        this.buscando.set(false);
        this.error.set(this.mensaje(err, 'No se pudieron buscar las operaciones.'));
      },
    });
  }

  protected override crear(valor: CrearInforme): void {
    this.creando.set(true);
    this.aviso.set(null);
    this.error.set(null);
    this.api.informeCrear(valor).subscribe({
      next: (res) => {
        this.creando.set(false);
        this.cerrarCrear();
        this.aviso.set(`Programación ${res.codigo} creada con ${valor.operaciones.length}`
          + ' operación(es). Todavía no se ha informado nada: ejecútela cuando corresponda.');
        this.recargar();
      },
      error: (err) => {
        this.creando.set(false);
        // El 422 enumera QUÉ operaciones no se pueden programar y por qué. Se muestra tal cual: es
        // lo que el operador necesita para corregir la selección.
        this.error.set(this.mensaje(err, 'No se pudo crear la programación.'));
      },
    });
  }

  protected override abrirDetalle(id: string): void {
    this.detalleCargando.set(id);
    this.error.set(null);
    this.api.informeDetalle(id).subscribe({
      next: (datos) => this.setDetalle(datos),
      error: (err) => {
        this.detalleCargando.set(null);
        this.error.set(this.mensaje(err, 'No se pudo cargar el detalle.'));
      },
    });
  }

  protected override ejecutar(): void {
    const id = this.detalle()?.cabecera?.id;
    if (!id || this.ejecutando() || this.bloqueoEjecutar()) return;
    this.ejecutando.set(true);
    this.aviso.set(null);
    this.error.set(null);
    this.api.informeEjecutar(id).subscribe({
      next: (res) => {
        this.ejecutando.set(false);
        this.aviso.set(`Ejecutada: ${res.informadas} informada(s) y ${res.fallidas} fallida(s)`
          + ` de ${res.total}.`);
        // Se recarga el detalle Y el listado: los contadores de la cabecera y el estado de cada
        // fila cambiaron, y dejarlos como estaban invita a volver a pulsar.
        this.abrirDetalle(id);
        this.recargar();
      },
      error: (err) => {
        this.ejecutando.set(false);
        this.error.set(this.mensaje(err, 'No se pudo ejecutar la programación.'));
      },
    });
  }

  protected override cancelar(): void {
    const id = this.detalle()?.cabecera?.id;
    if (!id || this.cancelando() || this.bloqueoCancelar()) return;
    this.cancelando.set(true);
    this.aviso.set(null);
    this.error.set(null);
    this.api.informeCancelar(id, this.motivo().trim() || 'Cancelada desde la consola.').subscribe({
      next: () => {
        this.cancelando.set(false);
        this.setDetalle(null);
        this.aviso.set('Programación cancelada. Sus operaciones vuelven a estar disponibles para'
          + ' programarlas otra vez.');
        this.recargar();
      },
      error: (err) => {
        this.cancelando.set(false);
        this.error.set(this.mensaje(err, 'No se pudo cancelar la programación.'));
      },
    });
  }

  /**
   * El mensaje del backend cuando lo hay.
   *
   * <p>Los 422 de este proceso enumeran qué operaciones fallan y por qué. Sustituirlos por un texto
   * genérico obligaría a abrir el log del servidor para algo que el operador corrige solo.</p>
   */
  private mensaje(err: unknown, porDefecto: string): string {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } } | null;
    return e?.error?.errors?.[0]?.message ?? e?.error?.message ?? porDefecto;
  }
}
