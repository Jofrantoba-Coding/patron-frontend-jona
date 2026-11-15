import { useId } from 'react';
import { JFIELD_DEFAULTS, type InterJField } from './InterJField.js';
import { JFieldView } from './JFieldView.js';

/**
 * Implementación: aplica los DEFAULTS y resuelve la accesibilidad de la molécula,
 * que ningún átomo puede resolver solo: genera los identificadores y asocia la
 * etiqueta, la ayuda y el error con el campo.
 */
export function JFieldImpl(props: InterJField) {
  const id = useId();
  return (
    <JFieldView
      {...JFIELD_DEFAULTS}
      {...props}
      inputId={`${id}-campo`}
      hintId={props.hint ? `${id}-ayuda` : undefined}
      errorId={props.error ? `${id}-error` : undefined}
    />
  );
}
