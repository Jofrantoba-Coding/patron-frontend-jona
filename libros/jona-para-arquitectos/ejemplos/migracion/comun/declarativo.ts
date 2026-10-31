// Un segundo juego de vista, declarativo: la vista es una función pura del modelo a un árbol de nodos,
// y la raíz vuelve a pintar el árbol entero en cada cambio (un render de React o Vue, en miniatura).
// Como pantalla.ts, es la «plataforma»: no se mide. Lo usa el paso 08 (cambio de tecnología de vista).

export interface Props {
  id?: string;
  clase?: string;
  /** Valor de un campo controlado: lo que se ve es lo que dice el modelo. */
  valor?: string;
  deshabilitado?: boolean;
  alEscribir?: (valor: string) => void;
  alPulsar?: () => void;
}

export interface Nodo {
  etiqueta: string;
  props: Props;
  hijos: Array<Nodo | string>;
}

export function h(etiqueta: string, props: Props = {}, ...hijos: Array<Nodo | string>): Nodo {
  return { etiqueta, props, hijos };
}

const escapar = (texto: string) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** El árbol como HTML (sin manejadores): lo que pintaría un navegador o un render en servidor. */
export function aHtml(nodo: Nodo | string): string {
  if (typeof nodo === 'string') return escapar(nodo);
  const { id, clase, valor, deshabilitado } = nodo.props;
  const atributos = [
    id !== undefined ? ` id="${escapar(id)}"` : '',
    clase !== undefined ? ` class="${escapar(clase)}"` : '',
    valor !== undefined ? ` value="${escapar(valor)}"` : '',
    deshabilitado ? ' disabled' : '',
  ].join('');
  if (nodo.etiqueta === 'input') return `<input${atributos}>`;
  return `<${nodo.etiqueta}${atributos}>${nodo.hijos.map(aHtml).join('')}</${nodo.etiqueta}>`;
}

/** Contenedor montado: guarda el último árbol pintado y simula a la persona sobre él. */
export class Raiz {
  private arbol: Nodo | undefined;

  pintar(arbol: Nodo): void {
    this.arbol = arbol;
  }

  html(): string {
    return this.arbol ? aHtml(this.arbol) : '';
  }

  buscar(id: string): Nodo | undefined {
    const recorrer = (nodo: Nodo): Nodo | undefined => {
      if (nodo.props.id === id) return nodo;
      for (const hijo of nodo.hijos) {
        const encontrado = typeof hijo === 'string' ? undefined : recorrer(hijo);
        if (encontrado) return encontrado;
      }
      return undefined;
    };
    return this.arbol ? recorrer(this.arbol) : undefined;
  }

  /** Texto visible de un nodo (sus hijos de texto, en profundidad). */
  texto(id: string): string {
    const juntar = (nodo: Nodo | string): string => (typeof nodo === 'string' ? nodo : nodo.hijos.map(juntar).join(''));
    const nodo = this.buscar(id);
    return nodo ? juntar(nodo) : '';
  }

  /** La persona escribe en un campo. Deshabilitado, no pasa nada, como en cualquier toolkit. */
  escribir(id: string, valor: string): void {
    const nodo = this.exigir(id);
    if (!nodo.props.deshabilitado) nodo.props.alEscribir?.(valor);
  }

  /** La persona pulsa un botón. */
  pulsar(id: string): void {
    const nodo = this.exigir(id);
    if (!nodo.props.deshabilitado) nodo.props.alPulsar?.();
  }

  private exigir(id: string): Nodo {
    const nodo = this.buscar(id);
    if (!nodo) throw new Error(`no hay un nodo con id «${id}»`);
    return nodo;
  }
}
