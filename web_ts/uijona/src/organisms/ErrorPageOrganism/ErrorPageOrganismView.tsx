// ErrorPageOrganismView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterErrorPageOrganism } from './InterErrorPageOrganism';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { TextAtom } from '../../atoms/TextAtom';

export const ErrorPageOrganismView: React.FC<InterErrorPageOrganism> = ({
  errorCode,
  title,
  message,
  onGoHome,
  onGoBack,
  primaryLabel,
  secondaryLabel,
}) => (
  <div className="flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto">
    {errorCode && (
      <TextAtom
        as="p"
        size="2xl"
        className="font-extrabold text-blue-600 text-8xl leading-none mb-4 select-none"
      >
        {errorCode}
      </TextAtom>
    )}
    <TextAtom as="h1" size="2xl" className="font-bold text-gray-900 mb-2">
      {title}
    </TextAtom>
    <TextAtom as="p" size="base" color="muted" className="mb-8">
      {message}
    </TextAtom>
    <div className="flex flex-wrap gap-3 justify-center">
      {onGoHome && (
        <ButtonAtom variant="default" onClick={onGoHome}>
          {primaryLabel}
        </ButtonAtom>
      )}
      {onGoBack && (
        <ButtonAtom variant="outline" onClick={onGoBack}>
          {secondaryLabel}
        </ButtonAtom>
      )}
    </div>
  </div>
);
