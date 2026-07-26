import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JBadge, JButton, JCard, JCardContent, JCardHeader, JCardTitle, JDialog, JSectionHeading } from 'uijona-4ngular';
import type { OrganizacionConfiguracion } from '../../core/models';
import type { EstadoConexionSftp, EstadoDirectorioSftp, FamiliaSftp } from './inter-sftp-config';

/**
 * Vista de la configuración SFTP por banco (conexión + directorios de buzón). Espeja la
 * página de llaves de cifrado: los valores son sensibles y viven en Vault, aquí solo se
 * muestra el estado (qué está configurado) + metadata no sensible, y los formularios de
 * carga viven en modales (JDialog). Las acciones de guardado/recarga son hooks no-op que
 * la Page sobreescribe.
 */
@Component({
  selector: 'app-sftp-config-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JCard, JCardHeader, JCardTitle, JCardContent, JBadge, JButton, JDialog],
  templateUrl: './sftp-config-view.component.html',
})
export class SftpConfigViewComponent {
  protected readonly banco = signal<string>('BCP');

  /** Familias de buzón (una tarjeta/nodo por familia). Productos mostrados a título informativo. */
  protected readonly familias: readonly FamiliaSftp[] = [
    { key: 'TRANSFERENCIAS', label: 'Transferencias', productos: 'T' },
    { key: 'PAGOS_MASIVOS', label: 'Pagos masivos', productos: 'H · C · P · CG' },
    { key: 'FACTORING', label: 'Factoring', productos: 'FA' },
    { key: 'RECAUDACION', label: 'Recaudación', productos: 'R' },
  ];

  // Modal conexión
  protected readonly formConexionOpen = signal<boolean>(false);
  protected readonly connHost = signal<string>('');
  protected readonly connPuerto = signal<string>('');
  protected readonly connUsuario = signal<string>('');
  protected readonly connPassword = signal<string>('');
  protected readonly connReintentos = signal<number>(3);
  protected readonly connTimeout = signal<number>(900);
  protected readonly guardandoConexion = signal(false);

  // Modal directorios
  protected readonly formDirOpen = signal<boolean>(false);
  protected readonly dirFamilia = signal<string>('');
  protected readonly dirFamiliaLabel = signal<string>('');
  protected readonly dirIn = signal<string>('');
  protected readonly dirOut = signal<string>('');
  protected readonly guardandoDir = signal(false);

  protected readonly mensaje = signal<string>('');
  protected readonly mensajeOk = signal<boolean>(true);

  protected readonly configs = signal<OrganizacionConfiguracion[]>([]);

  /** Prefijo de los nodos SFTP del banco seleccionado (ORG#SFTP#<banco>#…). */
  private readonly prefijo = computed<string>(() => `ORG#SFTP#${this.banco().toUpperCase()}#`);

  /** Estado del nodo de conexión (ORG#SFTP#<banco>#CONEXION). */
  protected readonly conexion = computed<EstadoConexionSftp | null>(() => {
    const codigo = `${this.prefijo()}CONEXION`;
    const c = this.configs().find((x) => (x.codigo ?? '').toUpperCase() === codigo);
    if (!c) return null;
    const v = (c.valor ?? {}) as {
      auth?: string | null;
      ambiente?: string | null;
      reintentos?: number | null;
      timeoutSegundos?: number | null;
      host?: { secretRef?: string | null };
      puerto?: { secretRef?: string | null };
      usuario?: { secretRef?: string | null };
      password?: { secretRef?: string | null };
    };
    const hostRef = v.host?.secretRef ?? null;
    const puertoRef = v.puerto?.secretRef ?? null;
    const usuarioRef = v.usuario?.secretRef ?? null;
    const passwordRef = v.password?.secretRef ?? null;
    return {
      codigo: c.codigo,
      descripcion: c.descripcion,
      auth: v.auth ?? null,
      ambiente: v.ambiente ?? null,
      reintentos: v.reintentos ?? null,
      timeoutSegundos: v.timeoutSegundos ?? null,
      hostRef,
      puertoRef,
      usuarioRef,
      passwordRef,
      configurado: !!(hostRef && puertoRef && usuarioRef && passwordRef),
    };
  });

