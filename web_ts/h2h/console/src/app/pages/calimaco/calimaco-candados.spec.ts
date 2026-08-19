import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CalimacoViewComponent } from './calimaco-view.component';
import type {
  ConfiguracionCalimaco,
  EndpointCalimaco,
  GuardarCalimaco,
  ModoCalimaco,
  NombreEndpoint,
} from './inter-calimaco';

/**
 * Los tres frenos de la integración con Calimaco, y la contraseña que no vuelve.
 *
 * <h3>Por qué se prueba el «estado efectivo» y no los interruptores</h3>
 *
 * <p>Que la organización esté encendida no significa que se avise: la plataforma puede tener el
 * candado echado y el modo puede ser OFFLINE. Quien mira esta pantalla pregunta «¿esto está
 * llamando a Calimaco?», y solo el cruce de los tres responde. Si algún día uno de los frenos deja
 * de contar, es aquí donde se nota.</p>
 */
describe('CalimacoViewComponent', () => {
  type Interna = {
    setConfig: (c: ConfiguracionCalimaco) => void;
    modo: { (): ModoCalimaco; set: (v: ModoCalimaco) => void };
    endpoints: () => Array<EndpointCalimaco & { password: string }>;
    bloqueadoPorPlataforma: () => boolean;
    efecto: () => string;
    motivoNoGuardable: () => string | null;
    configurados: () => number;
    confirmandoReal: () => boolean;
    onModo: (e: Event) => void;
    confirmarReal: () => void;
    onCampoEndpoint: (n: NombreEndpoint, campo: string, e: Event) => void;
    agregarPar: (n: NombreEndpoint, lista: 'cabeceras' | 'parametros') => void;
    quitarPar: (n: NombreEndpoint, lista: 'cabeceras' | 'parametros', i: number) => void;
    onGuardar: () => void;
    guardar: (v: GuardarCalimaco) => void;
  };

  let vista: Interna;

  function endpoint(
    nombre: NombreEndpoint,
    over: Partial<EndpointCalimaco> = {}
  ): EndpointCalimaco {
    return {
      nombre,
      url: `https://api.example.com/api/admin/${nombre.toLowerCase()}`,
      metodo: 'POST',
      contentType: nombre === 'LOTE' ? 'multipart/form-data'
        : 'application/x-www-form-urlencoded',
      tienePassword: false,
      cabeceras: [],
      parametros: [],
      ...over,
    };
  }

  function config(over: Partial<ConfiguracionCalimaco> = {}): ConfiguracionCalimaco {
    return {
      habilitado: true,
      modo: 'REAL',
      estadoOrigen: 'ACCEPTED',
      estadoDestino: 'PROCESSED',
      timeoutSegundos: 30,
      plataforma: { habilitado: true, forzarApagado: false, motivo: null },
      endpoints: [
        endpoint('LOGIN', {
          tienePassword: true,
          parametros: [{ nombre: 'usuario', valor: 'svc' }, { nombre: 'company', valor: 'ACP' }],
          cabeceras: [{ nombre: 'user-agent', valor: 'acitypay' }],
        }),
        endpoint('TRANSICIONES'),
        endpoint('REPORTE', { parametros: [{ nombre: 'reporte', valor: 'payouts_cashflow' }] }),
        endpoint('LOTE'),
      ],
      ...over,
    };
  }

  function eventoSelect(valor: string): Event {
    return { target: { value: valor } } as unknown as Event;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(CalimacoViewComponent);
    vista = fixture.componentInstance as unknown as Interna;
  });

  describe('estado efectivo', () => {
    it('el candado de plataforma manda aunque la organización esté encendida en REAL', () => {
      vista.setConfig(
        config({ plataforma: { habilitado: true, forzarApagado: true, motivo: 'pendiente de QA' } })
      );
      expect(vista.bloqueadoPorPlataforma()).toBe(true);
      expect(vista.efecto()).toContain('plataforma');
    });

    it('la plataforma sin habilitar también bloquea', () => {
      vista.setConfig(config({ plataforma: { habilitado: false, forzarApagado: false } }));
      expect(vista.bloqueadoPorPlataforma()).toBe(true);
    });

    it('encendida en OFFLINE no llama: es la diferencia que nadie debe confundir', () => {
      vista.setConfig(config({ modo: 'OFFLINE' }));
      expect(vista.bloqueadoPorPlataforma()).toBe(false);
      expect(vista.efecto()).toContain('OFFLINE');
    });

    it('solo con los tres a favor se avisa de verdad', () => {
      vista.setConfig(config());
      expect(vista.efecto()).toContain('ACTIVO');
    });
  });

  describe('paso a REAL', () => {
    it('no cambia el modo hasta confirmarlo', () => {
      vista.setConfig(config({ modo: 'OFFLINE' }));
      vista.onModo(eventoSelect('REAL'));
      expect(vista.confirmandoReal()).toBe(true);
      expect(vista.modo()).toBe('OFFLINE');
      vista.confirmarReal();
      expect(vista.modo()).toBe('REAL');
    });

    it('bajar de REAL no pide confirmación: frenar siempre es seguro', () => {
      vista.setConfig(config({ modo: 'REAL' }));
      vista.onModo(eventoSelect('OFFLINE'));
      expect(vista.confirmandoReal()).toBe(false);
      expect(vista.modo()).toBe('OFFLINE');
    });
  });

  describe('los cuatro endpoints', () => {
    it('se pintan los cuatro aunque el backend devuelva menos', () => {
      // Uno que falte es justo el que hay que poder configurar.
      vista.setConfig(config({ endpoints: [endpoint('LOGIN', { tienePassword: true,
        parametros: [{ nombre: 'usuario', valor: 'svc' }] })] }));
      expect(vista.endpoints().map((e) => e.nombre))
        .toEqual(['LOGIN', 'TRANSICIONES', 'REPORTE', 'LOTE']);
      expect(vista.configurados()).toBe(1);
    });

    it('cada uno guarda su content-type: el lote no es urlencoded', () => {
      vista.setConfig(config());
      const lote = vista.endpoints().find((e) => e.nombre === 'LOTE');
      const login = vista.endpoints().find((e) => e.nombre === 'LOGIN');
      expect(lote!.contentType).toBe('multipart/form-data');
      expect(login!.contentType).toBe('application/x-www-form-urlencoded');
    });

    it('editar un endpoint no toca los otros', () => {
      vista.setConfig(config());
      vista.onCampoEndpoint('LOTE', 'url', eventoSelect('https://otra.example.com/lote'));
      const lote = vista.endpoints().find((e) => e.nombre === 'LOTE');
      const login = vista.endpoints().find((e) => e.nombre === 'LOGIN');
      expect(lote!.url).toBe('https://otra.example.com/lote');
      expect(login!.url).toContain('/login');
    });
  });

  describe('contraseña', () => {
    it('no se precarga: el backend no la devuelve, solo dice que existe', () => {
      vista.setConfig(config());
      const login = vista.endpoints().find((e) => e.nombre === 'LOGIN');
      expect(login!.tienePassword).toBe(true);
      expect(login!.password).toBe('');
      expect(vista.motivoNoGuardable()).toBeNull();
    });

    it('vacía viaja como undefined para no borrar la guardada', () => {
      vista.setConfig(config());
      let enviado: GuardarCalimaco | null = null;
      vista.guardar = (v) => { enviado = v; };
      vista.onGuardar();
      expect(enviado).not.toBeNull();
      const login = enviado!.endpoints.find((e) => e.nombre === 'LOGIN');
      expect(login!.password).toBeUndefined();
    });

    it('se exige cuando no hay ninguna guardada', () => {
      vista.setConfig(config({ endpoints: [endpoint('LOGIN', {
        tienePassword: false, parametros: [{ nombre: 'usuario', valor: 'svc' }] })] }));
      expect(vista.motivoNoGuardable()).toContain('contraseña');
      vista.onCampoEndpoint('LOGIN', 'password', eventoSelect('secreta'));
      expect(vista.motivoNoGuardable()).toBeNull();
    });
  });

  describe('pares clave/valor', () => {
    it('se pueden quitar, y la lista completa es lo que se guarda', () => {
      vista.setConfig(config());
      vista.agregarPar('LOGIN', 'cabeceras');
      expect(vista.endpoints().find((e) => e.nombre === 'LOGIN')!.cabeceras.length).toBe(2);
      vista.quitarPar('LOGIN', 'cabeceras', 0);
      expect(vista.endpoints().find((e) => e.nombre === 'LOGIN')!.cabeceras.map((c) => c.nombre))
        .toEqual(['']);

      let enviado: GuardarCalimaco | null = null;
      vista.guardar = (v) => { enviado = v; };
      vista.onGuardar();
      // La vacía no viaja: el backend usa el nombre como clave del secreto.
      expect(enviado!.endpoints.find((e) => e.nombre === 'LOGIN')!.cabeceras).toEqual([]);
    });
  });

  it('sin URL de login no se guarda', () => {
    vista.setConfig(config({ endpoints: [endpoint('LOGIN', {
      url: '', tienePassword: true, parametros: [{ nombre: 'usuario', valor: 'svc' }] })] }));
    expect(vista.motivoNoGuardable()).toContain('login');
  });

  it('sin usuario en los parámetros del login tampoco', () => {
    vista.setConfig(config({ endpoints: [endpoint('LOGIN', { tienePassword: true })] }));
    expect(vista.motivoNoGuardable()).toContain('usuario');
  });
});
