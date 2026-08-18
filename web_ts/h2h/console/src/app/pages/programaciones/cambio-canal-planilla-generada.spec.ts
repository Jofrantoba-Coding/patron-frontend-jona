import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ProgramacionRow } from '../../core/models';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/**
 * El cambio de canal se ofrece solo si el plan NO generó planilla.
 *
 * <h3>Por qué</h3>
 *
 * <p>Los dos canales no comparten archivo: H2H deposita el TXT cifrado por SFTP, y H2W lo sube una
 * persona en claro al portal de BCP. Un archivo ya generado pertenece al canal con el que se creó, y
 * arrastrarle la modalidad dejaría una planilla que dice una cosa y contiene otra.</p>
 *
 * <p>La guarda de verdad está en el dominio. Esto solo evita ofrecer algo imposible: antes el
 * frontend no comprobaba nada —sus validaciones eran de modalidad y fecha—, el botón salía
 * habilitado y el rechazo llegaba del servidor después de pulsarlo.</p>
 */
describe('ProgramacionesViewComponent: cambio de canal y planilla generada', () => {
  type Interna = {
    abrirModalidad: (plan: ProgramacionRow) => void;
    motivoNoCambiaCanal: () => string | null;
  };

  let vista: Interna;

  function plan(idPlanilla: string | null): ProgramacionRow {
    return {
      id: 'p1',
      codigo: 'PRG-20260817-TEST',
      estadoCodigo: 'PROGRAMADA',
      modalidadCodigo: 'H2H',
      idPlanilla,
    } as unknown as ProgramacionRow;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(ProgramacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('un plan sin planilla puede cambiar de canal', () => {
    vista.abrirModalidad(plan(null));

    expect(vista.motivoNoCambiaCanal()).toBeNull();
  });

  it('un plan que ya generó planilla no puede, y se explica la salida', () => {
    vista.abrirModalidad(plan('a1b2c3d4-0000-0000-0000-000000000001'));

    const motivo = vista.motivoNoCambiaCanal();
    expect(motivo).not.toBeNull();
    // El motivo tiene que traer la salida concreta, no solo la negativa: sin ella el operador se
    // queda sin saber que la via es anular y crear un plan nuevo.
    expect(motivo).toContain('Anule la planilla');
  });

  it('no depende del ESTADO de la planilla, solo de que exista', () => {
    // Este es el cambio de fondo. Antes se permitia en GENERADA, VALIDADA y CIFRADA arrastrando la
    // modalidad al archivo ya hecho, y solo se negaba desde los estados en que ya habia salido.
    // La fila del listado no trae el estado de la planilla, y no hace falta: basta el enlace.
    vista.abrirModalidad(plan('a1b2c3d4-0000-0000-0000-000000000002'));

    expect(vista.motivoNoCambiaCanal()).not.toBeNull();
  });

  it('sin plan abierto no hay motivo que mostrar', () => {
    // El dialogo cerrado no debe pintar avisos.
    expect(vista.motivoNoCambiaCanal()).toBeNull();
  });
});
