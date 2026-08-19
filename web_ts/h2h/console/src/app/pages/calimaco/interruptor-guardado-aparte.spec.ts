import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CalimacoViewComponent } from './calimaco-view.component';
import type {
  ConfiguracionCalimaco,
  EndpointCalimaco,
  GuardarCalimaco,
  GuardarInterruptorCalimaco,
  ModoCalimaco,
  NombreEndpoint,
} from './inter-calimaco';

/**
 * El interruptor de la organización se guarda por su cuenta, sin pasar por Vault.
 *
 * <h3>De dónde viene</h3>
 *
 * <p>Encendido y modo solo se podían cambiar guardando la página entera, y ese guardado reescribe
 * los cuatro secretos de Vault porque nació para configurar endpoints. Dos consecuencias: mandar
 * solo el interruptor era imposible —el backend respondía 422 «no se envió ningún endpoint que
 * guardar»— y cambiar el modo reescribía credenciales que nadie pidió tocar. Así se sobrescribió
 * una contraseña de la cuenta de servicio.</p>
 *
 * <h3>Qué se protege aquí</h3>
 *
 * <p>Que los dos guardados sigan siendo disjuntos. Si el payload de los endpoints volviera a llevar
 * el interruptor, el switch tendría dos escritores y pulsar «Guardar endpoints» podría reafirmar en
 * silencio un encendido que nadie vino a cambiar —y en REAL eso habilita marcar pagos ajenos—.</p>
 */
describe('CalimacoViewComponent: el interruptor se guarda aparte', () => {
  type Interna = {
    setConfig: (c: ConfiguracionCalimaco) => void;
    habilitado: { (): boolean; set: (v: boolean) => void };
    modo: { (): ModoCalimaco; set: (v: ModoCalimaco) => void };
    interruptorCambiado: () => boolean;
    confirmandoReal: () => boolean;
    onModo: (e: Event) => void;
    confirmarReal: () => void;
    onGuardar: () => void;
    onGuardarInterruptor: () => void;
    guardar: (v: GuardarCalimaco) => void;
    guardarInterruptor: (v: GuardarInterruptorCalimaco) => void;
  };

  let vista: Interna;
  /** Lo que la Vista habría mandado a la Page, sin tocar el servicio. */
  let endpointsEnviados: GuardarCalimaco[];
  let interruptoresEnviados: GuardarInterruptorCalimaco[];

  function endpoint(nombre: NombreEndpoint, over: Partial<EndpointCalimaco> = {}): EndpointCalimaco {
    return {
      nombre,
      url: `https://api.example.com/api/admin/${nombre.toLowerCase()}`,
      metodo: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      tienePassword: false,
      cabeceras: [],
      parametros: [],
      ...over,
    };
  }

  function config(over: Partial<ConfiguracionCalimaco> = {}): ConfiguracionCalimaco {
    return {
      habilitado: false,
      modo: 'SIMULACION',
      estadoOrigen: 'ACCEPTED',
      estadoDestino: 'PROCESSED',
      timeoutSegundos: 30,
      plataforma: { habilitado: true, forzarApagado: false, motivo: null },
      endpoints: [
        endpoint('LOGIN', {
          tienePassword: true,
          parametros: [{ nombre: 'usuario', valor: 'svc' }],
        }),
        endpoint('TRANSICIONES'),
        endpoint('REPORTE'),
        endpoint('LOTE', { contentType: 'multipart/form-data' }),
      ],
      ...over,
    };
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(CalimacoViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    endpointsEnviados = [];
    interruptoresEnviados = [];
    vista.guardar = (v) => endpointsEnviados.push(v);
    vista.guardarInterruptor = (v) => interruptoresEnviados.push(v);
    vista.setConfig(config());
  });

  it('el guardado de endpoints NO lleva el interruptor', () => {
    // Ese payload reescribe los cuatro secretos de Vault. El encendido no tiene por qué viajar en
    // una petición que toca credenciales.
    vista.habilitado.set(true);
    vista.modo.set('REAL');
    vista.onGuardar();

    expect(endpointsEnviados).toHaveLength(1);
    const enviado = endpointsEnviados[0] as unknown as Record<string, unknown>;
    expect('habilitado' in enviado).toBe(false);
    expect('modo' in enviado).toBe(false);
    // Y sí lleva lo suyo: los cuatro endpoints y los estados del nodo de conexión.
    expect(enviado['endpoints']).toHaveLength(4);
    expect(enviado['estadoOrigen']).toBe('ACCEPTED');
  });

  it('el guardado del interruptor lleva SOLO encendido y modo', () => {
    vista.habilitado.set(true);
    vista.modo.set('SIMULACION');
    vista.onGuardarInterruptor();

    expect(interruptoresEnviados).toEqual([{ habilitado: true, modo: 'SIMULACION' }]);
    // Y no arrastra el otro guardado: son dos peticiones distintas a dos endpoints distintos.
    expect(endpointsEnviados).toHaveLength(0);
  });

  it('sin cambios no se guarda', () => {
    // El botón está deshabilitado, pero el método también se defiende: un guardado que no cambia
    // nada escribe una versión nueva del nodo y deja rastro en el log de algo que no pasó.
    expect(vista.interruptorCambiado()).toBe(false);
    vista.onGuardarInterruptor();
    expect(interruptoresEnviados).toHaveLength(0);

    vista.habilitado.set(true);
    expect(vista.interruptorCambiado()).toBe(true);
  });

  it('mientras la confirmación de REAL está abierta no se guarda', () => {
    // Elegir REAL abre la confirmación y NO cambia `modo()` —de ahí que el selector vuelva atrás—.
    // Guardar en ese punto persistiría el modo anterior, justo lo que se intentaba cambiar.
    vista.habilitado.set(true);
    vista.onModo({ target: { value: 'REAL' } } as unknown as Event);
    expect(vista.confirmandoReal()).toBe(true);
    expect(vista.modo()).toBe('SIMULACION');

    vista.onGuardarInterruptor();
    expect(interruptoresEnviados).toHaveLength(0);

    // Confirmado, ya sí. `confirmarReal()` es lo único que pone REAL y cierra el aviso a la vez:
    // mover `modo` por otro camino dejaría la confirmación abierta y el guardado seguiría frenado.
    vista.confirmarReal();
    expect(vista.confirmandoReal()).toBe(false);
    expect(vista.modo()).toBe('REAL');
    vista.onGuardarInterruptor();
    expect(interruptoresEnviados).toEqual([{ habilitado: true, modo: 'REAL' }]);
  });
});