  /** Estado de cada familia de buzón (ORG#SFTP#<banco>#<familia>), en el orden de `familias`. */
  protected readonly directorios = computed<EstadoDirectorioSftp[]>(() => {
    const list = this.configs();
    return this.familias.map((f) => {
      const codigo = `${this.prefijo()}${f.key}`;
      const c = list.find((x) => (x.codigo ?? '').toUpperCase() === codigo);
      const v = (c?.valor ?? {}) as { in?: { secretRef?: string | null }; out?: { secretRef?: string | null } };
      const inRef = v.in?.secretRef ?? null;
      const outRef = v.out?.secretRef ?? null;
      return { codigo, familia: f.key, inRef, outRef, configurado: !!(inRef && outRef) };
    });
  });

  // ── Setters desde el template ──────────────────────────────────────────
  protected setBanco(e: Event): void { this.banco.set((e.target as HTMLSelectElement).value); }
  protected setConnHost(e: Event): void { this.connHost.set((e.target as HTMLInputElement).value); }
  protected setConnPuerto(e: Event): void { this.connPuerto.set((e.target as HTMLInputElement).value); }
  protected setConnUsuario(e: Event): void { this.connUsuario.set((e.target as HTMLInputElement).value); }
  protected setConnPassword(e: Event): void { this.connPassword.set((e.target as HTMLInputElement).value); }
  protected setConnReintentos(e: Event): void { this.connReintentos.set(Number((e.target as HTMLInputElement).value) || 3); }
  protected setConnTimeout(e: Event): void { this.connTimeout.set(Number((e.target as HTMLInputElement).value) || 900); }
  protected setDirIn(e: Event): void { this.dirIn.set((e.target as HTMLInputElement).value); }
  protected setDirOut(e: Event): void { this.dirOut.set((e.target as HTMLInputElement).value); }

  // ── Modales ────────────────────────────────────────────────────────────
  protected abrirConexion(): void {
    this.mensaje.set('');
    const c = this.conexion();
    // No se re-muestran secretos: el host/usuario se re-ingresan al reconfigurar. Solo la
    // metadata no sensible (reintentos/timeout) se pre-carga del nodo actual si existe.
    this.connHost.set('');
    this.connPuerto.set('');
    this.connUsuario.set('');
    this.connPassword.set('');
    this.connReintentos.set(c?.reintentos ?? 3);
    this.connTimeout.set(c?.timeoutSegundos ?? 900);
    this.formConexionOpen.set(true);
  }
  protected cerrarConexion(): void { this.formConexionOpen.set(false); }

  protected abrirDir(familia: string): void {
    this.mensaje.set('');
    const f = this.familias.find((x) => x.key === familia);
    this.dirFamilia.set(familia);
    this.dirFamiliaLabel.set(f?.label ?? familia);
    this.dirIn.set('');
    this.dirOut.set('');
    this.formDirOpen.set(true);
  }
  protected cerrarDir(): void { this.formDirOpen.set(false); }

  // ── Helpers de presentación ────────────────────────────────────────────
  /** Etiqueta corta de un secretRef para pistas de referencia (…/sftp/host). */
  protected refCorto(ref: string | null): string {
    if (!ref) return '—';
    const parts = ref.replace('vault://', '').split('/');
    return parts.length > 3 ? '…/' + parts.slice(-3).join('/') : ref;
  }

  // ── Helpers de estado ──────────────────────────────────────────────────
  protected setConfigs(list: OrganizacionConfiguracion[]): void { this.configs.set(list); }

  protected ok(msg: string): void { this.mensaje.set(msg); this.mensajeOk.set(true); }
  protected fail(err: unknown): void {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } };
    const detalle = e?.error?.errors?.[0]?.message;
    this.mensaje.set(detalle ?? e?.error?.message ?? 'No se pudo guardar la configuración.');
    this.mensajeOk.set(false);
  }

  // ── Hooks sobrescritos por la Page (que inyecta ApiService) ────────────
  protected recargar(): void { return; }
  protected guardarConexion(): void { return; }
  protected guardarDirectorios(): void { return; }
}
