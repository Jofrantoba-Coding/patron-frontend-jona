import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JBadge, JProgress, JSectionHeading } from 'uijona-4ngular';
import type { BuzonSftp, EntradaSftp, ExploracionSftp } from './inter-sftp-seguimiento';

const NUM = new Intl.NumberFormat('es-PE');

type OrdenCampo = 'nombre' | 'tamano' | 'fecha';

/** Familia con sus dos buzones enfrentados: IN (envío) y OUT (respuesta). */
interface FilaFamilia {
  familia: string;
  entrada: BuzonSftp | null;
  salida: BuzonSftp | null;
}

/**
 * Vista del seguimiento SFTP. Dos modos:
 * - PANORAMA: todos los buzones con su contenido (lo que trae una sola lectura del canal).
 * - DIRECTORIO: el contenido de una ruta concreta, al entrar en una carpeta.
 *
 * <p>El buscador filtra en cliente sobre lo ya leído — en panorama, a la vez sobre los ocho
 * buzones. Una búsqueda recursiva en el servidor implicaría recorrer el árbol del banco con
 * muchas aperturas de sesión, y el BCP solo tolera una a la vez.</p>
 */
@Component({
  selector: 'app-sftp-seguimiento-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JBadge, JProgress],
  templateUrl: './sftp-seguimiento-view.component.html',
})
export class SftpSeguimientoViewComponent {
  protected readonly servidor = signal<string>('');
  /** Banco del canal que se está viendo. Por ahora BCP es el único H2H en producción. */
  protected readonly banco = signal<string>('BCP');
  protected readonly bancos = signal<string[]>([]);
  protected readonly raiz = signal<string>('');
  protected readonly modo = signal<'PANORAMA' | 'DIRECTORIO'>('PANORAMA');
  protected readonly buzones = signal<BuzonSftp[]>([]);
  protected readonly ruta = signal<string | null>(null);
  protected readonly padre = signal<string | null>(null);
  protected readonly entradas = signal<EntradaSftp[]>([]);

  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly ultimaLectura = signal<string | null>(null);

  protected readonly busqueda = signal<string>('');
  protected readonly orden = signal<OrdenCampo>('nombre');
  protected readonly ordenDesc = signal<boolean>(false);
  /** Oculta los buzones sin coincidencias mientras se busca. */
  protected readonly soloConResultados = signal<boolean>(true);

  // ── PANORAMA ──────────────────────────────────────────────────────────
  /** Los ocho buzones con sus entradas filtradas por el buscador y ordenadas. */
  private readonly buzonesFiltrados = computed<BuzonSftp[]>(() => {
    const q = this.busqueda().trim().toLowerCase();
    return this.buzones().map((b) => ({
      ...b,
      entradas: this.ordenar(b.entradas.filter((e) => (q ? e.nombre.toLowerCase().includes(q) : true))),
    }));
  });

  /**
   * Vista 360 por familia: el IN (lo que enviamos) y el OUT (lo que respondió el banco) emparejados,
   * para leer el ida y vuelta de un producto en la misma fila.
   */
  protected readonly familias = computed<FilaFamilia[]>(() => {
    const porFamilia = new Map<string, FilaFamilia>();
    for (const b of this.buzonesFiltrados()) {
      const fila = porFamilia.get(b.familia) ?? { familia: b.familia, entrada: null, salida: null };
      if (b.buzon === 'OUT') {
        fila.salida = b;
      } else {
        fila.entrada = b;
      }
      porFamilia.set(b.familia, fila);
    }
    const filas = [...porFamilia.values()];
    // Buscando: se oculta la familia solo si NINGUNO de sus dos buzones coincide, para que las
    // columnas sigan enfrentadas y no se descuadre la lectura.
    if (this.busqueda().trim() && this.soloConResultados()) {
      return filas.filter(
        (f) => (f.entrada?.entradas.length ?? 0) > 0 || (f.salida?.entradas.length ?? 0) > 0
      );
    }
    return filas;
  });

  protected readonly totalBuzones = computed(() => this.buzones().length);
  protected readonly totalArchivosPanorama = computed(() =>
    this.buzonesFiltrados().reduce(
      (acc, b) => acc + b.entradas.filter((e) => e.tipo === 'ARCHIVO').length,
      0
    )
  );
  protected readonly buzonesConError = computed(() => this.buzones().filter((b) => !!b.error).length);

  // ── DIRECTORIO ────────────────────────────────────────────────────────
  protected readonly entradasVisibles = computed<EntradaSftp[]>(() => {
    const q = this.busqueda().trim().toLowerCase();
    return this.ordenar(this.entradas().filter((e) => (q ? e.nombre.toLowerCase().includes(q) : true)));
  });

  protected readonly totalArchivos = computed(
    () => this.entradasVisibles().filter((e) => e.tipo === 'ARCHIVO').length
  );
  protected readonly totalDirectorios = computed(
    () => this.entradasVisibles().filter((e) => e.tipo === 'DIRECTORIO').length
  );
  protected readonly bytesTotales = computed(() =>
    this.entradasVisibles().reduce((acc, e) => acc + (e.tipo === 'ARCHIVO' ? e.tamano : 0), 0)
  );

  /** Segmentos navegables de la ruta actual (modo DIRECTORIO). */
  protected readonly migas = computed<{ label: string; ruta: string }[]>(() => {
    const actual = this.ruta();
    const raiz = this.raiz();
    if (!actual) return [];
    const resto = actual.startsWith(raiz) ? actual.slice(raiz.length) : actual;
    const migas = [{ label: raiz || '/', ruta: raiz }];
    let acumulada = raiz;
    for (const parte of resto.split('/').filter((p) => p !== '')) {
      acumulada = `${acumulada}/${parte}`;
      migas.push({ label: parte, ruta: acumulada });
    }
    return migas;
  });

