import { useState } from 'react';
import { JSEARCHBOX_DEFAULTS, type InterJSearchBox } from './InterJSearchBox.js';
import { JSearchBoxView } from './JSearchBoxView.js';

/**
 * Implementación: guarda el borrador del término (estado de interacción, no de dominio)
 * y lo entrega recortado al enviar. No sabe qué se busca ni dónde.
 */
export function JSearchBoxImpl({ label, placeholder, onSearch, submitLabel = JSEARCHBOX_DEFAULTS.submitLabel }: InterJSearchBox) {
  const [term, setTerm] = useState('');
  return (
    <JSearchBoxView
      label={label}
      placeholder={placeholder}
      submitLabel={submitLabel}
      term={term}
      onTermChange={setTerm}
      onSubmit={() => onSearch(term.trim())}
    />
  );
}
