import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { OperacionDetalle } from '../../core/models';
import type { ComparacionCalimaco } from '../calimaco/inter-conciliacion';
import { OperacionesViewComponent } from './operaciones-view.component';

/**
 * Cuándo se puede pulsar «Informar pago a Calimaco».
 *
 * <h3>Qué protege</h3>
 *
 * <p>Ese botón manda una llamada irreversible que marca un pago en el sistema del casino. Lo único
 * que hay entre un clic distraído y un pago ajeno marcado es este bloqueo, y por eso se prueba cada
 * motivo por el que debe estar cerrado — no solo el camino feliz.</p>
 *
 * <p>La comprobación es <b>optimista</b>: el backend vuelve a comparar por su cuenta antes de mandar.
 * Esto solo evita el viaje y, sobre todo, explica en pantalla por qué la acción no está disponible en
 * vez de esconder el botón sin decir nada.</p>
 */
describe('OperacionesViewComponent: conciliación con Calimaco', () => {
  type Interna = {
    setOpDetalle: (d: OperacionDetalle) => void;
    cerrarOpDetalle: () => void;
    bloqueoCalimaco: () => string | null;
    comparacion: { (): ComparacionCalimaco | null; set: (v: ComparacionCalimaco | null) => void };
    comparando: () => boolean;
    informando: () => boolean;
  };

  let vista: Interna;

  /** Un detalle con el registro plano que la vista lee, como lo devuelve el backend. */
  function detalle(estado: string, codigoExterno: string | null = '1.3572384016'): OperacionDetalle {
    const operacion: Record<string, unknown> = {
      id: '11111111-2222-3333-4444-555555555555',
      estadoOperacionCodigo: estado,
      codigoOperacion: 'OP-1',
    };
    if (codigoExterno !== null) {
      operacion['codigoExterno'] = codigoExterno;
    }
    return {
      operacion,
      beneficiario: {},
      beneficiarioCuenta: {},
      operacionItems: [],
      operacionContables: [],
    } as unknown as OperacionDetalle;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(OperacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('con la operación pagada y con código externo, no hay bloqueo', () => {
    vista.setOpDetalle(detalle('PAGO_CONFIRMADO'));
    expect(vista.bloqueoCalimaco()).toBeNull();
  });

  it('antes de PAGO_CONFIRMADO no se informa', () => {
    // Avisar antes seria decirle al casino que pagamos algo que el banco todavia puede rechazar.
    vista.setOpDetalle(detalle('EN_PROCESO_PAGO'));
    expect(vista.bloqueoCalimaco()).toContain('PAGO_CONFIRMADO');
    expect(vista.bloqueoCalimaco()).toContain('EN_PROCESO_PAGO');
  });

  it('ya informada no se vuelve a informar', () => {
    vista.setOpDetalle(detalle('PAGO_INFORMADO'));
    expect(vista.bloqueoCalimaco()).toContain('ya está informada');
  });

  it('sin código externo no hay con qué buscarla en Calimaco', () => {
    vista.setOpDetalle(detalle('PAGO_CONFIRMADO', null));
    expect(vista.bloqueoCalimaco()).toContain('código externo');
  });

  it('sin detalle abierto no se afirma nada', () => {
    // `null` significa «no aplica», no «adelante»: el panel entero está oculto sin detalle.
    expect(vista.bloqueoCalimaco()).toBeNull();
  });

  it('la comparación se olvida al cerrar el detalle', () => {
    // Dejarla viva mostraría los datos de la operación anterior junto al botón irreversible de otra.
    vista.setOpDetalle(detalle('PAGO_CONFIRMADO'));
    vista.comparacion.set({
      coincide: true,
      puedeInformar: true,
      motivos: [],
      campos: [{ campo: 'Importe', nuestro: '1.00', suyo: '1.00', coincide: true, critico: true }],
    });
    expect(vista.comparacion()).not.toBeNull();

    vista.cerrarOpDetalle();

    expect(vista.comparacion()).toBeNull();
    expect(vista.comparando()).toBe(false);
    expect(vista.informando()).toBe(false);
  });
});
