import type { InterJButton } from './InterJButton';

export function JButtonView({ texto }: InterJButton) {
  void fetch('/metricas/boton');
  return `<button>${texto}</button>`;
}
