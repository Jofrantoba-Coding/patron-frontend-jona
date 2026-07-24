import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  JBadge,
  JButton,
  JCard,
  JCardContent,
  JCardHeader,
  JCardTitle,
  JDialog,
  JSectionHeading,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
import { LlavesCifradoViewComponent } from './llaves-cifrado-view.component';

/**
 * Configuración de llaves de cifrado por banco/organización. Sube el material (pública
 * del banco; privada+pública+frase de la organización) que el backend escribe en Vault,
 * guardando solo el secretRef+metadata en tm_orcon.
 */
@Component({
  selector: 'app-llaves-cifrado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, JSectionHeading, JCard, JCardHeader, JCardTitle, JCardContent, JBadge, JButton, JDialog],
  templateUrl: './llaves-cifrado-view.component.html',
})
export class LlavesCifradoPage extends LlavesCifradoViewComponent {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);

  constructor() {
    super();
    this.recargar();
  }

  protected override recargar(): void {
    this.api.encriptacionListar().subscribe({
      next: (list) => this.setConfigs(list),
      error: () => this.setConfigs([]),
    });
  }

  protected override guardarBanco(): void {
    const b64 = this.bancoFileB64();
    if (!b64) return;
    this.guardandoBanco.set(true);
    this.api
      .guardarLlavePublicaBanco({ banco: this.banco(), llavePublicaBase64: b64, alertaDias: this.alertaBanco() })
      .subscribe({
        next: () => { this.guardandoBanco.set(false); this.limpiarFormBanco(); this.cerrarBanco(); this.ok('Llave pública del banco guardada.'); this.recargar(); },
        error: (err) => { this.guardandoBanco.set(false); this.fail(err); },
      });
  }

  protected override guardarOrg(): void {
    const priv = this.orgPrivB64();
    const pub = this.orgPubB64();
    if (!priv || !pub) return;
    this.guardandoOrg.set(true);
    this.api
      .guardarLlavesOrganizacion({
        banco: this.banco(),
        llavePrivadaBase64: priv,
        llavePublicaBase64: pub,
        frase: this.frase() || undefined,
        alertaDias: this.alertaOrg(),
      })
      .subscribe({
        next: () => { this.guardandoOrg.set(false); this.limpiarFormOrg(); this.cerrarOrg(); this.ok('Llaves de la organización guardadas.'); this.recargar(); },
        error: (err) => { this.guardandoOrg.set(false); this.fail(err); },
      });
  }

  /**
   * Abre el modal de generación mostrando (solo lectura) la identidad de la organización:
   * tenant desde la sesión y razón social/RUC desde su registro autoritativo (el backend
   * la re-deriva del token al generar; aquí solo se muestran).
   */
  protected override abrirGenerar(): void {
    const t = this.session.tenant();
    this.mensaje.set('');
    this.genTenant.set(t?.org_v_codigo || t?.org_v_nombrecomercial || '');
    this.genNombre.set(t?.org_v_razonsocial || '');
    this.genRuc.set('');
    this.genExpiraAnios.set(2);
    this.genAlertaDias.set(60);
    // Carga la identidad autoritativa (razón social + RUC) y LUEGO abre el modal, para que
    // los campos informativos ya estén poblados al renderizar. Postgres pliega los alias a
    // minúsculas, por eso se prueba camelCase y lowercase.
    this.api.organizacionIdentidad().subscribe({
      next: (org) => {
        const pick = (k: string): string => String(org[k] ?? org[k.toLowerCase()] ?? '');
        const razon = pick('razonSocial');
        const ruc = pick('numeroDocumento');
        if (razon) this.genNombre.set(razon);
        if (ruc) this.genRuc.set(ruc);
        this.formGenerarOpen.set(true);
      },
      error: () => this.formGenerarOpen.set(true), // el backend igual usa la identidad del token/BD
    });
  }

  protected override generarOrg(): void {
    this.generando.set(true);
    this.api
      .generarLlavesOrganizacion({
        banco: this.banco(),
        expiraAnios: this.genExpiraAnios(),
        alertaDias: this.genAlertaDias(),
      })
      .subscribe({
        next: (res) => {
          this.generando.set(false);
          this.cerrarGenerar();
          this.resultado.set(res); // abre el modal con la frase + pública/privada para descargar
          this.ok('Llaves generadas. Descarga la pública para enviarla al banco y luego actívala.');
          this.recargar();
        },
        error: (err) => { this.generando.set(false); this.fail(err); },
      });
  }

  protected override activarOrg(): void {
    this.activando.set(true);
    this.api.activarLlavesOrganizacion(this.banco()).subscribe({
      next: () => {
        this.activando.set(false);
        this.cerrarResultado();
        this.ok('Llave pendiente activada: la rotación fue aplicada.');
        this.recargar();
      },
      error: (err) => { this.activando.set(false); this.fail(err); },
    });
  }

  protected override descartarOrg(): void {
    this.descartando.set(true);
    this.api.descartarLlavesOrganizacion(this.banco()).subscribe({
      next: () => {
        this.descartando.set(false);
        this.cerrarResultado();
        this.ok('Llave pendiente descartada.');
        this.recargar();
      },
      error: (err) => { this.descartando.set(false); this.fail(err); },
    });
  }

  /** Vuelve a una firma histórica. Decide banco vs organización por el código del nodo. */
  protected override revertir(codigo: string, etiqueta: string): void {
    const esBanco = codigo.endsWith('#ENCRIPTACION#LLAVEPUBLICA');
    const req = esBanco
      ? this.api.revertirLlavePublicaBanco(this.banco(), etiqueta)
      : this.api.revertirLlavesOrganizacion(this.banco(), etiqueta);
    this.revirtiendo.set(true);
    req.subscribe({
      next: () => {
        this.revirtiendo.set(false);
        this.ok(`Se volvió a la firma ${etiqueta}.`);
        this.recargar();
      },
      error: (err) => { this.revirtiendo.set(false); this.fail(err); },
    });
  }
}
