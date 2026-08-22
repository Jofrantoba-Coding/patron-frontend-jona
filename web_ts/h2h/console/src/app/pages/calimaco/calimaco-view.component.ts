import { ChangeDetectionStrategy, Component, computed, signal, type WritableSignal } from '@angular/core';
import { JBadge, JButton, JCard, JCardContent, JCardHeader, JCardTitle, JSectionHeading } from 'uijona-4ngular';
import {
  DESCRIPCION_ENDPOINT,
  DESCRIPCION_MODO,
  ENDPOINTS_CALIMACO,
  MODOS_CALIMACO,
  ESTRATEGIAS_CALIMACO,
  DESCRIPCION_ESTRATEGIA,
  type ConfiguracionCalimaco,
  type EndpointCalimaco,
  type GuardarCalimaco,
  type GuardarEndpoint,
  type GuardarInterruptorCalimaco,
  type ConsultaCalimacoConfig,
  type EstrategiaConsultaCalimaco,
  type GuardarConsultaCalimaco,
  type ModoCalimaco,
  type NombreEndpoint,
} from './inter-calimaco';

/** Un endpoint tal como se edita: todo texto, más la contraseña nueva si se escribió una. */
interface EndpointEditable extends EndpointCalimaco {
  /** Vacía significa «no la cambies». Nunca se precarga: el backend no la devuelve. */
  password: string;
}

/**
 * Vista de la integración con Calimaco, el sistema de Casino Atlantic City.
 *
 * <h3>Qué se edita aquí</h3>
 *
 * <p>Los cuatro endpoints de su API, cada uno con su receta completa —método, URL, content-type,
 * cabeceras y parámetros— y la credencial de la cuenta de servicio, que solo lleva el de login. Todo
 * eso viaja al backend y de ahí a Vault, un secreto por endpoint en la ruta que espeja su ruta HTTP:
 * <b>ningún valor de credencial se guarda en la base de datos</b>, y la contraseña no vuelve nunca —
 * el backend manda `tienePassword` en su lugar.</p>
 *
 * <h3>Por qué se muestra el candado de plataforma</h3>
 *
 * <p>No es editable desde aquí. Pero sin verlo, quien enciende su organización y no ve efecto no
 * tiene forma de saber por qué: el aviso está apagado un nivel más arriba.</p>
 */
@Component({
  selector: 'app-calimaco-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JCard, JCardHeader, JCardTitle, JCardContent, JBadge, JButton],
  templateUrl: './calimaco-view.component.html',
})
export class CalimacoViewComponent {
  protected readonly MODOS = MODOS_CALIMACO;
  protected readonly ESTRATEGIAS = ESTRATEGIAS_CALIMACO;
  protected readonly DESCRIPCION_ESTRATEGIA = DESCRIPCION_ESTRATEGIA;
  protected readonly DESCRIPCION_MODO = DESCRIPCION_MODO;
  protected readonly DESCRIPCION_ENDPOINT = DESCRIPCION_ENDPOINT;

  protected readonly config = signal<ConfiguracionCalimaco | null>(null);
  protected readonly cargando = signal(false);
  protected readonly aviso = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  // ── el formulario, en señales sueltas para poder comparar con lo guardado ──
  protected readonly habilitado = signal(false);
  protected readonly modo = signal<ModoCalimaco>('OFFLINE');
  protected readonly endpoints = signal<EndpointEditable[]>([]);
  protected readonly estadoOrigen = signal('');
  protected readonly estadoDestino = signal('');
  protected readonly timeout = signal(30);

  protected readonly candado = computed(() => this.config()?.plataforma ?? null);

  // ── Con qué alcance se busca el pago (CALIMACO#API#CONSULTA) ──────────────
  //
  // Panel propio, como el interruptor: no pasa por Vault, escribe una fila de tm_orcon y responde a
  // una pregunta distinta. El interruptor dice SI se avisa; esto, CÓMO se busca el pago que se va a
  // avisar — y de ello depende lo que el job encuentra.
  protected readonly consulta = signal<ConsultaCalimacoConfig | null>(null);
  protected readonly estrategia = signal<EstrategiaConsultaCalimaco>('OPERACION');
  protected readonly diasVentana = signal(7);
  protected readonly guardandoConsulta = signal(false);

