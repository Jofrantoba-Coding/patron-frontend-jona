// JComboBoxStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JComboBoxSize, JComboBoxVariant } from './InterJComboBox';

export const JCOMBOBOX_SIZE_CLASSES: Record<JComboBoxSize, string> = {
  sm: 'h-7 text-xs px-2 py-0.5',
  md: 'h-9 text-sm px-3 py-1',
  lg: 'h-11 text-base px-4 py-2',
};

export const JCOMBOBOX_VARIANT_CLASSES: Record<JComboBoxVariant, string> = {
  default: 'bg-white border-neutral-300',
  filled: 'bg-neutral-50 border-neutral-200',
};
