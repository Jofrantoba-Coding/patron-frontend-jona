import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JBadge, JButton, JCard, JCardContent, JCardHeader, JCardTitle, JDialog, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { SftpConfigViewComponent } from './sftp-config-view.component';

/**
 * Configuración SFTP por banco/organización. Envía los datos de conexión y los directorios
 * (buzones IN/OUT) que el backend escribe en Vault, guardando solo el secretRef+metadata en
 * tm_orcon (árbol ORG#SFTP#<banco>#*).
 */
@Component({
  selector: 'app-sftp-config',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JCard, JCardHeader, JCardTitle, JCardContent, JBadge, JButton, JDialog],
  templateUrl: './sftp-config-view.component.html',
})
export class SftpConfigPage extends SftpConfigViewComponent {
  private readonly api = inject(ApiService);

  constructor() {
    super();
    this.recargar();
  }

  protected override recargar(): void {
    this.api.sftpListar().subscribe({
      next: (list) => this.setConfigs(list),
      error: () => this.setConfigs([]),
    });
  }

  protected override guardarConexion(): void {
    if (!this.connHost() || !this.connPuerto() || !this.connUsuario() || !this.connPassword()) return;
    this.guardandoConexion.set(true);
    this.api
      .guardarSftpConexion({
        banco: this.banco(),
        host: this.connHost().trim(),
        puerto: this.connPuerto().trim(),
        usuario: this.connUsuario().trim(),
        password: this.connPassword(),
        reintentos: this.connReintentos(),
        timeoutSegundos: this.connTimeout(),
      })
      .subscribe({
        next: () => { this.guardandoConexion.set(false); this.cerrarConexion(); this.ok('Datos de conexión SFTP guardados.'); this.recargar(); },
        error: (err) => { this.guardandoConexion.set(false); this.fail(err); },
      });
  }

  protected override guardarDirectorios(): void {
    if (!this.dirIn() || !this.dirOut()) return;
    this.guardandoDir.set(true);
    this.api
      .guardarSftpDirectorios({
        banco: this.banco(),
        familia: this.dirFamilia(),
        directorioIn: this.dirIn().trim(),
        directorioOut: this.dirOut().trim(),
      })
      .subscribe({
        next: () => { this.guardandoDir.set(false); this.cerrarDir(); this.ok('Directorios SFTP guardados.'); this.recargar(); },
        error: (err) => { this.guardandoDir.set(false); this.fail(err); },
      });
  }
}
