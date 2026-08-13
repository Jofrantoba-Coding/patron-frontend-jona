// JTableStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JTableResponsiveMode } from './InterJTable';

export const OUTER_CLASSES: Record<JTableResponsiveMode, string> = {
  scroll: 'relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200',
  cards: 'relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200',
  none: 'relative flex w-full max-w-full flex-col rounded-md border border-neutral-200',
};

export const INNER_CLASSES: Record<JTableResponsiveMode, string> = {
  scroll: 'overflow-x-auto',
  cards: '',
  none: 'overflow-x-auto',
};