  protected setConsulta(data: ConsultaCalimacoConfig): void {
    this.consulta.set(data);
    this.estrategia.set(data.estrategia);
    this.diasVentana.set(data.diasVentana);
  }

  protected onEstrategia(evento: Event): void {
    this.estrategia.set((evento.target as HTMLSelectElement).value as EstrategiaConsultaCalimaco);
  }

  protected onDiasVentana(evento: Event): void {
    this.diasVentana.set(Number((evento.target as HTMLInputElement).value));
  }

  /** ¿Hay algo que escribir? Sin cambios, el botón no invita a guardar. */
  protected readonly consultaCambiada = computed<boolean>(() => {
    const guardada = this.consulta();
    if (!guardada) return false;
    return this.estrategia() !== guardada.estrategia || this.diasVentana() !== guardada.diasVentana;
  });

  /**
   * Por qué no se puede guardar, o `null`.
   *
   * <p>Espeja el rango que valida el backend —que rechaza en vez de recortar— para que el motivo se
   * lea aquí en lugar de volver como un 422.</p>
   */
  protected readonly motivoNoGuardarConsulta = computed<string | null>(() => {
    if (this.estrategia() !== 'FECHAS') return null;
    const maximo = this.consulta()?.maximoDiasVentana ?? 90;
    const dias = this.diasVentana();
    if (!Number.isFinite(dias) || dias < 1 || dias > maximo) {
      return `La ventana debe estar entre 1 y ${maximo} días. Para mirar más atrás, consulte por`
        + ' operación.';
    }
    return null;
  });

  /**
   * Qué va a pasar con esta elección, dicho entero.
   *
   * <p>La descripción de la estrategia no basta: lo que importa es la consecuencia sobre el job,
   * que es quien corre solo y quien deja de encontrar cosas.</p>
   */
  protected readonly efectoConsulta = computed<string>(() => {
    if (this.estrategia() === 'OPERACION') {
      return 'El job preguntará por cada operación. Encuentra pagos antiguos, ya aplicados o de'
        + ' otro banco, a cambio de una llamada por operación.';
    }
    return `El job barrerá los últimos ${this.diasVentana()} día(s) por moneda. Lo que quede fuera`
      + ' de esa ventana —o esté ya aplicado, o sea de otra entidad— lo verá como ausente y no lo'
      + ' informará.';
  });

  protected onGuardarConsulta(): void {
    if (!this.consultaCambiada() || this.motivoNoGuardarConsulta()) return;
    this.guardarConsulta({ estrategia: this.estrategia(), diasVentana: this.diasVentana() });
  }

  /**
   * ¿La plataforma permite avisar?
   *
   * <p>Con el candado echado, nada de lo que se configure aquí llega a ejecutarse. Se dice
   * explícitamente en vez de dejar que el operador lo descubra por ausencia de efecto.</p>
   */
  protected readonly bloqueadoPorPlataforma = computed(() => {
    const c = this.candado();
    if (!c) return false;
    return c.forzarApagado || !c.habilitado;
  });

  /**
   * Qué va a pasar de verdad, cruzando los tres frenos.
   *
   * <p>Es la única frase que responde «¿esto está funcionando?», que es lo que alguien viene a
   * mirar. Los tres estados por separado no la responden.</p>
   */
  protected readonly efecto = computed<string>(() => {
    if (this.bloqueadoPorPlataforma()) {
      return 'La plataforma tiene el aviso bloqueado: no se llama a Calimaco.';
    }
    if (!this.habilitado()) {
      return 'La organización tiene el aviso apagado: no se llama a Calimaco.';
    }
    if (this.modo() === 'OFFLINE') {
      return 'Encendido en OFFLINE: no sale ninguna petición y ninguna operación avanza.';
    }
    if (this.modo() === 'SIMULACION') {
      return 'Encendido en SIMULACIÓN: se comprueban credenciales y permisos, pero no se cambia'
        + ' ningún pago.';
    }
    return 'ACTIVO: los pagos confirmados se marcarán como pagados en Calimaco.';
  });

  /** El paso a REAL se confirma aparte: es el único que toca datos de un tercero. */
  protected readonly confirmandoReal = signal(false);

