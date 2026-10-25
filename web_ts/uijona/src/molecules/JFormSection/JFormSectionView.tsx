// JFormSectionView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { DANGER_FG, FG, FG_MUTED, TEXT_CAPTION, TEXT_SECTION } from '../../theme/tokenClasses';
import { InterJFormSection, JFormSectionHeadingLevel } from './InterJFormSection';

export interface JFormSectionViewProps extends Omit<InterJFormSection, 'headingLevel'> {
  headingLevel: JFormSectionHeadingLevel;
  titleId: string;
  descriptionId: string;
  errorId: string;
  describedBy?: string;
}

const HEADING_TAGS: Record<JFormSectionHeadingLevel, 'h2' | 'h3' | 'h4'> = { 2: 'h2', 3: 'h3', 4: 'h4' };

export const JFormSectionView: React.FC<JFormSectionViewProps> = ({
  title, description, error, headingLevel, titleId, descriptionId, errorId, describedBy, children,
}) => {
  const Heading = HEADING_TAGS[headingLevel];
  return (
    <div role="group" aria-labelledby={titleId} aria-describedby={describedBy} className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <Heading id={titleId} className={cn(TEXT_SECTION, FG)}>{title}</Heading>
        {description && <p id={descriptionId} className={cn(TEXT_CAPTION, FG_MUTED)}>{description}</p>}
      </div>
      {children}
      {error && <p id={errorId} className={cn(TEXT_CAPTION, DANGER_FG)}>{error}</p>}
    </div>
  );
};
