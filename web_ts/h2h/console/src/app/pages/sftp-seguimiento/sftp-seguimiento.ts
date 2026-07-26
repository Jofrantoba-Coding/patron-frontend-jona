import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { JBadge, JProgress, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { EntradaSftp, ExploracionSftp } from './inter-sftp-seguimiento';
import { SftpSeguimientoViewComponent } from './sftp-seguimiento-view.component';

/**
 * Seguimiento SFTP: panorama de los buzones del banco (IN/OUT de cada familia) con su contenido,
 * más navegación dentro de un buzón y buscador global sobre lo leído.
 */
@Component({
  selector: 'app-sftp-seguimiento',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JBadge, JProgress],
  templateUrl: './sftp-seguimiento-view.component.html',
})
export class SftpSeguimientoPage extends SftpSeguimientoViewComponent implements OnInit {
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.cargarPanorama();
  }

  /** Panorama: los ocho buzones con su contenido en UN ciclo SFTP. */
  protected override cargarPanorama(): void {
    if (this.cargando()) return;
    this.cargando.set(true);
    this.api
      .sftpExplorar(undefined, this.banco())
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (data) => this.setExploracion(data as unknown as ExploracionSftp),
        error: (err) => this.setError(this.mensajeError(err, 'No se pudieron leer los buzones del banco.')),
      });
  }

  /** Entra a una ruta: otro ciclo SFTP, ya en modo navegación. */
  protected override abrirRuta(ruta: string): void {
    if (this.cargando()) return;
    this.cargando.set(true);
    this.api
      .sftpExplorar(ruta, this.banco())
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (data) => this.setExploracion(data as unknown as ExploracionSftp),
        error: (err) => this.setError(this.mensajeError(err, `No se pudo leer ${ruta}.`)),
      });
  }

  /** Cambia de banco: el panorama del banco nuevo (otro ciclo SFTP, otra credencial). */
  protected override cambiarBanco(banco: string): void {
    if (this.cargando() || banco === this.banco()) return;
    this.banco.set(banco);
    this.buzones.set([]);
    this.cargarPanorama();
  }

  protected override refrescar(): void {
    const actual = this.ruta();
    if (this.modo() === 'DIRECTORIO' && actual) {
      this.abrirRuta(actual);
      return;
    }
    this.cargarPanorama();
  }

  /**
   * Los archivos del banco viajan cifrados con PGP, así que descargarlos desde aquí requiere
   * decidir si se entrega el sobre crudo o el contenido descifrado. Mientras eso no esté definido,
   * la pantalla lo dice en vez de fingir una acción.
   */
  protected override abrirArchivo(entrada: EntradaSftp, _ruta: string): void {
    this.setError(
      `«${entrada.nombre}»: la descarga desde el explorador aún no está habilitada.` +
        ' Las respuestas del banco se abren desde el detalle de su planilla (pestaña Respuestas).'
    );
  }

  /** Mensaje del envelope de error (422/409 traen `message` + `errors[]`). */
  private mensajeError(err: unknown, fallback: string): string {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } };
    return e?.error?.errors?.[0]?.message ?? e?.error?.message ?? fallback;
  }
}
