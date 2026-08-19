import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { OperacionDetalleDialog } from './operacion-detalle-dialog';
import type {
  ComparacionCalimaco,
  EstadoCalimaco,
  SesionCalimaco,
} from '../pages/calimaco/inter-conciliacion';

/**
 * Los cuatro pasos del informe manual, y la puerta que protege al tercero.
 *
 * <h3>Qué se protege</h3>
 *
 * <p>El paso 3 manda `batchUpdatePayouts`: marca un pago en el sistema del casino y no se deshace.
 * Lo único que lo separa de un clic accidental es `puedeEnviarYa()`, que exige tres cosas a la vez —
 * la comparación cuadra, la sesión está viva y la transición está concedida—. Si alguna deja de
 * exigirse, el botón se habilita antes de tiempo y nadie lo nota en pantalla: el fallo aparece
 * después, en un rechazo a mitad de envío o en un pago marcado que no debía marcarse.</p>
 *
 * <p>Y dos excepciones que también hay que fijar, porque parecen agujeros y no lo son: poner al día
 * algo ya aplicado no manda nada, y en OFFLINE no hay credencial que comprobar.</p>
 */
describe('OperacionDetalleDialog: los cuatro pasos del informe manual', () => {
  type Interna = {
    comparacion: ComparacionCalimaco | null;
    sesion: SesionCalimaco | null;
    estado: EstadoCalimaco | null;
    comparando: boolean;
    informando: boolean;
    verificandoSesion: boolean;
    verificandoEstado: boolean;
    puedeEnviarYa: () => boolean;
    pasos: () => Array<{ n: number; titulo: string; estado: string }>;
  };

  let dialogo: Interna;

  function sesion(over: Partial<SesionCalimaco> = {}): SesionCalimaco {
    return {
      utilizable: true,
      sesionActiva: true,
      transicionPermitida: true,
      estadoOrigenCalimaco: 'ACCEPTED',
      estadoDestinoCalimaco: 'PROCESSED',
      usuario: 'svc',
      motivos: [],
      ...over,
    };
  }

  function comparacion(over: Partial<ComparacionCalimaco> = {}): ComparacionCalimaco {
    return { coincide: true, puedeInformar: true, motivos: [], campos: [], modo: 'REAL', ...over };
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(OperacionDetalleDialog);
    dialogo = fixture.componentInstance as unknown as Interna;
  });

  // ── la puerta del paso 3 ───────────────────────────────────────────────────────────────────

  it('sin comparación no se envía, por buena que sea la sesión', () => {
    dialogo.sesion = sesion();
    dialogo.comparacion = null;
    expect(dialogo.puedeEnviarYa()).toBe(false);
  });

  it('sin haber comprobado la sesión no se envía, aunque la comparación cuadre', () => {
    // Este es el caso que motivó el paso 1: la comparación puede cuadrar perfectamente y el envío
    // rechazarse por un permiso de transición que se podía haber consultado antes — y ese rechazo
    // llega DESPUÉS de pulsar lo irreversible.
    dialogo.comparacion = comparacion();
    dialogo.sesion = null;
    expect(dialogo.puedeEnviarYa()).toBe(false);
  });

  it('con la sesión viva pero la transición NO concedida tampoco se envía', () => {
    dialogo.comparacion = comparacion();
    dialogo.sesion = sesion({ transicionPermitida: false });
    expect(dialogo.puedeEnviarYa()).toBe(false);
  });

  it('con los dos pasos en verde sí se envía', () => {
    dialogo.comparacion = comparacion();
    dialogo.sesion = sesion();
    expect(dialogo.puedeEnviarYa()).toBe(true);
  });

  it('poner al día algo ya aplicado no exige la sesión: no manda nada', () => {
    // Calimaco ya lo tiene en destino; el paso 3 solo actualiza nuestra fila. Exigir el permiso de
    // una transición que no se va a pedir dejaría la operación atascada sin motivo.
    dialogo.comparacion = comparacion({ yaAplicado: true });
    dialogo.sesion = null;
    expect(dialogo.puedeEnviarYa()).toBe(true);
  });

  it('en OFFLINE se deja pasar: no hay credencial que comprobar', () => {
    // En OFFLINE no sale ninguna petición, así que el paso 1 no puede dar verde nunca. Exigirlo
    // dejaría el flujo sin poder recorrerse ni en seco.
    dialogo.comparacion = comparacion({ modo: 'OFFLINE' });
    dialogo.sesion = null;
    expect(dialogo.puedeEnviarYa()).toBe(true);
  });

  // ── la tira de estado ──────────────────────────────────────────────────────────────────────

  it('los cuatro pasos arrancan vacíos', () => {
    const p = dialogo.pasos();
    expect(p.map((x) => x.n)).toEqual([1, 2, 3, 4]);
    expect(p.map((x) => x.titulo)).toEqual(['Sesión', 'Datos', 'Envío', 'Verificado']);
    expect(p.every((x) => x.estado === 'vacio')).toBe(true);
  });

  it('una sesión que entra pero no puede la transición sale en rojo, no en verde', () => {
    dialogo.sesion = sesion({ transicionPermitida: false });
    expect(dialogo.pasos()[0].estado).toBe('falla');
  });

  it('un envío SIMULADO no es ni logro ni fallo', () => {
    // No se intentó de verdad, así que marcarlo en verde diría que el pago cambió —no cambió— y en
    // rojo diría que algo salió mal —no salió mal—.
    dialogo.comparacion = comparacion({ simulada: true, modo: 'SIMULACION' });
    expect(dialogo.pasos()[2].estado).toBe('curso');
  });

  it('aceptado pero sin verificar es un FALLO del paso 3', () => {
    // Es el caso que la verificación existe para atrapar: Calimaco aceptó la petición y al releer el
    // pago no confirma el estado nuevo. La operación no avanza y no se reintenta el envío.
    dialogo.comparacion = comparacion({ aplicada: true, verificado: false });
    expect(dialogo.pasos()[2].estado).toBe('falla');
  });

  it('el paso 4 solo es verde si los DOS sistemas coinciden', () => {
    // Calimaco en destino pero nuestra fila sin informar es exactamente el estado que hay que poder
    // ver, y no es un éxito.
    dialogo.estado = { enDestino: true, operacionInformada: false, coherente: false, motivos: [] };
    expect(dialogo.pasos()[3].estado).toBe('falla');

    dialogo.estado = { enDestino: true, operacionInformada: true, coherente: true, motivos: [] };
    expect(dialogo.pasos()[3].estado).toBe('ok');
  });

  it('mientras una llamada está en curso, su paso lo dice', () => {
    dialogo.verificandoSesion = true;
    dialogo.comparando = true;
    dialogo.informando = true;
    dialogo.verificandoEstado = true;
    expect(dialogo.pasos().map((x) => x.estado)).toEqual(['curso', 'curso', 'curso', 'curso']);
  });
});
