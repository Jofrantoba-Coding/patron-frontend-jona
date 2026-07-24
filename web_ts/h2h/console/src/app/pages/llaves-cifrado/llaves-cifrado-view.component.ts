import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, type WritableSignal } from '@angular/core';
import {
  JBadge,
  JButton,
  JCard,
  JCardContent,
  JCardHeader,
  JCardTitle,
  JDialog,
  JSectionHeading,
  type JBadgeVariant,
} from 'uijona-4ngular';
import type { LlavePendienteGenerada, OrganizacionConfiguracion } from '../../core/models';
import type { EstadoLlave, PendienteLlave, RotacionLlave } from './inter-llaves-cifrado';

/** Estado de vencimiento derivado para pintar un badge. */
interface VencInfo {
  label: string;
  variant: JBadgeVariant;
}

/**
 * Vista de la configuración de llaves de cifrado (motor GPG). Los formularios de carga
 * viven en modales (JDialog); la tarjeta de cada llave muestra su metadata y el histórico
 * de rotaciones. La vigencia se analiza de la propia llave, no se pide a mano. Las
 * acciones de guardado/recarga son hooks no-op que la Page sobreescribe.
 */
@Component({
  selector: 'app-llaves-cifrado-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, JSectionHeading, JCard, JCardHeader, JCardTitle, JCardContent, JBadge, JButton, JDialog],
  templateUrl: './llaves-cifrado-view.component.html',
})
export class LlavesCifradoViewComponent {
  protected readonly banco = signal<string>('BCP');

  // Modales
  protected readonly formBancoOpen = signal<boolean>(false);
  protected readonly formOrgOpen = signal<boolean>(false);
  protected readonly formGenerarOpen = signal<boolean>(false);

  // Formulario de generación automática. La identidad (tenant/razón social/RUC) es de
  // solo lectura (la deriva el backend del token/BD); solo vigencia y alerta son editables.
  protected readonly genTenant = signal<string>('');
  protected readonly genNombre = signal<string>('');
  protected readonly genRuc = signal<string>('');
  protected readonly genExpiraAnios = signal<number>(2);
  protected readonly genAlertaDias = signal<number>(60);

  // Banco
  protected readonly bancoFileB64 = signal<string | null>(null);
  protected readonly alertaBanco = signal<number>(60);
  protected readonly guardandoBanco = signal(false);

  // Organización
  protected readonly orgPrivB64 = signal<string | null>(null);
  protected readonly orgPubB64 = signal<string | null>(null);
  protected readonly frase = signal<string>('');
  protected readonly alertaOrg = signal<number>(60);
  protected readonly guardandoOrg = signal(false);

  // Generación automática de llaves de la organización
  protected readonly generando = signal(false);
  protected readonly activando = signal(false);
  protected readonly descartando = signal(false);
  protected readonly revirtiendo = signal(false);
  /** Resultado de la última generación (frase + pública para descargar). Abre el modal. */
  protected readonly resultado = signal<LlavePendienteGenerada | null>(null);

  protected readonly mensaje = signal<string>('');
  protected readonly mensajeOk = signal<boolean>(true);

  // Contadores para forzar el re-render (limpieza) de los <input type="file">, cuyo
  // nombre de archivo mostrado no se borra con solo limpiar el signal del base64.
  protected readonly resetBanco = signal<number>(0);
  protected readonly resetOrg = signal<number>(0);

  protected readonly configs = signal<OrganizacionConfiguracion[]>([]);
  /** Solo las hojas SECRETO_REF (llave del banco / llaves de la org), no los nodos RAIZ/DOMINIO. */
  protected readonly estado = computed<EstadoLlave[]>(() =>
    this.configs()
      .filter((c) => (c.clase ?? '').toUpperCase() === 'SECRETO_REF')
      .map((c) => this.toEstado(c))
  );

