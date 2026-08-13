// JRadioButtonStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JRadioButtonLabelPosition } from './InterJRadioButton';

export const JRADIOBUTTON_WRAPPER_CLASSES: Record<JRadioButtonLabelPosition, string> = {
  right: 'flex flex-row items-center gap-2',
  left: 'flex flex-row-reverse items-center gap-2',
  top: 'flex flex-col-reverse items-start gap-1',
  bottom: 'flex flex-col items-start gap-1',
};
