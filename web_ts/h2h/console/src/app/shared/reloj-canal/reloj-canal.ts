// reloj-canal.ts — JONA Page/Impl del reloj del canal.
// Pide la ventana al backend y mantiene el tick; la vista solo deriva.
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  JAlert,
  JBadge,
  JCard,
  JCardContent,
  JCardDescription,
  JCardHeader,
  JCardTitle,
  JDot,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { REFRESCO_MS } from './inter-reloj-canal';
import { RelojCanalViewComponent } from './reloj-canal-view.component';

@Component({
  selector: 'app-reloj-canal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JCard,
    JCardHeader,
    JCardTitle,
    JCardDescription,
    JCardContent,
    JBadge,
    JDot,
    JAlert,
  ],
  templateUrl: './reloj-canal-view.component.html',
})
export class RelojCanalComponent extends RelojCanalViewComponent {
  private readonly api = inject(ApiService);

  constructor() {
    super();
    this.refrescar();

    // El dato es una hora de corte: recalcular cada minuto sobra para la cuenta
    // atrás y evita repintar la consola entera cada segundo.
    const tick = setInterval(() => this.ahora.set(new Date()), REFRESCO_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(tick));
  }

  /**
   * La ventana se vuelve a pedir, no se cachea en sesión: la configuración
   * horaria se edita desde la propia consola y un valor viejo haría que el
   * operador confíe en un corte que ya no existe.
   */
  refrescar(): void {
    this.api.ventanaCanalProgramacion().subscribe({
      next: (v) => this.ventana.set(v),
      // Sin ventana el reloj se queda en 'sinDato' y lo dice; no se inventa una.
      error: () => this.ventana.set(null),
    });
  }
}
