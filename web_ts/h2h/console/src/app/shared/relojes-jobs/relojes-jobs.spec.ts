import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { RelojesJobs } from '../../core/models';
import { RelojesJobsViewComponent, type RelojPintado } from './relojes-jobs-view.component';

/**
 * Cuenta atras de los jobs.
 *
 * <p>Un reloj equivocado no rompe nada y no tiene sintoma: enseña un numero con buena pinta que
 * no se corresponde con ningun disparo real, y alguien decide con el si le da tiempo a preparar
 * un envio antes del corte. Por eso se prueban las tres formas de estar equivocado: el desfase
 * del reloj del equipo, el cron roto disfrazado de "inminente" y los jobs apagados.</p>
 */
describe('RelojesJobsViewComponent', () => {
  type Interna = {
    datos: { set: (v: RelojesJobs | null) => void };
    ahora: { set: (v: number) => void };
    desfaseMs: { set: (v: number) => void };
    relojes: () => RelojPintado[];
    todosApagados: () => boolean;
    zona: () => string;
  };

  let vista: Interna;

  /** Instante fijo para que las pruebas no dependan de cuando se ejecuten. */
  const AHORA_SERVIDOR = Date.UTC(2026, 7, 13, 19, 0, 0); // 14:00 en Lima
  const EN_90_SEGUNDOS = new Date(AHORA_SERVIDOR + 90_000).toISOString();

  function datos(parcial: Partial<RelojesJobs> = {}): RelojesJobs {
    return {
      ahora: new Date(AHORA_SERVIDOR).toISOString(),
      zona: 'America/Lima',
      environment: 'dev',
      habilitado: true,
      relojes: [
        {
          clave: 'ciclo-sftp',
          nombre: 'Ciclo SFTP',
          descripcion: 'x',
          cron: '0 0/1 * * * *',
          habilitado: true,
          proxima: EN_90_SEGUNDOS,
          faltaMs: 90_000,
          siguiente: new Date(AHORA_SERVIDOR + 150_000).toISOString(),
          periodoMs: 60_000,
        },
      ],
      ...parcial,
    };
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(RelojesJobsViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  it('cuenta lo que falta en mm:ss', () => {
    vista.datos.set(datos());
    vista.desfaseMs.set(0);
    vista.ahora.set(AHORA_SERVIDOR);

    expect(vista.relojes()[0].restante).toBe('01:30');
    expect(vista.relojes()[0].estado).toBe('activo');
  });

  it('CORRIGE el reloj del equipo: un navegador adelantado no adelanta el disparo', () => {
    // El equipo va 3 minutos adelantado. Sin corregir, la cuenta atras marcaria 0 y el operador
    // creeria que el job ya se disparo — tres minutos antes de que ocurra.
    vista.datos.set(datos());
    const desfase = 180_000;
    vista.desfaseMs.set(desfase);
    vista.ahora.set(AHORA_SERVIDOR + desfase);

    expect(vista.relojes()[0].restante).toBe('01:30');
  });

  it('AL LLEGAR A CERO se reinicia hacia el disparo siguiente, como el scheduler', () => {
    // Sin esto el reloj se quedaria clavado en 00:00 hasta la recarga del backend: con un cron
    // de un minuto, dos minutos parado justo cuando el operador lo esta mirando.
    vista.datos.set(datos());
    vista.desfaseMs.set(0);

    // Justo antes del disparo.
    vista.ahora.set(AHORA_SERVIDOR + 89_000);
    expect(vista.relojes()[0].restante).toBe('00:01');

    // Un segundo despues: ya cuenta hacia el siguiente (150s - 91s = 59s).
    vista.ahora.set(AHORA_SERVIDOR + 91_000);
    expect(vista.relojes()[0].restante).toBe('00:59');
  });

  it('tras varios ciclos dormida, rueda hasta el disparo que toca ahora', () => {
    // Una pestaña abierta toda la noche: se salta de golpe a la ocurrencia correcta en vez de
    // quedarse en la primera que ya paso.
    vista.datos.set(datos());
    vista.desfaseMs.set(0);
    // Disparos en 90, 150, 210, 270, 330, 390... A los 335s el que toca es el de 390: faltan 55s.
    vista.ahora.set(AHORA_SERVIDOR + 335_000);

    expect(vista.relojes()[0].restante).toBe('00:55');
  });

  it('sin periodo no inventa un salto: espera a la recarga', () => {
    vista.datos.set(
      datos({
        relojes: [
          {
            ...datos().relojes[0],
            siguiente: null,
            periodoMs: null,
          },
        ],
      })
    );
    vista.desfaseMs.set(0);
    vista.ahora.set(AHORA_SERVIDOR + 200_000);

    // Se queda en 00:00 —nunca negativo— y la recarga del backend lo corrige.
    expect(vista.relojes()[0].restante).toBe('00:00');
  });

  it('pasa a horas cuando falta mas de una', () => {
    vista.datos.set(
      datos({
        relojes: [
          {
            clave: 'decision',
            nombre: 'Decisión',
            descripcion: 'x',
            cron: '0 0 6 * * *',
            habilitado: true,
            proxima: new Date(AHORA_SERVIDOR + 3 * 3600_000 + 120_000).toISOString(),
            faltaMs: 3 * 3600_000 + 120_000,
          },
        ],
      })
    );
    vista.desfaseMs.set(0);
    vista.ahora.set(AHORA_SERVIDOR);

    expect(vista.relojes()[0].restante).toBe('3h 02m');
  });

  it('un cron roto NO se muestra como 00:00', () => {
    vista.datos.set(
      datos({
        relojes: [
          {
            clave: 'ciclo-sftp',
            nombre: 'Ciclo SFTP',
            descripcion: 'x',
            cron: 'esto no es un cron',
            habilitado: true,
            proxima: null,
            faltaMs: null,
            error: 'Cron no válido: esto no es un cron',
          },
        ],
      })
    );

    const r = vista.relojes()[0];
    // 00:00 se leeria como "esta a punto de dispararse", justo lo contrario: ese job NO corre.
    expect(r.restante).toBe('—');
    expect(r.estado).toBe('roto');
    expect(r.motivo).toContain('Cron no válido');
  });

  it('con los jobs apagados lo dice, y sigue mostrando cuando tocaria', () => {
    vista.datos.set(
      datos({
        habilitado: false,
        relojes: [{ ...datos().relojes[0], habilitado: false }],
      })
    );
    vista.desfaseMs.set(0);
    vista.ahora.set(AHORA_SERVIDOR);

    expect(vista.todosApagados()).toBe(true);
    expect(vista.relojes()[0].estado).toBe('apagado');
    expect(vista.relojes()[0].motivo).toContain('apagados');
    // El "cuando tocaria" se conserva: es util para saber que se perderia si se encendieran.
    expect(vista.relojes()[0].restante).toBe('01:30');
  });

  it('la hora del proximo disparo se pinta en la zona del CANAL, no en la del navegador', () => {
    vista.datos.set(datos());
    vista.desfaseMs.set(0);
    vista.ahora.set(AHORA_SERVIDOR);

    // 19:01:30 UTC son las 14:01:30 en Lima. Si se pintara con la zona del equipo, un operador
    // en otro huso leeria una hora que no coincide con la del banco.
    expect(vista.relojes()[0].proxima).toBe('14:01:30');
  });

  it('avisa cuando un reloj vencio sin poder rodar: la Page vuelve a preguntar', () => {
    // Backend antiguo (sin `siguiente`/`periodoMs`) o cron irregular. Sin esta señal el reloj se
    // quedaria clavado en 00:00 hasta la recarga periodica: dos minutos parado.
    const vistaConSenal = vista as unknown as Interna & { hayVencido: () => boolean };
    vistaConSenal.datos.set(
      datos({ relojes: [{ ...datos().relojes[0], siguiente: null, periodoMs: null }] })
    );
    vistaConSenal.desfaseMs.set(0);

    vistaConSenal.ahora.set(AHORA_SERVIDOR);
    expect(vistaConSenal.hayVencido()).toBe(false);

    vistaConSenal.ahora.set(AHORA_SERVIDOR + 200_000);
    expect(vistaConSenal.hayVencido()).toBe(true);
  });

  it('un reloj que SI rueda no pide recarga: se reinicia solo', () => {
    const vistaConSenal = vista as unknown as Interna & { hayVencido: () => boolean };
    vistaConSenal.datos.set(datos());
    vistaConSenal.desfaseMs.set(0);
    vistaConSenal.ahora.set(AHORA_SERVIDOR + 200_000);

    expect(vistaConSenal.hayVencido()).toBe(false);
  });

  it('sin datos no inventa relojes', () => {
    vista.datos.set(null);

    expect(vista.relojes()).toEqual([]);
    expect(vista.todosApagados()).toBe(false);
  });
});
