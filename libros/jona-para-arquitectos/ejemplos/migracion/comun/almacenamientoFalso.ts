// `localStorage` en memoria para Node. El legado guarda ahí el token, y otras partes de la aplicación lo leen:
// por eso la caracterización observa el almacenamiento como parte del comportamiento.

class AlmacenamientoEnMemoria implements Storage {
  private readonly datos = new Map<string, string>();

  get length(): number {
    return this.datos.size;
  }

  clear(): void {
    this.datos.clear();
  }

  getItem(clave: string): string | null {
    return this.datos.get(clave) ?? null;
  }

  key(indice: number): string | null {
    return [...this.datos.keys()][indice] ?? null;
  }

  removeItem(clave: string): void {
    this.datos.delete(clave);
  }

  setItem(clave: string, valor: string): void {
    this.datos.set(clave, String(valor));
  }

  /** Todo lo guardado, ordenado por clave, para compararlo de una vez. */
  contenido(): Record<string, string> {
    return Object.fromEntries([...this.datos.entries()].sort(([a], [b]) => a.localeCompare(b)));
  }
}

/** Instala un `localStorage` vacío (o con los valores dados) y devuelve cómo leerlo y quitarlo. */
export function instalarAlmacenamiento(inicial: Record<string, string> = {}) {
  const anterior = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const almacenamiento = new AlmacenamientoEnMemoria();
  for (const [clave, valor] of Object.entries(inicial)) almacenamiento.setItem(clave, valor);
  Object.defineProperty(globalThis, 'localStorage', { value: almacenamiento, configurable: true, writable: true });
  return {
    contenido: () => almacenamiento.contenido(),
    desinstalar(): void {
      if (anterior) Object.defineProperty(globalThis, 'localStorage', anterior);
      else delete (globalThis as { localStorage?: Storage }).localStorage;
    },
  };
}
