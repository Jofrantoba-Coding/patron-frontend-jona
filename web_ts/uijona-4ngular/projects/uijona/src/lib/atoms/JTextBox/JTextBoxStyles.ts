// JTextBoxStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JTextBoxVariant, JTextBoxSize } from './InterJTextBox';

export const JTEXTBOX_VARIANT_CLASSES: Record<JTextBoxVariant, string> = {
  default: 'border border-neutral-300 bg-neutral-50 text-neutral-900',
  filled: 'border-0 bg-neutral-100 text-neutral-900',
  ghost: 'border-0 bg-transparent text-neutral-900',
};

export const JTEXTBOX_SIZE_CLASSES: Record<JTextBoxSize, string> = {
  sm: 'h-7 px-3 text-xs rounded',
  md: 'h-9 px-3 text-sm rounded-md',
  lg: 'h-11 px-4 text-base rounded-md',
};
