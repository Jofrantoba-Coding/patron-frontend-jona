// JFieldView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { DANGER_FG, FG, FG_MUTED, TEXT_CAPTION } from '../../theme/tokenClasses';
import { InterJField, JFieldControlProps, JFieldSpan } from './InterJField';

export interface JFieldViewProps extends Required<Pick<InterJField, 'id' | 'label' | 'requiredLabel' | 'span' | 'as'>> {
  required: boolean;
  description?: string;
  error?: string;
  descriptionId: string;
  errorId: string;
  /** `aria-describedby` of the group in fieldset mode. */
  describedBy?: string;
  aria: JFieldControlProps;
  children: InterJField['children'];
}

/** Below `md` every field spans the 12 columns; from `md` it takes its span. */
const SPAN_CLASSES: Record<JFieldSpan, string> = {
  3: 'col-span-12 md:col-span-3',
  4: 'col-span-12 md:col-span-4',
  6: 'col-span-12 md:col-span-6',
  12: 'col-span-12',
};

const LABEL_CLASSES = `text-sm font-medium ${FG}`;

export const JFieldView: React.FC<JFieldViewProps> = ({
  id, label, required, requiredLabel, description, error, span, as,
  descriptionId, errorId, describedBy, aria, children,
}) => {
  const marker = required && (
    <span className={cn('ml-0.5', DANGER_FG)} aria-hidden="true" title={requiredLabel}>*</span>
  );
  const messages = (
    <>
      {description && <p id={descriptionId} className={cn(TEXT_CAPTION, FG_MUTED)}>{description}</p>}
      {error && <p id={errorId} className={cn(TEXT_CAPTION, DANGER_FG)}>{error}</p>}
    </>
  );

  if (as === 'fieldset') {
    return (
      <fieldset
        id={`${id}-group`}
        aria-describedby={describedBy}
        className={cn('flex min-w-0 flex-col gap-1.5 border-0 p-0', SPAN_CLASSES[span])}
      >
        <legend className={cn('mb-1.5 p-0', LABEL_CLASSES)}>{label}{marker}</legend>
        {children(aria)}
        {messages}
      </fieldset>
    );
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', SPAN_CLASSES[span])}>
      <label htmlFor={id} className={LABEL_CLASSES}>{label}{marker}</label>
      {children(aria)}
      {messages}
    </div>
  );
};