  /** Llave pública del banco (nodo <banco>#ENCRIPTACION#LLAVEPUBLICA). */
  protected readonly estadoBanco = computed<EstadoLlave | null>(
    () => this.estado().find((e) => e.codigo.endsWith('#ENCRIPTACION#LLAVEPUBLICA')) ?? null
  );
  /** Llaves de la organización (nodo ORG#ENCRIPTACION#<banco>#LLAVES). */
  protected readonly estadoOrg = computed<EstadoLlave | null>(
    () => this.estado().find((e) => e.codigo.startsWith('ORG#ENCRIPTACION#') && e.codigo.endsWith('#LLAVES')) ?? null
  );

  // ── Setters desde el template ──────────────────────────────────────────
  protected setBanco(e: Event): void { this.banco.set((e.target as HTMLSelectElement).value); }
  protected setFrase(e: Event): void { this.frase.set((e.target as HTMLInputElement).value); }
  protected setAlertaBanco(e: Event): void { this.alertaBanco.set(Number((e.target as HTMLInputElement).value) || 60); }
  protected setAlertaOrg(e: Event): void { this.alertaOrg.set(Number((e.target as HTMLInputElement).value) || 60); }

  protected onBancoFile(e: Event): void { this.readFile(e, this.bancoFileB64); }
  protected onOrgPrivFile(e: Event): void { this.readFile(e, this.orgPrivB64); }
  protected onOrgPubFile(e: Event): void { this.readFile(e, this.orgPubB64); }

  // ── Modales ────────────────────────────────────────────────────────────
  protected abrirBanco(): void { this.mensaje.set(''); this.formBancoOpen.set(true); }
  protected cerrarBanco(): void { this.formBancoOpen.set(false); }
  protected abrirOrg(): void { this.mensaje.set(''); this.formOrgOpen.set(true); }
  protected cerrarOrg(): void { this.formOrgOpen.set(false); }
  protected abrirGenerar(): void { this.mensaje.set(''); this.formGenerarOpen.set(true); }
  protected cerrarGenerar(): void { this.formGenerarOpen.set(false); }
  protected cerrarResultado(): void { this.resultado.set(null); }

  // Setters del formulario de generación (solo lo editable: vigencia y alerta)
  protected setGenExpiraAnios(e: Event): void { this.genExpiraAnios.set(Number((e.target as HTMLInputElement).value) || 2); }
  protected setGenAlertaDias(e: Event): void { this.genAlertaDias.set(Number((e.target as HTMLInputElement).value) || 60); }

  // ── Descarga / copia del resultado de generación ───────────────────────
  /** Descarga la llave pública generada (armored) como .asc para enviar al banco. */
  protected descargarPublica(): void {
    this.descargar(this.resultado()?.llavePublicaArmored, `${this.banco().toLowerCase()}-org-public-key.asc`, 'application/pgp-keys');
  }

  /** Descarga la llave privada generada (armored) como .asc — guardar en repositorio seguro. */
  protected descargarPrivada(): void {
    this.descargar(this.resultado()?.llavePrivadaArmored, `${this.banco().toLowerCase()}-org-private-key.asc`, 'application/pgp-keys');
  }

  /** Descarga el info.txt completo (identidad + auditoría de la frase + parámetros de la llave). */
  protected descargarFrase(): void {
    this.descargar(this.construirInfoTxt(), `${this.banco().toLowerCase()}-org-info.txt`, 'text/plain');
  }

  /** Copia la frase al portapapeles (respaldo). */
  protected copiarFrase(): void {
    const frase = this.resultado()?.frasePlano;
    if (frase) { void navigator.clipboard?.writeText(frase); }
  }

  /** Fingerprint formateado en grupos de 4 (doble espacio), como el info.txt de la Guía 1. */
  private fmtFingerprint(fp: string | null | undefined): string {
    if (!fp) { return '—'; }
    return fp.match(/.{1,4}/g)?.join('  ') ?? fp;
  }

