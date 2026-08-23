import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JBadge, JProgress, JSectionHeading } from 'uijona-4ngular';
import {
  MODO_AUTOMATICO,
  MODO_MANUAL,
  type CantidadProgramable,
  type ConfiguracionJobs,
  type HorarioSubtipo,
  type InterruptorJob,
  type DiferirFueraDeVentana,
  type Reintentos,
  type RendimientoMoneda,
  type ReglaBancoSubtipo,
  type SimulacionSubtipo,
  type TramoCanal,
  type TramoSimulado,
  type VentanaCanal,
} from './inter-jobs-configuracion';

/**
 * Vista de la configuración de procesamiento automático. Estado y presentación, sin llamadas.
 *
 * <p>La pantalla tiene que dejar clara una distinción que se confunde siempre: <b>el modo de envío
 * y los interruptores no son lo mismo</b>. El modo decide con qué se sellan las operaciones al
 * ingestarlas —y por tanto qué material existe—; los interruptores deciden si los procesos corren.
 * Con el modo en MANUAL, encender los tres jobs no despacha nada.</p>
 */
@Component({
  selector: 'app-jobs-configuracion-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JBadge, JProgress],
  templateUrl: './jobs-configuracion-view.component.html',
})
export class JobsConfiguracionViewComponent {
  protected readonly config = signal<ConfiguracionJobs | null>(null);
  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);

  /** Confirmación pendiente de pasar a AUTOMATICO: el cambio hace que se despache dinero solo. */
  protected readonly confirmandoAutomatico = signal<boolean>(false);

  protected readonly MODO_AUTOMATICO = MODO_AUTOMATICO;
  protected readonly MODO_MANUAL = MODO_MANUAL;

  // ── Derivados ──────────────────────────────────────────────────────────

  /** Modo vigente. Sin valor propio, la plataforma cae a MANUAL (nunca se envía solo por defecto). */
  protected readonly modo = computed<string>(() => {
    const v = this.config()?.modoEnvio?.organizacion;
    return typeof v === 'string' && v ? v : MODO_MANUAL;
  });

  protected readonly esAutomatico = computed(() => this.modo() === MODO_AUTOMATICO);

  protected readonly interruptores = computed<{ job: string; datos: InterruptorJob }[]>(() => {
    const i = this.config()?.interruptores ?? {};
    return Object.keys(i).map((job) => ({ job, datos: i[job] }));
  });

  protected readonly cantidad = computed<CantidadProgramable>(
    () => (this.config()?.cantidadProgramable?.organizacion as CantidadProgramable) ?? {}
  );

  protected readonly cantidadPlataforma = computed<CantidadProgramable>(
    () => (this.config()?.cantidadProgramable?.plataforma as CantidadProgramable) ?? {}
  );

  /**
   * ¿Está encendido el diferido? Cascada organización → plataforma → encendido.
   *
   * <p>El defecto es encendido porque es la conducta que el sistema ya tenía: fuera de ventana el
   * job agenda a la próxima apertura. Leer un nodo ausente como «apagado» dejaría de programar por
   * una parametría que falta, que es un corte de servicio por un dato de catálogo.</p>
   */
  protected readonly diferirFueraDeVentana = computed<boolean>(() => {
    const bloque = this.config()?.diferirFueraDeVentana;
    const propio = (bloque?.organizacion as DiferirFueraDeVentana | null)?.habilitado;
    if (typeof propio === 'boolean') {
      return propio;
    }
    const plataforma = (bloque?.plataforma as DiferirFueraDeVentana | null)?.habilitado;
    return typeof plataforma === 'boolean' ? plataforma : true;
  });

  /**
   * ¿Lo decide la organización, o lo hereda de la plataforma?
   *
   * <p>Se muestra por lo mismo que en el margen de cierre: sin el contraste, un «Sí» no dice si
   * alguien lo eligió aquí o viene heredado — y de eso depende qué pasa si cambia el defecto.</p>
   */
  protected readonly diferirHeredado = computed<boolean>(() => {
    const propio = (this.config()?.diferirFueraDeVentana?.organizacion as DiferirFueraDeVentana | null)
      ?.habilitado;
    return typeof propio !== 'boolean';
  });

  /** El backend anterior no manda el bloque: sin él no se pinta el control. */
  protected readonly diferirDisponible = computed<boolean>(
    () => !!this.config()?.diferirFueraDeVentana
  );

  // ── Tope de la tanda del informe al origen ─────────────────────────────
  //
  // Vive en el mismo nodo que el interruptor del job (H2H#BCP#JOBS#INFORME_ORIGEN) pero se edita
  // aparte: aquello es un botón y esto un número que se teclea.

  /** El backend anterior no manda el bloque: sin él no se pinta el control. */
  protected readonly topeInformeDisponible = computed<boolean>(
    () => !!this.config()?.topeInformeOrigen
  );

  /** Lo que el job usará en la próxima corrida, ya resuelta la herencia. */
  protected readonly topeInformeEfectivo = computed<number>(
    () => this.config()?.topeInformeOrigen?.efectivo ?? 50
  );

  /**
   * ¿Lo decide la organización o lo hereda?
   *
   * <p>Mismo motivo que en el diferido: sin el contraste, un «50» no dice si alguien lo eligió
   * aquí o viene del defecto de plataforma — y de eso depende qué pasa si el defecto cambia.</p>
   */
  protected readonly topeInformeHeredado = computed<boolean>(
    () => typeof this.config()?.topeInformeOrigen?.organizacion?.tope !== 'number'
  );

  protected readonly topeInformeMinimo = computed<number>(
    () => this.config()?.topeInformeOrigen?.minimo ?? 1
  );

  protected readonly topeInformeMaximo = computed<number>(
    () => this.config()?.topeInformeOrigen?.maximo ?? 1000
  );

  /** Lo tecleado. Arranca en el efectivo y se resincroniza al recargar la configuración. */
  protected readonly topeInforme = signal<number | null>(null);

  /** El valor a mostrar: lo tecleado si hay algo, y si no lo que está guardado. */
  protected readonly topeInformeValor = computed<number>(
    () => this.topeInforme() ?? this.topeInformeEfectivo()
  );

  protected readonly topeInformeCambiado = computed<boolean>(
    () => this.topeInformeValor() !== this.topeInformeEfectivo()
  );

  /**
   * Por qué no se puede guardar, o `null`.
   *
   * <p>Espeja el rango que valida el backend —que rechaza en vez de recortar— para explicarlo
   * antes del viaje. El techo no es arbitrario: el barrido del origen trae 1000 filas como
   * máximo, así que una tanda mayor no cabe en una sola consulta.</p>
   */
  protected readonly motivoNoGuardarTope = computed<string | null>(() => {
    const v = this.topeInformeValor();
    if (!Number.isInteger(v) || v < this.topeInformeMinimo() || v > this.topeInformeMaximo()) {
      return `El tope debe ser un entero entre ${this.topeInformeMinimo()} y ${this.topeInformeMaximo()}.`;
    }
    return null;
  });

  protected onTopeInforme(evento: Event): void {
    const crudo = (evento.target as HTMLInputElement).value;
    this.topeInforme.set(crudo === '' ? null : Number(crudo));
  }

  protected onGuardarTopeInforme(): void {
    if (!this.topeInformeCambiado() || this.motivoNoGuardarTope()) return;
    this.guardarTopeInforme(this.topeInformeValor());
  }

  protected readonly reintentos = computed<Reintentos>(
    () => (this.config()?.reintentos?.organizacion as Reintentos) ?? {}
  );

  protected readonly horarios = computed<
    {
      clave: string;
      producto: string;
      subtipo: string;
      codigo: string;
      valor: HorarioSubtipo;
      banco: ReglaBancoSubtipo;
    }[]
  >(() => {
    const s = this.config()?.horarios?.subtipos ?? {};
    return Object.keys(s).map((clave) => ({
      clave,
      // Desglosados por el backend desde que la pantalla administra dos ramas. Se cae a la clave
      // para no romper contra un backend anterior, que solo mandaba transferencias.
      producto: s[clave].producto ?? 'TRANSFERENCIAS',
      subtipo: s[clave].subtipo ?? clave,
      codigo: s[clave].codigo,
      valor: (s[clave].organizacion as HorarioSubtipo) ?? {},
      // Las reglas del banco viajan para poder simular: los cut-off de INTERBANCARIA recortan el
      // cierre igual que el margen, y sin ellos la simulación mentiría justo en el subtipo que
      // más restricciones tiene.
      banco: (s[clave].banco as ReglaBancoSubtipo) ?? {},
    }));
  });

  /**
   * Los mismos subtipos agrupados por producto, que es como se leen.
   *
   * <p>Siete subtipos en una lista plana no dicen a qué producto pertenece cada uno, y eso importa:
   * mover la ventana de `TERCEROS` no toca a `ABONO_PROVEEDOR` aunque compartan pantalla. Sin el
   * encabezado, quien busque «el horario de pagos masivos» acabaría editando el de transferencias
   * — que es justo la confusión que este cambio viene a cerrar.</p>
   */
  protected readonly horariosPorProducto = computed(() => {
    const orden = ['TRANSFERENCIAS', 'PAGOS_MASIVOS'];
    const grupos = new Map<string, ReturnType<typeof this.horarios>>();
    for (const h of this.horarios()) {
      grupos.set(h.producto, [...(grupos.get(h.producto) ?? []), h]);
    }
    return Array.from(grupos.entries())
      .sort(([a], [b]) => {
        // Un producto que nadie previó va al final, pero no se pierde.
        const ia = orden.indexOf(a);
        const ib = orden.indexOf(b);
        return (ia < 0 ? orden.length : ia) - (ib < 0 ? orden.length : ib);
      })
      .map(([producto, subtipos]) => ({
        producto,
        etiqueta: this.ETIQUETA_PRODUCTO[producto] ?? producto,
        subtipos: [...subtipos].sort((x, y) => x.subtipo.localeCompare(y.subtipo)),
      }));
  });

  /** Nombre legible del producto. Sin él la pantalla mostraría el código de la parametría. */
  private readonly ETIQUETA_PRODUCTO: Record<string, string> = {
    TRANSFERENCIAS: 'Transferencias',
    PAGOS_MASIVOS: 'Pagos masivos',
  };

  /** Ventana publicada por el banco. Es de solo lectura: la organización no negocia el horario. */
  protected readonly ventanaCanal = computed<VentanaCanal>(
    () => (this.config()?.horarios?.ventanaCanal as VentanaCanal) ?? {}
  );

  protected readonly tramosCanal = computed<TramoCanal[]>(() => this.ventanaCanal().ventanas ?? []);

  /** `opera` ausente se lee como abierto: la configuración vieja solo escribía los tramos abiertos. */
  protected abierto(t: TramoCanal): boolean {
    return t.opera !== false;
  }

  protected readonly tramosAbiertos = computed<TramoCanal[]>(() =>
    this.tramosCanal().filter((t) => this.abierto(t))
  );

  /**
   * Días declarados cerrados, nombrados por la configuración.
   *
   * <p>Sustituye a un «Domingo no opera» que estaba escrito en la plantilla: ahora los siete días
   * vienen del backend, y un texto fijo habría quedado mintiendo en cuanto se cierre un feriado.</p>
   */
  protected readonly diasCerrados = computed<string[]>(() =>
    this.tramosCanal()
      .filter((t) => !this.abierto(t))
      .map((t) => t.dias)
  );

  /**
   * Aviso de coherencia: con el modo en MANUAL, los jobs encendidos no van a despachar nada nuevo.
   * Es la explicación de «lo encendí todo y no pasa nada», y merece decirse antes de que ocurra.
   */
  protected readonly avisoCoherencia = computed<string | null>(() => {
    if (this.esAutomatico()) return null;
    const encendidos = this.interruptores().filter((i) => i.datos?.efectivo).length;
    return encendidos > 0
      ? `El modo es MANUAL: aunque ${encendidos} job(s) estén encendidos, solo despacharán operaciones que ya se hubieran ingestado como AUTOMATICO.`
      : null;
  });

  // ── Presentación ───────────────────────────────────────────────────────

  protected setConfig(data: ConfiguracionJobs): void {
    this.config.set(data);
    this.error.set(null);
    this.confirmandoAutomatico.set(false);
    // Lo tecleado se descarta al recargar: tras guardar, el campo tiene que reflejar lo que quedó
    // en el nodo. Sin esto, un valor rechazado por el backend seguiría en pantalla como si valiera.
    this.topeInforme.set(null);
  }

  protected setError(mensaje: string): void {
    this.error.set(mensaje);
  }

  protected monedas(mapa: Record<string, number> | undefined): { moneda: string; valor: number }[] {
    if (!mapa) return [];
    return Object.keys(mapa).map((moneda) => ({ moneda, valor: mapa[moneda] }));
  }

  protected texto(valor: unknown): string {
    if (valor === null || valor === undefined) return '—';
    return typeof valor === 'string' ? valor : JSON.stringify(valor);
  }

  protected tono(activo: boolean | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
    return activo ? 'secondary' : 'outline';
  }

  protected mensajeError(err: unknown, porDefecto: string): string {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } };
    return e?.error?.errors?.[0]?.message ?? e?.error?.message ?? porDefecto;
  }

  // ── Coherencia entre los tres interruptores de la tubería (HAB-08 §6.6) ──
  //
  // «Los tres» son PROGRAMACION, CICLO_SFTP y DECISION. INFORME_ORIGEN también sale en la lista de
  // arriba —la pinta la respuesta del API, no una lista fija— pero NO entra en este diagnóstico y no
  // es un olvido: no está en la tubería. Corre después de que el banco respondió, avisa al sistema
  // de origen, y apagarlo no deja nada reservado a medias. Meterlo aquí obligaría a inventar
  // combinaciones que no significan nada.
  //
  // Los tres NO son independientes: el flujo es una tubería —programar, enviar, decidir— y se
  // cierra por la entrada, no por el medio. Apagar solo CICLO_SFTP deja operaciones reservadas que
  // ningún proceso libera, y el síntoma que se ve es "dejaron de programarse operaciones", que
  // apunta al job equivocado. Por eso la pantalla diagnostica la combinación en lugar de ofrecer
  // tres toggles sueltos.

  private estado(job: string): boolean {
    return this.config()?.interruptores?.[job]?.efectivo === true;
  }

  protected readonly combinacion = computed(() => ({
    prog: this.estado('PROGRAMACION'),
    sftp: this.estado('CICLO_SFTP'),
    dec: this.estado('DECISION'),
  }));

  /** Qué produce la combinación actual, con su gravedad. Es la tabla de §6.6. */
  protected readonly diagnostico = computed<{ nivel: 'ok' | 'aviso' | 'trampa'; texto: string }>(() => {
    const { prog, sftp, dec } = this.combinacion();
    if (prog && sftp && dec) return { nivel: 'ok', texto: 'Operación normal: los tres encendidos.' };
    if (!prog && sftp && dec) {
      return {
        nivel: 'ok',
        texto: 'Drenaje: termina lo ya planificado y queda ocioso. Es la forma correcta de parar.',
      };
    }
    if (prog && !sftp) {
      return {
        nivel: 'trampa',
        texto:
          'Los planes se acumulan y las operaciones quedan reservadas sin salir. Como la reserva las excluye del barrido, parecerá que “dejaron de programarse operaciones”.',
      };
    }
    if (prog && sftp && !dec) {
      return {
        nivel: 'aviso',
        texto:
          'Se descargan respuestas pero nadie las concilia: nada libera las operaciones ni cierra las planillas.',
      };
    }
    if (!prog && !sftp && dec) {
      return { nivel: 'ok', texto: 'Concilia el rezago y cierra lo pendiente. Paso final del apagado.' };
    }
    if (!prog && !sftp && !dec) return { nivel: 'ok', texto: 'Todo detenido.' };
    return { nivel: 'aviso', texto: 'Combinación poco habitual: revise el orden de §6.6.' };
  });

  /**
   * Siguiente paso recomendado según el orden de la tubería.
   *
   * <p>Apagado: PROGRAMACION → esperar drenaje → CICLO_SFTP → DECISION. Encendido: el inverso.
   * Ofrecerlo como un botón evita que alguien empiece por el medio, que es el caso que produce la
   * trampa.</p>
   */
  protected readonly siguientePaso = computed<{ job: string; encender: boolean; texto: string } | null>(
    () => {
      const { prog, sftp, dec } = this.combinacion();
      if (prog && !sftp) {
        return { job: 'CICLO_SFTP', encender: true, texto: 'Encender CICLO_SFTP para que los planes salgan' };
      }
      if (prog && sftp && !dec) {
        return { job: 'DECISION', encender: true, texto: 'Encender DECISION para conciliar lo que responda el banco' };
      }
      if (!prog && !sftp && !dec) {
        return { job: 'DECISION', encender: true, texto: 'Encender DECISION (el encendido va de salida a entrada)' };
      }
      if (!prog && !sftp && dec) {
        return { job: 'CICLO_SFTP', encender: true, texto: 'Encender CICLO_SFTP' };
      }
      if (!prog && sftp && dec) {
        return { job: 'PROGRAMACION', encender: true, texto: 'Encender PROGRAMACION para reanudar la entrada' };
      }
      return null;
    }
  );

  /** El apagado empieza SIEMPRE por la entrada de la tubería. */
  protected readonly puedeDetenerOrdenado = computed(() => this.combinacion().prog);

  // ── Edición ────────────────────────────────────────────────────────────
  //
  // Se edita sobre un BORRADOR y no sobre el valor cargado. Dos motivos: se puede cancelar sin
  // recargar, y —más importante— mientras hay cambios sin guardar la pantalla sigue mostrando de
  // dónde partía, que es lo que permite saber qué se está cambiando.

  /** Bloque en edición: `cantidad`, `reintentos` o el código del subtipo horario. Uno a la vez. */
  protected readonly editando = signal<string | null>(null);
  protected readonly borrador = signal<Record<string, string>>({});
  protected readonly errorCampo = signal<string | null>(null);

  protected abrirEdicion(bloque: string, valores: Record<string, string>): void {
    this.editando.set(bloque);
    this.borrador.set({ ...valores });
    this.errorCampo.set(null);
  }

  protected cerrarEdicion(): void {
    this.editando.set(null);
    this.borrador.set({});
    this.errorCampo.set(null);
  }

  protected campo(nombre: string): string {
    return this.borrador()[nombre] ?? '';
  }

  /** Fija un campo del borrador sin pasar por un evento: casillas y conmutadores. */
  protected onCampoValor(nombre: string, valor: string): void {
    this.borrador.set({ ...this.borrador(), [nombre]: valor });
    this.errorCampo.set('');
  }

  protected onCampo(nombre: string, ev: Event): void {
    const valor = (ev.target as HTMLInputElement | HTMLSelectElement).value;
    this.borrador.set({ ...this.borrador(), [nombre]: valor });
    if (this.errorCampo()) this.errorCampo.set(null);
  }

  /** Entero > 0, o `null` si el campo está vacío y se admite vacío. */
  private entero(nombre: string, min: number, max: number, obligatorio: boolean): number | null {
    const crudo = this.campo(nombre).trim();
    if (!crudo) {
      if (obligatorio) throw new Error(`${nombre} es obligatorio.`);
      return null;
    }
    const n = Number(crudo);
    if (!Number.isInteger(n) || n < min || n > max) {
      throw new Error(`${nombre} debe ser un entero entre ${min} y ${max}.`);
    }
    return n;
  }

  /**
   * Arma el valor de cantidad desde el borrador. La validación se repite aquí aunque el backend
   * también valide: un 422 tras pulsar guardar es peor experiencia que un aviso en el propio campo,
   * y el backend sigue siendo la autoridad —esto solo evita el viaje.
   */
  protected construirCantidad(): CantidadProgramable | null {
    try {
      const v: CantidadProgramable = { maxOperaciones: this.entero('maxOperaciones', 1, 8000, true)! };
      const pen = this.entero('PEN', 1, 8000, false);
      const usd = this.entero('USD', 1, 8000, false);
      if (pen !== null || usd !== null) {
        v.porMoneda = {};
        if (pen !== null) v.porMoneda['PEN'] = pen;
        if (usd !== null) v.porMoneda['USD'] = usd;
      }
      // maxMontoTotal se conserva tal cual venía: hoy siempre es null y no se expone para no
      // sugerir un tope que el banco no aplica.
      v.maxMontoTotal = this.cantidad().maxMontoTotal ?? null;
      return v;
    } catch (e) {
      this.errorCampo.set((e as Error).message);
      return null;
    }
  }

  protected construirReintentos(): Reintentos | null {
    try {
      const v: Reintentos = {
        maxReintentosAutomaticos: this.entero('maxReintentosAutomaticos', 0, 10, true)!,
        alTope: this.campo('alTope') || 'MARCAR_REVISION',
        soloCausasTransitorias: this.campo('soloCausasTransitorias') !== 'false',
      };
      return v;
    } catch (e) {
      this.errorCampo.set((e as Error).message);
      return null;
    }
  }

  // ── Ventana efectiva: simulación (HAB-08 §2) ───────────────────────────
  //
  // Reproduce `HorarioEnvio.cierreEfectivo` sobre los valores EN PANTALLA, no sobre los guardados.
  // La razón es que el margen y la cadencia no se leen: un margen de 480 min sobre el tramo del
  // sábado no parece nada hasta que se ve que deja el canal cerrado todo el día. El backend sigue
  // siendo la autoridad —esto solo enseña a qué conduce cada número antes de escribirlo—.

  private static readonly MONEDAS = ['PEN', 'USD'];

  /**
   * `HH:mm` a minutos del día. `null` si no se puede leer: se prefiere no simular a inventar.
   *
   * <p>Comprueba que sea texto en tiempo de ejecución, y no solo por tipo. Toda esta configuración
   * entra por un cast desde {@code unknown}, así que el compilador no la vigila: cuando aquí llegó
   * un objeto de cut-off en vez de su hora, {@code .trim()} lanzaba y el {@code computed} entero se
   * caía —la pantalla quedaba en blanco por un campo—. Degradar a «no simulo este dato» deja el
   * resto de la pantalla en pie.</p>
   */
  private aMinutos(hhmm: string | undefined | null): number | null {
    if (!hhmm || typeof hhmm !== 'string') return null;
    const m = /^(\d{1,2}):(\d{2})/.exec(hhmm.trim());
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h > 23 || min > 59) return null;
    return h * 60 + min;
  }

  private aHora(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
  }

  /**
   * Ventana efectiva de cada subtipo. Para el que se está editando toma los valores del borrador,
   * así que la tabla se mueve mientras se teclea; para el resto, los guardados.
   */
  /**
   * Tramos que rigen para un subtipo, con la MISMA precedencia que aplica el backend
   * ({@code ResolutorHorarioEnvio}): organización → banco → canal.
   *
   * <p>Mientras se edita ese subtipo se leen del <b>borrador</b>, no de lo guardado: la simulación
   * existe justamente para enseñar a qué conduce lo que se está tecleando antes de escribirlo. Si
   * leyera lo persistido, cambiar el sábado no movería nada en pantalla hasta pulsar Guardar —que
   * es exactamente el defecto que tenía—.</p>
   */
  private origenVentana(h: { valor: HorarioSubtipo; banco: ReglaBancoSubtipo }, editando: boolean):
      'ORGANIZACION' | 'BANCO' | 'CANAL' {
    if (editando ? this.campo('ventanaPropia') === 'true' : !!h.valor.ventanas?.length) {
      return 'ORGANIZACION';
    }
    return h.banco.ventanas?.length ? 'BANCO' : 'CANAL';
  }

  private tramosVigentes(h: { valor: HorarioSubtipo; banco: ReglaBancoSubtipo }, editando: boolean): TramoCanal[] {
    if (editando) {
      // Con la casilla desmarcada se simula lo heredado, que es lo que de verdad se aplicaría.
      if (this.campo('ventanaPropia') !== 'true') {
        return h.banco.ventanas?.length ? h.banco.ventanas : this.tramosCanal();
      }
      return JobsConfiguracionViewComponent.DIAS.map((d) => ({
        dias: d,
        opera: this.campo(`d_${d}_opera`) !== 'false',
        desde: this.campo(`d_${d}_desde`),
        hasta: this.campo(`d_${d}_hasta`),
      }));
    }
    if (h.valor.ventanas?.length) return h.valor.ventanas;
    if (h.banco.ventanas?.length) return h.banco.ventanas;
    return this.tramosCanal();
  }

  protected readonly simulaciones = computed<SimulacionSubtipo[]>(() => {
    const canal = this.ventanaCanal();
    const margenPlataforma = canal.margenCierreMinutos ?? 0;
    const enEdicion = this.editando();

    return this.horarios().map((h) => {
      const editando = enEdicion === h.codigo;
      // Por subtipo, no una sola vez para todos: antes se tomaba `tramosCanal()` fuera del map, así
      // que la ventana propia de la organización —y el borrador en curso— no se veían nunca aquí.
      const tramos = this.tramosVigentes(h, editando);
      const propio = editando
        ? this.numeroCampo('margenCierreMinutos')
        : h.valor.margenCierreMinutos ?? null;
      const margen = propio ?? margenPlataforma;

      const cadencias = JobsConfiguracionViewComponent.MONEDAS.map((moneda) => ({
        moneda,
        cadencia: editando
          ? this.numeroCampo(moneda === 'PEN' ? 'cadPEN' : 'cadUSD') ??
            this.numeroCampo('cadenciaMinutos') ??
            0
          : h.valor.cadenciaPorMoneda?.[moneda] ?? h.valor.cadenciaMinutos ?? 0,
      })).filter((c) => c.cadencia > 0);

      // Los cut-off del banco recortan el cierre antes que el margen, igual que en el backend.
      //
      // Se lee `c.hora` y no el elemento: la parametría guarda el cut-off COMPLETO
      // ({via, hora, aplicaA, umbrales}) porque la vía se elige por el monto de cada operación. El
      // backend ya lo leía así —`texto(cutoff, "hora")`—; aquí estaba tomado como si fuera la hora.
      const cutoffs = (h.banco.cutoffs ?? [])
        .map((c) => ({ via: c?.via ?? '', minutos: this.aMinutos(c?.hora) }))
        .filter((c): c is { via: string; minutos: number } => c.minutos !== null);

      return {
        codigo: h.codigo,
        subtipo: h.subtipo,
        editando,
        margen,
        margenHeredado: propio === null,
        origen: this.origenVentana(h, editando),
        // Solo se simulan los días abiertos: un día cerrado no tiene ventana que recortar, y
        // filtrarlo aquí es explícito —antes se caía solo porque no traía horas que parsear—.
        tramos: tramos
          .filter((t) => this.abierto(t))
          .map((t) => this.simularTramo(t, margen, cutoffs, cadencias))
          .filter((t): t is TramoSimulado => t !== null),
      };
    });
  });

  private simularTramo(
    tramo: TramoCanal,
    margen: number,
    cutoffs: { via: string; minutos: number }[],
    cadencias: { moneda: string; cadencia: number }[]
  ): TramoSimulado | null {
    const apertura = this.aMinutos(tramo.desde);
    const publicado = this.aMinutos(tramo.hasta);
    if (apertura === null || publicado === null) return null;

    // Gana el más TEMPRANO: un archivo que mezcle vías hereda el deadline más corto.
    let tope = publicado;
    let cutoffAplicado: string | null = null;
    for (const c of cutoffs) {
      if (c.minutos < tope) {
        tope = c.minutos;
        cutoffAplicado = `${c.via} ${this.aHora(c.minutos)}`.trim();
      }
    }

    // Mismo tope que el backend: si el margen se come la ventana, el cierre cae en la apertura y no
    // se arma NADA. Se refleja tal cual —no se corrige— porque lo que hay que ver es esa trampa.
    const restado = tope - margen;
    const muerto = restado <= apertura;
    const cierre = muerto ? apertura : restado;
    const utiles = cierre - apertura;

    const porMoneda: RendimientoMoneda[] = cadencias.map((c) => {
      const lotes = muerto ? 0 : Math.floor(utiles / c.cadencia) + 1;
      return {
        moneda: c.moneda,
        cadencia: c.cadencia,
        lotes,
        ultimo: lotes > 0 ? this.aHora(apertura + (lotes - 1) * c.cadencia) : '—',
      };
    });

    let alerta: string | null = null;
    if (muerto) {
      alerta = `El margen de ${margen} min se come el tramo entero (${tramo.desde}-${tramo.hasta}): no se armaría ningún lote este día.`;
    } else if (porMoneda.some((m) => m.lotes === 1)) {
      const unicas = porMoneda.filter((m) => m.lotes === 1).map((m) => m.moneda);
      alerta = `${unicas.join(' y ')}: la cadencia no cabe dos veces en el tramo, así que sale un único lote con todo el día acumulado.`;
    } else if (utiles < 60) {
      alerta = `Quedan ${utiles} min útiles: cualquier retraso del canal deja el día sin envío.`;
    }

    return {
      dias: tramo.dias,
      apertura: this.aHora(apertura),
      cierrePublicado: this.aHora(publicado),
      cierre: this.aHora(cierre),
      cutoffAplicado,
      minutosUtiles: utiles,
      porMoneda,
      alerta,
    };
  }

  /** Lee un campo del borrador como número. `null` si está vacío o no es válido —sin lanzar—. */
  private numeroCampo(nombre: string): number | null {
    const crudo = this.campo(nombre).trim();
    if (!crudo) return null;
    const n = Number(crudo);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }

  /** Resumen de la simulación del bloque en edición, para avisar sin obligar a leer la tabla. */
  protected readonly alertasEdicion = computed<string[]>(() => {
    const sim = this.simulaciones().find((s) => s.editando);
    if (!sim) return [];
    return sim.tramos
      .filter((t) => t.alerta)
      .map((t) => `${t.dias}: ${t.alerta}`);
  });

  /**
   * Valores iniciales del formulario de un subtipo, incluidos los 21 campos de la ventana.
   *
   * <p>Se arma aquí y no en la plantilla porque son 24 claves: en el HTML era ilegible y cualquier
   * campo nuevo se olvidaba en uno de los dos sitios.</p>
   *
   * <p><b>La ventana se precarga con la que está EN VIGOR</b>, sea propia o heredada. Abrir el
   * formulario en blanco obligaría a reescribir el horario del banco de memoria para cambiar un
   * solo día, y ahí es donde se cuelan los errores.</p>
   */
  protected semillaEdicion(h: { codigo: string; valor: HorarioSubtipo }): Record<string, string> {
    const base: Record<string, string> = {
      habilitado: (h.valor.habilitado === true) + '',
      cadenciaMinutos: (h.valor.cadenciaMinutos ?? '') + '',
      cadPEN: (h.valor.cadenciaPorMoneda?.['PEN'] ?? '') + '',
      cadUSD: (h.valor.cadenciaPorMoneda?.['USD'] ?? '') + '',
      margenCierreMinutos: (h.valor.margenCierreMinutos ?? '') + '',
      ventanaPropia: (Array.isArray(h.valor.ventanas) && h.valor.ventanas.length > 0) + '',
    };
    const vigentes = Array.isArray(h.valor.ventanas) && h.valor.ventanas.length
      ? h.valor.ventanas
      : this.tramosCanal();
    for (const dia of JobsConfiguracionViewComponent.DIAS) {
      const t = vigentes.find((x) => (x.dias ?? '').toUpperCase() === dia);
      // `opera` ausente se lee como true: la configuración vieja solo escribía los tramos abiertos.
      base[`d_${dia}_opera`] = (t ? t.opera !== false : false) + '';
      base[`d_${dia}_desde`] = t?.desde ?? '07:00';
      base[`d_${dia}_hasta`] = t?.hasta ?? '20:30';
    }
    return base;
  }

  /** Los siete días, en el orden en que se pintan y se guardan. */
  protected static readonly DIAS: readonly string[] = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

  protected readonly dias = JobsConfiguracionViewComponent.DIAS;

  /**
   * Arma los siete tramos desde el borrador y los valida ANTES de salir del navegador.
   *
   * <p>El backend vuelve a validar lo mismo —es la autoridad—, pero repetirlo aquí convierte un
   * viaje al servidor y un 422 en un mensaje inmediato junto al campo. Las reglas son las mismas a
   * propósito: si divergieran, la pantalla aceptaría formas que el backend rechaza.</p>
   */
  private construirTramos(): TramoCanal[] {
    const tramos: TramoCanal[] = [];
    for (const dia of JobsConfiguracionViewComponent.DIAS) {
      const opera = this.campo(`d_${dia}_opera`) !== 'false';
      if (!opera) {
        // Sin horas: un día cerrado no las tiene, y escribirlas sugeriría que algún día se usan.
        tramos.push({ dias: dia, opera: false });
        continue;
      }
      const desde = this.campo(`d_${dia}_desde`).trim();
      const hasta = this.campo(`d_${dia}_hasta`).trim();
      const mDesde = this.aMinutos(desde);
      const mHasta = this.aMinutos(hasta);
      if (mDesde === null || mHasta === null) {
        throw new Error(`${dia}: la apertura y el cierre deben venir como HH:mm (llegó “${desde}”–“${hasta}”).`);
      }
      if (mDesde >= mHasta) {
        throw new Error(`${dia}: la apertura (${desde}) debe ser anterior al cierre (${hasta}).`);
      }
      tramos.push({ dias: dia, opera: true, desde, hasta });
    }
    if (tramos.every((t) => t.opera === false)) {
      // Los siete cerrados es «no envío nunca», que ya se dice con Habilitado=NO y de forma
      // legible. Guardarlo como ventana dejaría el subtipo encendido y mudo.
      throw new Error(
        'Los siete días quedaron cerrados: eso es apagar el subtipo. Use Habilitado = NO, que lo dice de frente.'
      );
    }
    return tramos;
  }

  protected construirHorario(): HorarioSubtipo | null {
    try {
      const v: HorarioSubtipo = {
        habilitado: this.campo('habilitado') === 'true',
        cadenciaMinutos: this.entero('cadenciaMinutos', 1, 1440, true)!,
      };
      const pen = this.entero('cadPEN', 1, 1440, false);
      const usd = this.entero('cadUSD', 1, 1440, false);
      if (pen !== null || usd !== null) {
        v.cadenciaPorMoneda = {};
        if (pen !== null) v.cadenciaPorMoneda['PEN'] = pen;
        if (usd !== null) v.cadenciaPorMoneda['USD'] = usd;
      }
      // La ingesta corre cada 5 minutos: una cadencia que no sea múltiplo no aporta: entre dos
      // ingestas no hay operaciones nuevas que encontrar. Se avisa, no se bloquea.
      const noMultiplo = [v.cadenciaMinutos, pen, usd].filter(
        (m): m is number => m !== null && m !== undefined && m % 5 !== 0
      );
      if (noMultiplo.length) {
        this.aviso.set(
          'La ingesta corre cada 5 minutos: una cadencia que no sea múltiplo de 5 no adelanta nada.'
        );
      }

      // Margen de cierre: cuánto se deja de armar ANTES de que el banco cierre, para que lo último
      // que salga llegue a tiempo. Vacío = hereda el de la plataforma, y esa herencia hay que poder
      // recuperarla: por eso el campo admite quedarse en blanco en vez de forzar un número.
      v.margenCierreMinutos = this.entero('margenCierreMinutos', 0, 720, false);

      // Ventana propia de la organización. Solo se manda si el operador la activó: omitirla es lo
      // que devuelve el subtipo a heredar del banco/canal, y esa vuelta atrás tiene que ser posible
      // desde la pantalla. Mandar los tramos heredados como propios los congelaría, y el día que el
      // banco cambiara su horario este subtipo se quedaría con el viejo sin que nadie lo note.
      if (this.campo('ventanaPropia') === 'true') {
        v.ventanas = this.construirTramos();
      }

      // Un margen que mata TODOS los tramos deja el subtipo sin enviar nunca, y el backend lo acepta
      // en silencio —recorta el cierre a la apertura—. Se rechaza aquí porque es indistinguible de
      // apagar el subtipo, y para eso ya está `habilitado`, que además lo dice de frente.
      const sim = this.simulaciones().find((s) => s.editando);
      if (sim && sim.tramos.length > 0 && sim.tramos.every((t) => t.cierre === t.apertura)) {
        throw new Error(
          `Un margen de ${sim.margen} min no deja ninguna franja útil en toda la semana: el subtipo no enviaría nunca. Si es lo que se busca, ponga Habilitado en NO.`
        );
      }
      return v;
    } catch (e) {
      this.errorCampo.set((e as Error).message);
      return null;
    }
  }

  // ── Ganchos que implementa la Page ─────────────────────────────────────
  protected cargar(): void {}
  protected guardarModoEnvio(_modo: string): void {}

  protected guardarDiferido(_habilitado: boolean): void {}

  protected guardarTopeInforme(_tope: number): void {}

  /** Traduce el `<select>` y persiste. El valor viaja como booleano, no como texto. */
  protected onDiferido(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value;
    this.guardarDiferido(valor === 'true');
  }
  protected cambiarInterruptor(_job: string, _habilitado: boolean): void {}
  protected guardarCantidad(_valor: CantidadProgramable): void {}
  protected guardarReintentos(_valor: Reintentos): void {}
  protected guardarHorario(_codigo: string, _valor: HorarioSubtipo): void {}

  protected onGuardarCantidad(): void {
    const v = this.construirCantidad();
    if (v) this.guardarCantidad(v);
  }

  protected onGuardarReintentos(): void {
    const v = this.construirReintentos();
    if (v) this.guardarReintentos(v);
  }

  protected onGuardarHorario(codigo: string): void {
    const v = this.construirHorario();
    if (v) this.guardarHorario(codigo, v);
  }

  /**
   * Pasar a AUTOMATICO pide confirmación; volver a MANUAL no.
   *
   * <p>La asimetría es deliberada: encender el automático hace que el sistema empiece a mover
   * dinero sin intervención, y apagarlo solo detiene el sellado de operaciones nuevas. Frenar es
   * seguro; arrancar no.</p>
   */
  protected onModo(nuevo: string): void {
    if (nuevo === this.modo()) return;
    if (nuevo === MODO_AUTOMATICO && !this.confirmandoAutomatico()) {
      this.confirmandoAutomatico.set(true);
      return;
    }
    this.confirmandoAutomatico.set(false);
    this.guardarModoEnvio(nuevo);
  }

  protected cancelarConfirmacion(): void {
    this.confirmandoAutomatico.set(false);
  }
}
