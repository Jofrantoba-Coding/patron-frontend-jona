// Un juego de controles mínimo y sin DOM, común a todas las variantes y a todas las instantáneas.
// Es la «plataforma»: no se mide, como no se mide el framework de UI de un proyecto real.

/** Campo de texto. `setValue` es la asignación del programa; `type` simula a la persona escribiendo. */
export class TextField {
  enabled = true;
  /** Error que el control muestra junto al campo (como `setError` en muchos toolkits). */
  error = '';
  private text = '';
  private readonly listeners: Array<(value: string) => void> = [];

  get value(): string {
    return this.text;
  }

  /** El programa cambia el valor: no avisa a nadie (como un setText). */
  setValue(value: string): void {
    this.text = value;
  }

  /** La persona escribe: cambia el valor y avisa a los oyentes. */
  type(value: string): void {
    if (!this.enabled) return;
    this.text = value;
    for (const listener of this.listeners) listener(value);
  }

  onChange(listener: (value: string) => void): void {
    this.listeners.push(listener);
  }
}

/** Casilla de verificación. `setChecked` es del programa; `toggle` simula a la persona. */
export class CheckBox {
  label = '';
  enabled = true;
  private value = false;
  private readonly listeners: Array<(checked: boolean) => void> = [];

  get checked(): boolean {
    return this.value;
  }

  setChecked(checked: boolean): void {
    this.value = checked;
  }

  toggle(): void {
    if (!this.enabled) return;
    this.value = !this.value;
    for (const listener of this.listeners) listener(this.value);
  }

  onChange(listener: (checked: boolean) => void): void {
    this.listeners.push(listener);
  }
}

/** Botón. Deshabilitado, ignora los clics, como cualquier toolkit real. */
export class Button {
  label = '';
  /** Clase de estilo (el equivalente de `className` en la web). */
  className = '';
  enabled = true;
  private readonly listeners: Array<() => void> = [];

  click(): void {
    if (!this.enabled) return;
    for (const listener of this.listeners) listener();
  }

  onClick(listener: () => void): void {
    this.listeners.push(listener);
  }
}

/** Etiqueta de solo lectura. */
export class Label {
  text = '';
}
