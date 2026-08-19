import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JBadge, JButton, JCard, JCardContent, JCardHeader, JCardTitle, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { CalimacoViewComponent } from './calimaco-view.component';
import type {
  GuardarCalimaco,
  GuardarInterruptorCalimaco,
} from './inter-calimaco';

/**
 * Integración con Calimaco, el sistema de origen de las operaciones.
 *
 * <p>Habla con {@code api/mantenimientos/h2h/v1/organizacion/calimaco/*}, que reparte lo que se
 * guarda: las credenciales y las URLs van a Vault y los interruptores a {@code tm_orcon}. Es el
 * mismo camino de la configuración del SFTP, y existe para que una copia de la base no lleve
 * credenciales dentro.</p>
 */
@Component({
  selector: 'app-calimaco',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JCard, JCardHeader, JCardTitle, JCardContent, JBadge, JButton],
  templateUrl: './calimaco-view.component.html',
})
export class CalimacoPage extends CalimacoViewComponent {
  private readonly api = inject(ApiService);

  constructor() {
    super();
    this.cargar();
  }

  protected override cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.api.calimacoLeer().subscribe({
      next: (data) => {
        this.cargando.set(false);
        this.setConfig(data);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(this.mensajeDe(err, 'No se pudo leer la configuración de Calimaco.'));
      },
    });
  }

  protected override guardar(valor: GuardarCalimaco): void {
    this.cargando.set(true);
    this.aviso.set(null);
    this.error.set(null);
    this.api.calimacoGuardar(valor).subscribe({
      next: () => {
        this.cargando.set(false);
        this.aviso.set('Configuración guardada. La credencial se escribió en Vault.');
        // Se recarga para que `tienePassword` y el secretRef vengan del servidor y no de lo que
        // acabamos de teclear: si Vault hubiera fallado, la pantalla no debe decir que hay
        // contraseña guardada.
        this.cargar();
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(this.mensajeDe(err, 'No se pudo guardar la configuración.'));
      },
    });
  }

  protected override guardarInterruptor(valor: GuardarInterruptorCalimaco): void {
    this.cargando.set(true);
    this.aviso.set(null);
    this.error.set(null);
    this.api.calimacoGuardarInterruptor(valor).subscribe({
      next: () => {
        this.cargando.set(false);
        this.aviso.set('Aviso a Calimaco actualizado.');
        // Se recarga por lo mismo que el otro guardado: lo que se pinta debe venir del nodo, no de
        // lo que acabamos de pedir. Y ademas trae el candado de plataforma al dia, que es lo que
        // decide si este encendido tiene algun efecto.
        this.cargar();
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(this.mensajeDe(err, 'No se pudo actualizar el aviso a Calimaco.'));
      },
    });
  }

  /**
   * El mensaje del backend cuando lo hay.
   *
   * <p>Los de este proceso están escritos para leerse —«la organización no tiene el nodo X»— y
   * sustituirlos por un texto genérico obligaría a abrir el log del servidor para algo que el
   * operador puede corregir solo.</p>
   */
  private mensajeDe(err: unknown, porDefecto: string): string {
    const cuerpo = (err as { error?: { message?: string } } | null)?.error;
    const mensaje = cuerpo?.message;
    return mensaje && mensaje.trim() ? mensaje : porDefecto;
  }
}
