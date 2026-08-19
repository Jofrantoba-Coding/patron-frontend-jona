import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InformesViewComponent } from './informes-view.component';
import type {
  CandidatosInforme,
  DetalleProgramacionInforme,
  ProgramacionInforme,
} from './inter-informes';

/**
 * La selección de operaciones y los frenos de la tanda.
 *
 * <h3>Qué se protege</h3>
 *
 * <p>Cada operación de la tanda acaba mandando una llamada irreversible al sistema del casino. Lo que
 * se prueba aquí es que no se pueda comprometer nada sin haberlo seleccionado, que el resumen que
 * acompaña al botón diga la verdad, y que ejecutar y cancelar estén cerrados cuando no procede.</p>
 */
describe('InformesViewComponent', () => {
  type Interna = {
    setCandidatos: (c: CandidatosInforme) => void;
    setDetalle: (d: DetalleProgramacionInforme | null) => void;
    seleccion: () => Set<string>;
    seleccionada: (id: string) => boolean;
    alternar: (id: string) => void;
    alternarTodas: () => void;
    todasSeleccionadas: () => boolean;
    seleccionadas: () => number;
    montoSeleccionado: () => number;
    monedasSeleccionadas: () => string[];
    avisoMonedas: () => string | null;
    motivoNoCrear: () => string | null;
    bloqueoEjecutar: () => string | null;
    bloqueoCancelar: () => string | null;
    efectoEjecutar: () => string;
    pendientes: () => number;
  };

  let vista: Interna;

  function candidatos(): CandidatosInforme {
    return {
      total: 3,
      items: [
        { id: 'a', codigoOperacion: 'OP-1', monto: 100, moneda: 'PEN' },
        { id: 'b', codigoOperacion: 'OP-2', monto: 250.5, moneda: 'PEN' },
        { id: 'c', codigoOperacion: 'OP-3', monto: 40, moneda: 'USD' },
      ],
    };
  }

  function cabecera(over: Partial<ProgramacionInforme> = {}): ProgramacionInforme {
    return {
      id: 'p1',
      codigo: 'INF-000001',
      estado: 'PROGRAMADA',
      modoIntegracion: 'OFFLINE',
      totalOperaciones: 2,
      informadas: 0,
      fallidas: 0,
      ...over,
    };
  }

  function detalle(
    over: Partial<ProgramacionInforme> = {},
    estados: string[] = ['PLANIFICADO', 'PLANIFICADO']
  ): DetalleProgramacionInforme {
    return {
      cabecera: cabecera(over),
      detalles: estados.map((estado, i) => ({
        id: `d${i}`,
        secuencial: i + 1,
        idOperacion: `o${i}`,
        estado,
      })),
    };
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(InformesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  describe('selección', () => {
    it('empieza vacía: nada se compromete sin marcarlo', () => {
      vista.setCandidatos(candidatos());
      expect(vista.seleccionadas()).toBe(0);
      expect(vista.motivoNoCrear()).toContain('Seleccione');
    });

    it('alternar marca y desmarca', () => {
      vista.setCandidatos(candidatos());
      vista.alternar('a');
      expect(vista.seleccionada('a')).toBe(true);
      vista.alternar('a');
      expect(vista.seleccionada('a')).toBe(false);
    });

    it('el total sumado es el de lo seleccionado, no el de la lista', () => {
      vista.setCandidatos(candidatos());
      vista.alternar('a');
      vista.alternar('b');
      expect(vista.seleccionadas()).toBe(2);
      expect(vista.montoSeleccionado()).toBe(350.5);
    });

    it('seleccionar todo marca solo lo que está a la vista', () => {
      // Si la búsqueda vino truncada hay candidatos que el operador no ha visto, y marcar a ciegas
      // es justo lo que esta pantalla evita.
      vista.setCandidatos({ ...candidatos(), truncado: true });
      vista.alternarTodas();
      expect(vista.seleccionadas()).toBe(3);
      expect(vista.todasSeleccionadas()).toBe(true);
      vista.alternarTodas();
      expect(vista.seleccionadas()).toBe(0);
    });

    it('cambiar la búsqueda limpia la selección', () => {
      // Mantener marcadas operaciones que ya no están en la lista mandaría al backend ids que el
      // operador no está viendo.
      vista.setCandidatos(candidatos());
      vista.alternar('a');
      expect(vista.seleccionadas()).toBe(1);

      vista.setCandidatos(candidatos());

      expect(vista.seleccionadas()).toBe(0);
    });

    it('mezclar monedas avisa pero no bloquea', () => {
      // El total deja de significar algo, pero una tanda mixta es legítima: informar no mueve dinero.
      vista.setCandidatos(candidatos());
      vista.alternar('a');
      vista.alternar('c');
      expect(vista.monedasSeleccionadas().sort()).toEqual(['PEN', 'USD']);
      expect(vista.avisoMonedas()).toContain('mezcladas');
      expect(vista.motivoNoCrear()).toBeNull();
    });

    it('una sola moneda no avisa', () => {
      vista.setCandidatos(candidatos());
      vista.alternar('a');
      vista.alternar('b');
      expect(vista.avisoMonedas()).toBeNull();
    });
  });

  describe('ejecutar', () => {
    it('con la tanda programada no hay bloqueo', () => {
      vista.setDetalle(detalle());
      expect(vista.bloqueoEjecutar()).toBeNull();
    });

    it('cancelada no se ejecuta', () => {
      vista.setDetalle(detalle({ estado: 'CANCELADA' }));
      expect(vista.bloqueoEjecutar()).toContain('cancelada');
    });

    it('ya informada por completo tampoco', () => {
      vista.setDetalle(detalle({ estado: 'INFORMADA' }));
      expect(vista.bloqueoEjecutar()).toContain('por completo');
    });

    it('una tanda sin operaciones no se ejecuta', () => {
      vista.setDetalle({ cabecera: cabecera({ totalOperaciones: 0 }), detalles: [] });
      expect(vista.bloqueoEjecutar()).toContain('no tiene operaciones');
    });

    it('parcial sí se puede reintentar: quedan pendientes', () => {
      vista.setDetalle(detalle({ estado: 'PARCIAL' }, ['INFORMADO', 'NO_COINCIDE']));
      expect(vista.bloqueoEjecutar()).toBeNull();
      expect(vista.pendientes()).toBe(1);
    });

    it('lo ya informado no cuenta como pendiente', () => {
      vista.setDetalle(detalle({}, ['INFORMADO', 'SIN_ENVIAR']));
      expect(vista.pendientes()).toBe(0);
    });
  });

  describe('el modo se dice sin rodeos', () => {
    it('en OFFLINE avisa de que nada avanzará', () => {
      vista.setDetalle(detalle({ modoIntegracion: 'OFFLINE' }));
      expect(vista.efectoEjecutar()).toContain('ninguna operación avanzará');
    });

    it('en SIMULACION también', () => {
      vista.setDetalle(detalle({ modoIntegracion: 'SIMULACION' }));
      expect(vista.efectoEjecutar()).toContain('ninguna operación avanzará');
    });

    it('en REAL dice que es irreversible', () => {
      vista.setDetalle(detalle({ modoIntegracion: 'REAL' }));
      expect(vista.efectoEjecutar()).toContain('irreversible');
    });
  });

  describe('cancelar', () => {
    it('sin ejecutar se puede cancelar', () => {
      vista.setDetalle(detalle());
      expect(vista.bloqueoCancelar()).toBeNull();
    });

    it('ya ejecutada NO se cancela', () => {
      // Cancelar algo ya enviado no deshace el aviso, y dejarlo como CANCELADA mentiría sobre lo
      // que ocurrió en el origen.
      vista.setDetalle(detalle({ ejecutado: '2026-08-19 10:00:00' }));
      expect(vista.bloqueoCancelar()).toContain('ya se ejecutó');
    });

    it('en un estado que no lo admite tampoco', () => {
      vista.setDetalle(detalle({ estado: 'EN_PROCESO' }));
      expect(vista.bloqueoCancelar()).toContain('EN_PROCESO');
    });
  });

  it('sin detalle abierto no se afirma nada', () => {
    // `null` significa «no aplica», no «adelante».
    expect(vista.bloqueoEjecutar()).toBeNull();
    expect(vista.bloqueoCancelar()).toBeNull();
  });
});
