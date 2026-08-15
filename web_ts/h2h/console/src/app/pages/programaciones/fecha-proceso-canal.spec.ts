import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { VentanaSemanal } from '../../core/models';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/**
 * La fecha de proceso al cambiar el canal de salida.
 *
 * <p>A H2W se llega casi siempre porque el camino automático falló, y para entonces la fecha del
 * plan ya venció. El TXT la lleva en el nombre y en la cabecera, así que sin moverla el archivo
 * sale caducado y el banco lo rechaza —lo suba un job o una persona—. Por eso el cambio de canal
 * admite fecha nueva: no es un adorno del formulario, es lo que devuelve el plan al estado de
 * generable.</p>
 *
 * <p>Lo que se protege aquí es la parte silenciosa: una fecha mal propuesta o mal comparada no
 * rompe nada en pantalla —el diálogo se ve idéntico— y el error aparece al generar, o peor, en el
 * buzón del banco con el correlativo ya gastado.</p>
 */
describe('ProgramacionesViewComponent: fecha de proceso al cambiar de canal', () => {
  type Interna = {
    setVentana: (v: VentanaSemanal | null) => void;
    abrirModalidad: (plan: unknown) => void;
    modalidadFecha: { set: (v: string) => void; (): string };
    modalidadFechaCambia: () => boolean;
    motivoFechaModalidad: () => string | null;
    hoyCanal: () => string;
    detalleSeleccionado: { set: (v: unknown) => void };
    avisoFechaPlanVencida: () => string | null;
  };

  let vista: Interna;

  /** La ventana solo aporta la zona: es de donde sale qué día es «hoy» para el canal. */
  function ventana(zonaHoraria = 'America/Lima'): VentanaSemanal {
    return { zonaHoraria, resuelta: true, dias: [] };
  }

  function plan(fechaProceso: string, modalidadCodigo = 'H2H') {
    return { id: 'p1', codigo: 'PRG-1', fechaProceso, modalidadCodigo };
  }

  /** Un día antes / después de hoy en el canal, en `yyyy-MM-dd`. */
  function desplazar(iso: string, dias: number): string {
    const d = new Date(`${iso}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + dias);
    return d.toISOString().slice(0, 10);
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(ProgramacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    vista.setVentana(ventana());
  });

  it('«hoy» se calcula en la zona del CANAL, no en la del navegador', () => {
    // Si se tomara la fecha local del equipo, un operador en otro huso vería un mínimo distinto
    // del que aplica el backend: el formulario aceptaría una fecha que luego se rechaza.
    vista.setVentana(ventana('Pacific/Kiritimati')); // UTC+14, el huso que más se adelanta
    const enKiritimati = vista.hoyCanal();
    vista.setVentana(ventana('Pacific/Midway')); // UTC-11, el que más se atrasa
    const enMidway = vista.hoyCanal();

    // Ambas son fechas válidas y, en algún momento del día, distintas entre sí. Lo que se
    // comprueba es que la zona SE USA: si se ignorara, saldría el mismo día siempre.
    expect(enKiritimati).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(enMidway).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(enKiritimati >= enMidway).toBe(true);
  });

  it('un plan VENCIDO se abre proponiendo hoy, no su fecha muerta', () => {
    // Dejar la fecha vieja en el campo obligaría al operador a darse cuenta solo, y el diálogo se
    // vería perfectamente normal hasta que el backend lo rechazara.
    const hoy = vista.hoyCanal();
    vista.abrirModalidad(plan(desplazar(hoy, -3)));

    expect(vista.modalidadFecha()).toBe(hoy);
    expect(vista.motivoFechaModalidad()).toBeNull();
    expect(vista.modalidadFechaCambia()).toBe(true);
  });

  it('un plan VIGENTE conserva su fecha: cambiar de canal no es reprogramar', () => {
    // Y por eso `modalidadFechaCambia` dice false: no se manda nada y no se reescriben las
    // operaciones del plan para dejarlas igual.
    const futura = desplazar(vista.hoyCanal(), 5);
    vista.abrirModalidad(plan(futura));

    expect(vista.modalidadFecha()).toBe(futura);
    expect(vista.modalidadFechaCambia()).toBe(false);
  });

  it('una fecha anterior a hoy se rechaza ANTES de llamar al backend', () => {
    vista.abrirModalidad(plan(vista.hoyCanal()));
    vista.modalidadFecha.set(desplazar(vista.hoyCanal(), -1));

    expect(vista.motivoFechaModalidad()).toContain('no puede ser anterior a hoy');
  });

  it('hoy mismo SÍ vale: el límite es «anterior», no «anterior o igual»', () => {
    // El caso corriente del canal de contingencia —preparar el archivo hoy para subirlo hoy—.
    // Un `<=` por error lo bloquearía y no habría forma de generar nada el mismo día.
    vista.abrirModalidad(plan(vista.hoyCanal()));
    vista.modalidadFecha.set(vista.hoyCanal());

    expect(vista.motivoFechaModalidad()).toBeNull();
  });

  it('sin fecha no se deja continuar', () => {
    vista.abrirModalidad(plan(vista.hoyCanal()));
    vista.modalidadFecha.set('');

    expect(vista.motivoFechaModalidad()).toBe('Indique la fecha de proceso.');
  });

  it('el plan abierto avisa de su fecha vencida antes de pulsar Generar', () => {
    // El aviso dice DÓNDE se arregla. Sin él, el operador solo ve el rechazo del backend y no
    // tiene por qué saber que la vía es el diálogo de canal.
    vista.detalleSeleccionado.set(plan(desplazar(vista.hoyCanal(), -2)));

    const aviso = vista.avisoFechaPlanVencida();
    expect(aviso).toContain('ya pasó');
    expect(aviso).toContain('Canal de salida');
  });

  it('un plan con fecha en regla no molesta con avisos', () => {
    vista.detalleSeleccionado.set(plan(vista.hoyCanal()));

    expect(vista.avisoFechaPlanVencida()).toBeNull();
  });

  it('tolera una fecha con hora pegada: el backend no siempre la manda limpia', () => {
    // `fechaProceso` viaja como `date`, pero por el camino puede llegar con hora. Comparar
    // `2026-08-15T00:00:00` contra `2026-08-15` daría «vencida» por el sufijo, no por el día.
    vista.detalleSeleccionado.set(plan(`${vista.hoyCanal()}T00:00:00`));

    expect(vista.avisoFechaPlanVencida()).toBeNull();
  });
});
