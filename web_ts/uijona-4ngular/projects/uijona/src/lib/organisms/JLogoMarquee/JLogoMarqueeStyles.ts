// JLogoMarqueeStyles.ts — JONA View (presentacion)
// Mapas de clases Tailwind del componente. Detalle de implementacion visual:
// se consumen desde el Impl y NO forman parte de la API publica de la libreria,
// para poder rediseniar sin romper a los consumidores.
import type { JLogoMarqueeSpeed } from './InterJLogoMarquee';

export const SPEED_CLASSES: Record<JLogoMarqueeSpeed, string> = {
  slow: 'animate-[marquee_48s_linear_infinite]',
  normal: 'animate-[marquee_32s_linear_infinite]',
  fast: 'animate-[marquee_20s_linear_infinite]',
};
