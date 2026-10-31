// JFieldImpl.tsx — JONA Implementation
import React from 'react';
import { InterJField, JFieldControlProps, JFIELD_DEFAULTS } from './InterJField';
import { JFieldView } from './JFieldView';

/** Ids of the help and error texts, in description order (help, then error). */
export function describedByIds(id: string, description?: string, error?: string): string | undefined {
  return [description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
}

export const JFieldImpl: React.FC<InterJField> = (props) => {
  const { id, label, description, error, children } = props;
  // `??` and not a spread: an explicit `undefined` still takes the default.
  const resolved = {
    requiredLabel: props.requiredLabel ?? JFIELD_DEFAULTS.requiredLabel,
    span: props.span ?? JFIELD_DEFAULTS.span,
    as: props.as ?? JFIELD_DEFAULTS.as,
  };
  const required = !!props.required;
  const describedBy = describedByIds(id, description, error);
  const isFieldset = resolved.as === 'fieldset';

  // In fieldset mode the group carries the description; the controls keep their own names.
  const aria: JFieldControlProps = {
    id,
    ...(!isFieldset && describedBy ? { 'aria-describedby': describedBy } : {}),
    ...(error ? { 'aria-invalid': true as const } : {}),
    ...(required ? { 'aria-required': true as const } : {}),
  };

  return (
    <JFieldView
      id={id}
      label={label}
      required={required}
      requiredLabel={resolved.requiredLabel}
      description={description}
      error={error}
      span={resolved.span}
      as={resolved.as}
      descriptionId={`${id}-description`}
      errorId={`${id}-error`}
      describedBy={isFieldset ? describedBy : undefined}
      aria={aria}
    >
      {children}
    </JFieldView>
  );
};

JFieldImpl.displayName = 'JField';