  protected setExploracion(data: ExploracionSftp): void {
    this.servidor.set(data.servidor ?? '');
    if (data.banco) this.banco.set(data.banco);
    if (data.bancos?.length) this.bancos.set(data.bancos);
    this.raiz.set(data.raiz ?? '');
    this.modo.set(data.modo ?? 'PANORAMA');
    this.ruta.set(data.ruta ?? null);
    this.padre.set(data.padre ?? null);
    this.entradas.set(data.entradas ?? []);
    if (data.modo === 'PANORAMA') {
      this.buzones.set(data.buzones ?? []);
    }
    this.error.set(null);
    this.ultimaLectura.set(new Date().toLocaleTimeString('es-PE'));
  }

  protected setError(mensaje: string): void {
    this.error.set(mensaje);
  }

  // ── Hooks (los implementa la Page) ────────────────────────────────────
  protected cargarPanorama(): void {
    return;
  }
  protected cambiarBanco(_banco: string): void {
    return;
  }
  protected abrirRuta(_ruta: string): void {
    return;
  }
  protected refrescar(): void {
    return;
  }
  protected abrirArchivo(_entrada: EntradaSftp, _ruta: string): void {
    return;
  }

  // ── Interacción ───────────────────────────────────────────────────────
  protected onBuscar(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value ?? '');
  }

  protected onLimpiarBusqueda(): void {
    this.busqueda.set('');
  }

  protected onBanco(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    if (valor && valor !== this.banco()) this.cambiarBanco(valor);
  }

  /** Clic en una entrada: si es carpeta navega; si es archivo, delega en la Page. */
  protected onEntrada(entrada: EntradaSftp, rutaBase: string): void {
    if (entrada.tipo === 'DIRECTORIO') {
      this.abrirRuta(`${rutaBase}/${entrada.nombre}`);
      return;
    }
    this.abrirArchivo(entrada, rutaBase);
  }

  protected onSubir(): void {
    const p = this.padre();
    if (p) this.abrirRuta(p);
  }

  protected onVolverPanorama(): void {
    this.cargarPanorama();
  }

  protected onOrdenar(campo: OrdenCampo): void {
    if (this.orden() === campo) {
      this.ordenDesc.set(!this.ordenDesc());
      return;
    }
    this.orden.set(campo);
    this.ordenDesc.set(false);
  }

  private ordenar(lista: EntradaSftp[]): EntradaSftp[] {
    const campo = this.orden();
    const desc = this.ordenDesc() ? -1 : 1;
    return lista.slice().sort((a, b) => {
      const dirA = a.tipo === 'DIRECTORIO' ? 0 : 1;
      const dirB = b.tipo === 'DIRECTORIO' ? 0 : 1;
      if (dirA !== dirB) return dirA - dirB;
      if (campo === 'tamano') return (a.tamano - b.tamano) * desc;
      if (campo === 'fecha') return a.fechaModificacion.localeCompare(b.fechaModificacion) * desc;
      return a.nombre.localeCompare(b.nombre) * desc;
    });
  }

  protected etiquetaBuzon(b: BuzonSftp): string {
    return `${b.familia} · ${b.buzon}`;
  }

  /**
   * Lado de la fila (IN u OUT) siempre como objeto: si la familia no tiene ese buzón configurado
   * devuelve uno vacío. Así la plantilla no lidia con nulos — el chequeo estricto de plantillas de
   * Angular no narrowea bien los opcionales dentro de bloques `@else if`.
   */
  protected lado(fila: FilaFamilia, buzon: 'IN' | 'OUT'): BuzonSftp {
    const b = buzon === 'IN' ? fila.entrada : fila.salida;
    return b ?? { familia: fila.familia, buzon, ruta: '', total: 0, entradas: [] };
  }

  /** ¿La familia tiene ese buzón configurado en tm_orcon? */
  protected configurado(fila: FilaFamilia, buzon: 'IN' | 'OUT'): boolean {
    return (buzon === 'IN' ? fila.entrada : fila.salida) !== null;
  }

  /** Archivos visibles de ese lado (ya filtrados por el buscador). */
  protected conteo(fila: FilaFamilia, buzon: 'IN' | 'OUT'): number {
    return this.lado(fila, buzon).entradas.length;
  }

  /** Tamaño legible; los directorios no muestran tamaño. */
  protected tamano(entrada: EntradaSftp): string {
    if (entrada.tipo === 'DIRECTORIO') return '—';
    const b = entrada.tamano ?? 0;
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  }

  protected bytesLegibles(total: number): string {
    if (total < 1024) return `${NUM.format(total)} B`;
    if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
    return `${(total / (1024 * 1024)).toFixed(1)} MB`;
  }

  /** Sufijo de respuesta del banco, para reconocer el archivo de un vistazo. */
  protected badgeArchivo(nombre: string): string | null {
    const n = nombre.toUpperCase();
    if (n.includes('-VAL')) return 'VAL';
    if (n.includes('-RES2')) return 'RES2';
    if (n.includes('-PAR')) return 'PAR';
    if (n.includes('-RES')) return 'RES';
    if (n.endsWith('.GPG')) return 'GPG';
    return null;
  }

  protected variantBadge(sufijo: string | null): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (sufijo === 'VAL') return 'destructive';
    if (sufijo === 'RES' || sufijo === 'RES2') return 'default';
    if (sufijo === 'PAR') return 'secondary';
    return 'outline';
  }

  protected variantBuzon(b: BuzonSftp): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (b.error) return 'destructive';
    return b.buzon === 'OUT' ? 'default' : 'secondary';
  }
}
