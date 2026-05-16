// SectionShellAtomView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { InterSectionShellAtom, SectionShellMaxWidth } from './InterSectionShellAtom';

const maxWidthClasses: Record<SectionShellMaxWidth, string> = {
  sm:  'max-w-screen-sm',
  md:  'max-w-screen-md',
  lg:  'max-w-screen-lg',
  xl:  'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
};

export const SectionShellAtomView: React.FC<InterSectionShellAtom> = ({
  as: Tag = 'div',
  maxWidth = 'xl',
  className,
  children,
  ...props
}) => (
  <Tag
    className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidthClasses[maxWidth], className)}
    {...props}
  >
    {children}
  </Tag>
);