  /** Arma el contenido del info.txt (auditoría) para la llave recién generada. */
  private construirInfoTxt(): string {
    const r = this.resultado();
    if (!r) { return ''; }
    const frase = r.frasePlano ?? '';
    const desde = r.vigencia?.desde ?? '—';
    const hasta = r.vigencia?.hasta ?? '—';
    let dias = '—';
    let anios = '—';
    if (r.vigencia?.desde && r.vigencia?.hasta) {
      const d = Math.round((Date.parse(r.vigencia.hasta) - Date.parse(r.vigencia.desde)) / 86_400_000);
      if (!Number.isNaN(d)) { dias = String(d); anios = String(Math.round(d / 365)); }
    }
    const banco = this.banco().toLowerCase();
    return [
      `tenant: ${this.genTenant() || '—'}`,
      `razon_social: ${this.genNombre() || '—'}`,
      `ruc: ${this.genRuc() || '—'}`,
      `banco: ${this.banco()}`,
      `frase: ${frase}`,
      ``,
      `=== Origen de la frase (auditoria) ===`,
      `metodo: SHA-256 de 32 bytes criptograficamente aleatorios`,
      `sha256_seed: ${r.sha256Seed ?? '—'}`,
      `longitud_frase: ${frase.length} caracteres`,
      `entropia_fuente: 256 bits`,
      ``,
      `=== Parametros de la llave PGP ===`,
      `algoritmo: RSA 4096 bits`,
      `creacion: ${desde}`,
      `vencimiento: ${hasta}`,
      `vigencia: ${dias} dias (${anios} anos)`,
      `uso_subclave: E (encriptacion)`,
      ``,
      `fingerprint_principal: ${this.fmtFingerprint(r.fingerprint)}`,
      `fingerprint_subclave:  ${this.fmtFingerprint(r.fingerprintSubclave)}`,
      ``,
      `archivos:`,
      `  llave_publica:  ${banco}-org-public-key.asc   <- enviar al banco`,
      `  llave_privada:  ${banco}-org-private-key.asc  <- almacenar en repositorio seguro`,
      ``,
    ].join('\n');
  }

  private descargar(contenido: string | undefined, nombre: string, mime: string): void {
    if (!contenido) { return; }
    const blob = new Blob([contenido], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Limpieza de formularios (tras guardar con éxito) ───────────────────
  protected limpiarFormBanco(): void {
    this.bancoFileB64.set(null);
    this.resetBanco.update((n) => n + 1); // recrea el input file -> borra el nombre mostrado
  }

  protected limpiarFormOrg(): void {
    this.orgPrivB64.set(null);
    this.orgPubB64.set(null);
    this.frase.set('');
    this.resetOrg.update((n) => n + 1); // recrea los inputs file (privada + pública)
  }

  // ── Helpers de presentación ────────────────────────────────────────────
  /** Etiqueta+color de vencimiento para el badge (null si la llave no tiene expiración). */
  protected vencInfo(e: EstadoLlave | null): VencInfo | null {
    if (!e || !e.hasta) {
      return null;
    }
    const hoy = new Date().toISOString().slice(0, 10);
    if (e.hasta < hoy) {
      return { label: 'vencida', variant: 'destructive' };
    }
    if (e.finRotacion && e.finRotacion <= hoy) {
      return { label: 'rotar pronto', variant: 'outline' };
    }
    return { label: 'vence ' + e.hasta, variant: 'secondary' };
  }

  /** Fingerprint compacto para vistas de una línea (primeros/últimos grupos). */
  protected fpCorto(fp: string | null): string {
    if (!fp) {
      return '—';
    }
    return fp.length > 20 ? `${fp.slice(0, 8)}…${fp.slice(-8)}` : fp;
  }

  // ── Helpers de estado ──────────────────────────────────────────────────
  protected setConfigs(list: OrganizacionConfiguracion[]): void { this.configs.set(list); }

  protected ok(msg: string): void { this.mensaje.set(msg); this.mensajeOk.set(true); }
  protected fail(err: unknown): void {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } };
    // Prioriza el detalle de negocio (p. ej. "Es la misma llave…") sobre el mensaje genérico.
    const detalle = e?.error?.errors?.[0]?.message;
    this.mensaje.set(detalle ?? e?.error?.message ?? 'No se pudo guardar la configuración.');
    this.mensajeOk.set(false);
  }