  protected setConfig(data: ConfiguracionCalimaco): void {
    this.config.set(data);
    this.habilitado.set(data.habilitado === true);
    this.modo.set(data.modo ?? 'OFFLINE');
    this.estadoOrigen.set(data.estadoOrigen ?? '');
    this.estadoDestino.set(data.estadoDestino ?? '');
    this.timeout.set(data.timeoutSegundos ?? 30);

    // Los cuatro siempre, en el orden del flujo: uno que el backend no devuelva es justo el que hay
    // que poder configurar, así que se pinta vacío en vez de desaparecer.
    const porNombre = new Map((data.endpoints ?? []).map((e) => [e.nombre, e]));
    this.endpoints.set(
      ENDPOINTS_CALIMACO.map((nombre) => {
        const e = porNombre.get(nombre);
        return {
          nombre,
          secretRef: e?.secretRef,
          metodo: e?.metodo ?? 'POST',
          url: e?.url ?? '',
          contentType: e?.contentType ?? '',
          tienePassword: e?.tienePassword === true,
          cabeceras: [...(e?.cabeceras ?? [])],
          parametros: [...(e?.parametros ?? [])],
          // La contraseña NO se precarga. Si se rellenara con un valor falso —los típicos puntos—
          // acabaría guardándose ese valor el día que alguien pulse guardar sin tocarla.
          password: '',
        };
      })
    );
    this.confirmandoReal.set(false);
  }

  protected onTexto(destino: WritableSignal<string>, evento: Event): void {
    destino.set((evento.target as HTMLInputElement).value);
  }

  protected onNumero(destino: WritableSignal<number>, evento: Event): void {
    const valor = Number((evento.target as HTMLInputElement).value);
    destino.set(Number.isFinite(valor) && valor > 0 ? valor : 30);
  }

  protected onModo(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value as ModoCalimaco;
    // Pasar a REAL pide confirmación; bajar de REAL no. La asimetría es deliberada: frenar
    // siempre es seguro, y es soltar el freno lo que merece un segundo pensamiento.
    if (valor === 'REAL' && !this.confirmandoReal()) {
      this.confirmandoReal.set(true);
      return;
    }
    this.confirmandoReal.set(false);
    this.modo.set(valor);
  }

  protected confirmarReal(): void {
    this.confirmandoReal.set(false);
    this.modo.set('REAL');
  }

  protected cancelarReal(): void {
    this.confirmandoReal.set(false);
  }

  protected toggleHabilitado(evento: Event): void {
    this.habilitado.set((evento.target as HTMLSelectElement).value === 'true');
  }

