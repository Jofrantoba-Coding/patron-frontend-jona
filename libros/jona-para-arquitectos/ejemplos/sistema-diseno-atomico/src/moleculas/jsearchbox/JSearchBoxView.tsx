import { JButton } from '../../atomos/jbutton/index.js';
import { JInput } from '../../atomos/jinput/index.js';
import { INLINE } from '../../tema/clasesToken.js';
import type { InterJSearchBoxVista } from './InterJSearchBox.js';

/** Vista: compone los átomos JInput y JButton en un formulario de búsqueda; render puro. */
export function JSearchBoxView({ label, placeholder, submitLabel, term, onTermChange, onSubmit }: InterJSearchBoxVista) {
  return (
    <form
      role="search"
      aria-label={label}
      className={INLINE}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <JInput type="search" value={term} onChange={onTermChange} placeholder={placeholder} aria-label={label} />
      <JButton type="submit" variant="secondary">{submitLabel}</JButton>
    </form>
  );
}
