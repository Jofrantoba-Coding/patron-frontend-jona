// JFormSectionImpl.tsx — JONA Implementation
import React, { useId } from 'react';
import { InterJFormSection, JFORMSECTION_DEFAULTS } from './InterJFormSection';
import { JFormSectionView } from './JFormSectionView';

export const JFormSectionImpl: React.FC<InterJFormSection> = ({ title, description, error, headingLevel, children }) => {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const describedBy = [description && descriptionId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <JFormSectionView
      title={title}
      description={description}
      error={error}
      headingLevel={headingLevel ?? JFORMSECTION_DEFAULTS.headingLevel}
      titleId={titleId}
      descriptionId={descriptionId}
      errorId={errorId}
      describedBy={describedBy}
    >
      {children}
    </JFormSectionView>
  );
};

JFormSectionImpl.displayName = 'JFormSection';