  // ── edición de un endpoint ─────────────────────────────────────────────────
  protected onCampoEndpoint(
    nombre: NombreEndpoint,
    campo: 'metodo' | 'url' | 'contentType' | 'password',
    evento: Event
  ): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.endpoints.update((lista) =>
      lista.map((e) => (e.nombre === nombre ? { ...e, [campo]: valor } : e))
    );
  }

  protected onPar(
    nombre: NombreEndpoint,
    lista: 'cabeceras' | 'parametros',
    indice: number,
    campo: 'nombre' | 'valor',
    evento: Event
  ): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.endpoints.update((todos) =>
      todos.map((e) =>
        e.nombre === nombre
          ? {
              ...e,
              [lista]: e[lista].map((p, i) => (i === indice ? { ...p, [campo]: valor } : p)),
            }
          : e
      )
    );
  }

  protected agregarPar(nombre: NombreEndpoint, lista: 'cabeceras' | 'parametros'): void {
    this.endpoints.update((todos) =>
      todos.map((e) =>
        e.nombre === nombre ? { ...e, [lista]: [...e[lista], { nombre: '', valor: '' }] } : e
      )
    );
  }

  protected quitarPar(
    nombre: NombreEndpoint,
    lista: 'cabeceras' | 'parametros',
    indice: number
  ): void {
    this.endpoints.update((todos) =>
      todos.map((e) =>
        e.nombre === nombre ? { ...e, [lista]: e[lista].filter((_, i) => i !== indice) } : e
      )
    );
  }

  /** El de login, que es el único con credencial. Se consulta para validar. */
  protected readonly login = computed(() => this.endpoints().find((e) => e.nombre === 'LOGIN'));

  /** Cuántos de los cuatro tienen URL. Un endpoint sin ella no se puede llamar. */
  protected readonly configurados = computed(
    () => this.endpoints().filter((e) => (e.url ?? '').trim()).length
  );

  /** El `usuario` vive entre los parámetros del secreto de login, no en un campo aparte. */
  protected usuarioDe(endpoint: EndpointEditable): string {
    return (endpoint.parametros.find((p) => p.nombre === 'usuario')?.valor ?? '').trim();
  }

  /**
   * Por qué no se puede guardar todavía, o `null`.
   *
   * <p>Solo se exige lo del login: las demás URLs se comprueban cuando se usan, y bloquear el
   * guardado por la del reporte impediría dejar configurado lo que sí se sabe.</p>
   */
  protected readonly motivoNoGuardable = computed<string | null>(() => {
    const login = this.login();
    if (!login) return 'No se ha cargado la configuración.';
    if (!(login.url ?? '').trim()) return 'Indique la URL del login.';
    if (!this.usuarioDe(login)) return 'Indique el usuario de la cuenta de servicio en el login.';
    if (!login.tienePassword && !login.password.trim()) {
      return 'Indique la contraseña del login: no hay ninguna guardada todavía.';
    }
    for (const e of this.endpoints()) {
      const huerfano = [...e.cabeceras, ...e.parametros].some(
        (p) => !p.nombre.trim() && p.valor.trim()
      );
      if (huerfano) return `Hay una clave con valor pero sin nombre en ${e.nombre}.`;
    }
    return null;
  });

  /**
   * ¿El interruptor de pantalla difiere de lo guardado?
   *
   * <p>Gobierna su boton: sin cambios no hay nada que escribir, y un boton que siempre invita a
   * guardar hace dudar de si el cambio anterior cuajo.</p>
   */
  protected readonly interruptorCambiado = computed<boolean>(() => {
    const guardado = this.config();
    if (!guardado) return false;
    return this.habilitado() !== (guardado.habilitado === true) || this.modo() !== guardado.modo;
  });

  /**
   * Guarda solo encendido y modo.
   *
   * <p>Mientras la confirmacion de REAL esta abierta no se guarda: `modo()` sigue teniendo el valor
   * anterior —eso es lo que hace que el selector vuelva atras— y escribirlo ahora persistiria
   * justamente lo que el operador acaba de intentar cambiar.</p>
   */
  protected onGuardarInterruptor(): void {
    if (this.confirmandoReal() || !this.interruptorCambiado()) return;
    this.guardarInterruptor({ habilitado: this.habilitado(), modo: this.modo() });
  }

  protected onGuardar(): void {
    if (this.motivoNoGuardable()) return;
    const valor: GuardarCalimaco = {
      // Sin `habilitado` ni `modo`: los guarda su propio panel, contra un endpoint que no toca
      // Vault. Mandarlos aqui tambien los dejaria con dos escritores y una pulsacion de este boton
      // podria reafirmar en silencio un switch que nadie vino a cambiar.
      estadoOrigen: this.estadoOrigen().trim() || undefined,
      estadoDestino: this.estadoDestino().trim() || undefined,
      timeoutSegundos: this.timeout(),
      endpoints: this.endpoints().map((e) => this.aGuardar(e)),
    };
    this.guardar(valor);
  }

  private aGuardar(e: EndpointEditable): GuardarEndpoint {
    return {
      nombre: e.nombre,
      metodo: (e.metodo ?? '').trim() || undefined,
      url: (e.url ?? '').trim() || undefined,
      contentType: (e.contentType ?? '').trim() || undefined,
      // Vacía = no tocarla. Mandar "" borraría la credencial guardada.
      password: e.password.trim() || undefined,
      cabeceras: e.cabeceras.filter((p) => p.nombre.trim()),
      parametros: e.parametros.filter((p) => p.nombre.trim()),
    };
  }

  /** La Page sobrescribe estos hooks. */
  protected cargar(): void {}
  protected guardar(_valor: GuardarCalimaco): void {}
  protected guardarInterruptor(_valor: GuardarInterruptorCalimaco): void {}
  protected guardarConsulta(_valor: GuardarConsultaCalimaco): void {}
}
