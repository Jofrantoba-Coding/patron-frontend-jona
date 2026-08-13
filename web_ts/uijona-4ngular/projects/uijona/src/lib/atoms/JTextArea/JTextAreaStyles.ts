// JTextAreaStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JTextAreaResize, JTextAreaSize, JTextAreaVariant } from './InterJTextArea';

export const JTEXTAREA_RESIZE_CLASSES: Record<JTextAreaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

export const JTEXTAREA_SIZE_CLASSES: Record<JTextAreaSize, string> = {
  sm: 'min-h-[60px] text-xs px-2 py-1.5',
  md: 'min-h-[80px] text-sm px-3 py-2',
  lg: 'min-h-[100px] text-base px-4 py-2.5',
};

export const JTEXTAREA_VARIANT_CLASSES: Record<JTextAreaVariant, string> = {
  default: 'bg-white border-neutral-300',
  filled: 'bg-neutral-50 border-neutral-200',
};
