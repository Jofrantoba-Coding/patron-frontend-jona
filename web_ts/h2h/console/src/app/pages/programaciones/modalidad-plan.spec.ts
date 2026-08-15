import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/**
 * Reglas de canal en el alta y el cambio de plan.
 *
 * <p>La View aplica aqui la MISMA regla que el backend (H2W obliga a MANUAL) no para sustituir
 * su validacion —que sigue mandando— sino para no ofrecer una combinacion que va a fallar: en
 * H2W no hay job que suba nada al portal, asi que un plan AUTOMATICO seria un plan que nadie
 * dispara.</p>
 */
describe('ProgramacionesViewComponent: canal de salida', () => {
  /** Acceso a lo protegido: es una View JONA, su estado no es API publica. */
  type Interna = {
    nuevoModalidad: { set: (v: string) => void; (): string };
    nuevoModo: { set: (v: string) => void; (): string };
    onNuevaModalidad: (e: Event) => void;
    modalidadDestino: () => string;
    modalidadPlan: () => unknown;
    modalidadOpen: () => boolean;
    abrirModalidad: (plan: unknown) => void;
    canalDe: (row: unknown) => string;
  };

  let vista: Interna;

  function seleccion(valor: string): Event {
    return { target: { value: valor } } as unknown as Event;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(ProgramacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('un plan nuevo nace H2H: el canal de siempre', () => {
    expect(vista.nuevoModalidad()).toBe('H2H');
  });

  it('elegir H2W fuerza el modo MANUAL', () => {
    vista.nuevoModo.set('AUTOMATICO');
    vista.onNuevaModalidad(seleccion('H2W'));

    expect(vista.nuevoModalidad()).toBe('H2W');
    expect(vista.nuevoModo()).toBe('MANUAL');
  });

  it('volver a H2H no reactiva el automatico por su cuenta', () => {
    // Devolver el modo a AUTOMATICO al volver a H2H seria decidir por el operador algo que no
    // pidio: pudo haber elegido MANUAL a proposito antes de tocar el canal.
    vista.onNuevaModalidad(seleccion('H2W'));
    vista.onNuevaModalidad(seleccion('H2H'));

    expect(vista.nuevoModalidad()).toBe('H2H');
    expect(vista.nuevoModo()).toBe('MANUAL');
  });

  it('el cambio de canal propone el contrario al actual', () => {
    // Nadie abre ese dialogo para dejar el plan como estaba.
    vista.abrirModalidad({ id: '1', modalidadCodigo: 'H2H' });
    expect(vista.modalidadDestino()).toBe('H2W');

    vista.abrirModalidad({ id: '1', modalidadCodigo: 'H2W' });
    expect(vista.modalidadDestino()).toBe('H2H');

    // Un plan sin dato de canal es H2H (el back-fill dejo asi todo lo anterior).
    vista.abrirModalidad({ id: '1' });
    expect(vista.modalidadDestino()).toBe('H2W');
  });

  it('el canal se muestra en palabras, no en codigo', () => {
    expect(vista.canalDe({ modalidadCodigo: 'H2W' })).toBe('Portal web');
    expect(vista.canalDe({ modalidadCodigo: 'h2w' })).toBe('Portal web');
    expect(vista.canalDe({ modalidadCodigo: 'H2H' })).toBe('SFTP');
    expect(vista.canalDe({})).toBe('SFTP');
  });
});
