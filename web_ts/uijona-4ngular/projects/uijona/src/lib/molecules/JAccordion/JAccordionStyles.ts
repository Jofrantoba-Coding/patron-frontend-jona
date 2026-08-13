// JAccordionStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JAccordionSize, JAccordionVariant } from './InterJAccordion';

export const TRIGGER_SIZE: Record<JAccordionSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-4 text-base',
};

export const CONTENT_SIZE: Record<JAccordionSize, string> = {
  sm: 'px-3 pb-2 text-xs',
  md: 'px-4 pb-4 text-sm',
  lg: 'px-5 pb-5 text-base',
};

export const CONTAINER_VARIANT: Record<JAccordionVariant, string> = {
  default: 'w-full divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white',
  bordered: 'w-full flex flex-col gap-2',
  ghost: 'w-full divide-y divide-neutral-100',
};

export const ITEM_VARIANT: Record<JAccordionVariant, string> = {
  default: '',
  bordered: 'rounded-md border border-neutral-200 bg-white overflow-hidden',
  ghost: '',
};
