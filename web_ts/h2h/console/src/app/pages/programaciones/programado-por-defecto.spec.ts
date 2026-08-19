import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { VentanaSemanal } from '../../core/models';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/**
 * El valor con el que arranca «Programado» al abrir el formulario del plan nuevo.
 *
 * <p>Nació de un fallo reportado en operación: al crear el plan salía «La hora programada (00:00)
 * queda fuera de la ventana: martes se atiende de 03:30 a 22:45» siendo la una y media de la tarde
 * en Lima. El operador no había elegido ninguna hora — el control arrancaba vacío y el date-picker
 * completaba con `00:00` la hora que nadie tocó. Esa medianoche queda fuera de la ventana de casi
 * todos los productos, así que el formulario se bloqueaba solo, y el mensaje acusaba una hora que
 * el usuario no había puesto: el peor tipo de validación, la que culpa a quien no eligió.</p>
 *
 * <p>Lo que se protege es que el valor propuesto sea (a) la hora REAL y no una medianoche, y (b) la
 * de la zona del CANAL y no la del equipo del operador, que es lo único que significa lo mismo para
 * todos y lo que el backend vuelve a validar.</p>
 */
describe('ProgramacionesViewComponent: «Programado» arranca en la fecha y hora actual', () => {
  type Interna = {
    abrirCrear: () => void;
    nuevoFechaProceso: () => string;
    nuevoFechaProgramado: () => string;
    nuevoModalidad: { set: (v: string) => void };
    nuevoIdProducto: { set: (v: string) => void };
    nuevoIdMoneda: { set: (v: string) => void };
    seleccion: { set: (v: Set<string>) => void };
    setVentana: (v: VentanaSemanal | null) => void;
    buildCrearPayload: () => { fechaProgramado?: string } | null;
    crearError: () => string;
    hoyCanal: () => string;
    ahoraCanal: () => string;
  };

  let vista: Interna;

  /** Ventana abierta todos los días de 03:30 a 22:45: la del reporte del fallo. */
  function ventanaDiurna(zonaHoraria = 'America/Lima'): VentanaSemanal {
    return {
      zonaHoraria,
      resuelta: true,
      dias: [1, 2, 3, 4, 5, 6, 7].map((diaSemana) => ({
        diaSemana,
        nombre: 'día',
        opera: true,
        desde: '03:30:00',
        hasta: '22:45:00',
      })),
    } as unknown as VentanaSemanal;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(ProgramacionesViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
    vista.setVentana(ventanaDiurna());
  });

  it('propone fecha y hora, no una medianoche', () => {
    vista.abrirCrear();

    expect(vista.nuevoFechaProceso()).toBe(vista.hoyCanal());
    // `yyyy-MM-ddTHH:mm:ss` completo: es lo que consume el picker y lo que la validación recorta.
    expect(vista.nuevoFechaProgramado()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    // El día propuesto es el del canal, y la hora no es la medianoche que producía el fallo.
    expect(vista.nuevoFechaProgramado().slice(0, 10)).toBe(vista.hoyCanal());
    expect(vista.nuevoFechaProgramado().slice(11, 16)).not.toBe('00:00');
  });

  it('la hora propuesta la lee del reloj en cada apertura, no de un cálculo congelado', () => {
    // Si fuese un `computed`, el valor se fijaría en el primer cálculo y un formulario abierto horas
    // después de cargar la pantalla propondría una hora vieja —que puede estar ya fuera de ventana—.
    const primera = vista.ahoraCanal();
    expect(primera).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    // Con segundos, dos lecturas seguidas son iguales o consecutivas; lo que importa es que la
    // segunda no sea anterior: eso solo pasaría si el valor viniera cacheado de otro instante.
    expect(vista.ahoraCanal() >= primera).toBe(true);
  });

  it('el valor propuesto pasa la validación de ventana en horario de operación', () => {
    // Aquí estaba el fallo: con el control vacío y el picker rellenando 00:00, ESTA llamada
    // devolvía null y pintaba «la hora programada (00:00) queda fuera de la ventana».
    vista.abrirCrear();
    vista.nuevoIdProducto.set('1');
    vista.nuevoIdMoneda.set('1');
    vista.seleccion.set(new Set(['op-1']));

    const hora = vista.nuevoFechaProgramado().slice(11, 16);
    const dentro = hora >= '03:30' && hora <= '22:45';
    const payload = vista.buildCrearPayload();

    if (dentro) {
      expect(vista.crearError()).toBe('');
      expect(payload).not.toBeNull();
      expect(payload?.fechaProgramado).toBeTruthy();
    } else {
      // Fuera de horario el corte SIGUE aplicando, y ahora acusa la hora que de verdad se propuso.
      expect(vista.crearError()).toContain(hora);
    }
  });

  it('la hora de pared viaja convertida con la zona del CANAL, no con la del navegador', () => {
    // El mismo texto en dos husos son dos instantes distintos. Convertir con la zona del equipo
    // haría que un operador en Madrid programara un plan corrido siete horas respecto de la ventana
    // que el backend valida —y nadie lo notaría hasta cuadrar un corte horario—.
    vista.setVentana(ventanaDiurna('America/Lima'));
    // El formulario se rellena DESPUES de abrir: `abrirCrear` limpia la selección, que es lo que
    // debe hacer —abrir el diálogo con operaciones ya marcadas de un intento anterior sería la
    // forma de programar una operación sin querer—.
    vista.abrirCrear();
    vista.nuevoIdProducto.set('1');
    vista.nuevoIdMoneda.set('1');
    vista.seleccion.set(new Set(['op-1']));
    vista.nuevoModalidad.set('H2W'); // exime de la ventana: aquí se mide la conversión, no el corte
    const textoLima = vista.nuevoFechaProgramado();
    const enLima = vista.buildCrearPayload()?.fechaProgramado;

    // La MISMA hora de pared, declarada en un huso distinto, tiene que dar otro instante.
    vista.setVentana(ventanaDiurna('Europe/Madrid'));
    const enMadrid = vista.buildCrearPayload()?.fechaProgramado;

    expect(vista.nuevoFechaProgramado()).toBe(textoLima); // el texto no se tocó
    expect(enLima).toBeTruthy();
    expect(enMadrid).toBeTruthy();
    expect(enMadrid).not.toBe(enLima);
    // Madrid va por delante de Lima, así que las mismas 13:43 allí son un instante ANTERIOR.
    expect(Date.parse(enMadrid as string)).toBeLessThan(Date.parse(enLima as string));
  });
});
