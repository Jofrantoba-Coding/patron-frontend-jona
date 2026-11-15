import { DANGER, FG, FG_MUTED } from '../../tema/clasesToken.js';
import { JTEXT_DEFAULTS, type InterJText } from './InterJText.js';

const TONOS = { default: FG, muted: FG_MUTED, danger: DANGER } as const;

/** Vista: render puro, y solo con clases de token. */
export function JTextView({
  children, id, role,
  tone = JTEXT_DEFAULTS.tone,
  as: Elemento = JTEXT_DEFAULTS.as,
}: InterJText) {
  return (
    <Elemento id={id} role={role} className={TONOS[tone]}>
      {children}
    </Elemento>
  );
}
