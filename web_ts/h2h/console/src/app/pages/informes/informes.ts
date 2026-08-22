import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { JBadge, JButton, JCard, JCardContent, JCardHeader, JCardTitle, JDialog, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { InformesViewComponent } from './informes-view.component';
import type { ComparacionCalimaco } from '../calimaco/inter-conciliacion';
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
    // Con qué alcance consulta esta organización. Se pide una vez al entrar: es configuración, no
    // cambia durante una sesión, y tenerla antes evita que el asistente arranque con una estrategia
    // distinta de la que el backend usaría si nadie tocara nada.
    this.api.informeConsulta().subscribe({
      next: (config) => this.setConsultaConfigurada(config),
      error: () => {
        // Sin ella el asistente sigue: arranca por operación, que es el defecto del backend.
      },
    });
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
          + ' operación(es). Todavía no se ha informado nada.');
        this.recargar();
        // Y se sigue el flujo: armar la tanda no es el final, es el paso 1. Antes esto cerraba el
        // diálogo y dejaba al operador delante de una lista, teniendo que buscar la tanda que
        // acababa de crear para poder revisarla.
        this.abrirDetalle(res.id);
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

  /**
   * Compara la tanda entera sin informar nada (paso 2).
   *
   * <p>Una sola llamada a `/informes/comparar`, y es el backend quien decide si pregunta por cada
   * identificador o barre una ventana: así lo que se ve aquí es exactamente lo que verá la
   * ejecución con esa misma estrategia. Con `FECHAS` los pagos se leen de una vez y se comparan en
   * memoria; con `OPERACION` se consulta una por una.</p>
   *
   * <p>Comparar es de <b>solo lectura</b>: ni informa ni cambia estados.</p>
   */
  protected override compararTodas(): void {
    const id = this.detalle()?.cabecera?.id;
    if (!id || this.comparandoTodas()) return;
    this.comparandoTodas.set(true);
    this.errorComparar.set(null);
    const ventana = this.ventanaPedida();
    this.api
      .informeComparar(id, this.estrategia(), ventana?.desde, ventana?.hasta)
      .pipe(finalize(() => this.comparandoTodas.set(false)))
      .subscribe({
        next: (res) => {
          this.ultimaComparacion.set(res);
          for (const item of res.items) {
            this.setComparacion(item.idOperacion, item.comparacion as ComparacionCalimaco);
          }
        },
        error: (err) => this.errorComparar.set(
          this.mensaje(err, 'No se pudo comparar la tanda.')),
      });
  }

  protected override ejecutar(): void {
    const id = this.detalle()?.cabecera?.id;
    if (!id || this.ejecutando() || this.bloqueoEjecutar()) return;
    this.ejecutando.set(true);
    this.aviso.set(null);
    this.error.set(null);
    const ventana = this.ventanaPedida();
    this.api.informeEjecutar(id, this.estrategia(), ventana?.desde, ventana?.hasta).subscribe({
      next: (res) => {
        this.ejecutando.set(false);
        this.resultado.set(res);
        this.aviso.set(`Ejecutada: ${res.informadas} informada(s) y ${res.fallidas} fallida(s)`
          + ` de ${res.total}.`);
        // Se recarga el detalle Y el listado: los contadores de la cabecera y el estado de cada
        // fila cambiaron, y dejarlos como estaban invita a volver a pulsar. `abrirDetalle` recoloca
        // el paso, y con la tanda ya ejecutada eso es el cierre.
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