  private readFile(e: Event, target: WritableSignal<string | null>): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) { target.set(null); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const comma = result.indexOf(',');
      target.set(comma >= 0 ? result.slice(comma + 1) : result); // quita el prefijo data:...;base64,
    };
    reader.readAsDataURL(file);
  }

  private toEstado(c: OrganizacionConfiguracion): EstadoLlave {
    const valor = (c.valor ?? {}) as {
      algoritmo?: string | null;
      formato?: string | null;
      secretRef?: string | null;
      fingerprint?: string | null;
      vigencia?: { origen?: string | null; desde?: string | null; hasta?: string | null; finRotacion?: string | null; alertaDias?: number | null };
      etiquetaActiva?: string | null;
      historial?: {
        etiqueta?: string | null;
        secuencia?: number | null;
        origen?: string | null;
        fingerprint?: string | null;
        timestamp?: string | null;
        usuario?: string | null;
        material?: unknown;
        vigencia?: { desde?: string | null; hasta?: string | null };
      }[];
      pendiente?: {
        fingerprint?: string | null;
        fingerprintSubclave?: string | null;
        timestamp?: string | null;
        usuario?: string | null;
        vigencia?: { desde?: string | null; hasta?: string | null };
      } | null;
    };
    const etiquetaActiva = valor.etiquetaActiva ?? null;
    const historial: RotacionLlave[] = (Array.isArray(valor.historial) ? [...valor.historial].reverse() : []).map((h) => {
      const activa = !!h.etiqueta && h.etiqueta === etiquetaActiva;
      return {
        etiqueta: h.etiqueta ?? null,
        secuencia: h.secuencia ?? null,
        origen: h.origen ?? null,
        fingerprint: h.fingerprint ?? null,
        desde: h.vigencia?.desde ?? null,
        hasta: h.vigencia?.hasta ?? null,
        timestamp: h.timestamp ?? null,
        usuario: h.usuario ?? null,
        activa,
        revertible: !!h.etiqueta && !!h.material && !activa, // solo entradas nuevas con material
      };
    });
    const p = valor.pendiente;
    const pendiente: PendienteLlave | null = p
      ? {
          fingerprint: p.fingerprint ?? null,
          fingerprintSubclave: p.fingerprintSubclave ?? null,
          desde: p.vigencia?.desde ?? null,
          hasta: p.vigencia?.hasta ?? null,
          generadaEn: p.timestamp ?? null,
          usuario: p.usuario ?? null,
        }
      : null;
    return {
      codigo: c.codigo,
      descripcion: c.descripcion,
      algoritmo: valor.algoritmo ?? null,
      formato: valor.formato ?? null,
      secretRef: valor.secretRef ?? null,
      fingerprint: valor.fingerprint ?? null,
      origen: valor.vigencia?.origen ?? null,
      desde: valor.vigencia?.desde ?? null,
      hasta: valor.vigencia?.hasta ?? null,
      finRotacion: valor.vigencia?.finRotacion ?? null,
      alertaDias: valor.vigencia?.alertaDias ?? null,
      etiquetaActiva,
      historial,
      pendiente,
    };
  }

  // ── Hooks sobrescritos por la Page (que inyecta ApiService) ────────────
  protected recargar(): void { return; }
  protected guardarBanco(): void { return; }
  protected guardarOrg(): void { return; }
  protected generarOrg(): void { return; }
  protected activarOrg(): void { return; }
  protected descartarOrg(): void { return; }
  protected revertir(_codigo: string, _etiqueta: string): void { return; }
}
