// shell.ts — JONA Page/Impl del layout principal.
// Conecta la View con el router y la sesión; no contiene marcado.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { JBadge, JSidebarLayout, JUserAvatar, type SidebarNavItem } from 'uijona-4ngular';
import { environment } from '../../environments/environment';
import { ApiService } from '../core/api.service';
import { SessionService } from '../core/session.service';
import { RelojCanalComponent } from '../shared/reloj-canal/reloj-canal';
import { ShellViewComponent } from './shell-view.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, JSidebarLayout, JUserAvatar, JBadge, RelojCanalComponent],
  templateUrl: './shell-view.component.html',
})
export class Shell extends ShellViewComponent {
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  private readonly api = inject(ApiService);

  constructor() {
    super();

    this.can = (permiso: string) => this.session.can(permiso);
    this.tenant.set(this.session.tenant());
    this.user.set(this.session.user());
    this.sincronizarRuta(this.router.url);
    this.refrescarPendientes();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.sincronizarRuta(e.urlAfterRedirects);
        // Navegar suele venir después de actuar sobre una etapa (validar, generar,
        // decidir). Recontar aquí mantiene los badges honestos sin necesidad de
        // que cada página avise al shell de lo que acaba de hacer.
        this.refrescarPendientes();
      });
  }

  private refrescarPendientes(): void {
    this.api.pendientesPorEtapa().subscribe((p) => this.pendientes.set(p));
  }

  protected override onNav(item: SidebarNavItem): void {
    this.router.navigate(['/', ...item.key.split('/')]);
  }

  protected override logout(): void {
    this.session.clear();
    // BFF: el gateway cierra la sesión OIDC y redirige a logout-success-url.
    window.location.href = `${environment.gatewayBaseUrl}/logout`;
  }

  /**
   * La clave activa es la ruta completa para que las vistas por producto
   * (`operaciones/pagos-masivos`) sigan marcando su etapa del flujo aunque ya
   * no tengan ítem propio en el menú.
   */
  private sincronizarRuta(url: string): void {
    const segmentos = url.split('?')[0].split('/').filter(Boolean);
    const completa = segmentos.join('/') || 'dashboard';
    const item = this.nav()
      .flatMap((g) => g.items)
      .find((i) => i.key === completa);
    this.activeKey.set(item ? completa : (segmentos[0] ?? 'dashboard'));
  }
}
