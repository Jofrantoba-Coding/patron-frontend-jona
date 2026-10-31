// Un juego de controles mínimo y sin DOM: alcanza para escribir vistas reales y probarlas.

/** Campo de texto. `setValue` es la asignación del programa; `type` simula a la persona escribiendo. */
export class TextField {
  enabled = true;
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

/** Botón. Deshabilitado, ignora los clics, como cualquier toolkit real. */
export class Button {
  label = '';
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

/** Los controles de toda pantalla de login de este ejemplo: lo único que ven las pruebas de comportamiento. */
export interface LoginScreen {
  readonly title: Label;
  readonly email: TextField;
  readonly password: TextField;
  readonly submit: Button;
  readonly message: Label;
}
