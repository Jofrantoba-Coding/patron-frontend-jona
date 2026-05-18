// BorderLayoutView.tsx — JONA View (render puro, sin lógica)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterBorderLayout } from './InterBorderLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';

type BorderLayoutViewProps = InterBorderLayout & {
  forwardedRef?: React.Ref<HTMLDivElement>;
};

export const BorderLayoutView: React.FC<BorderLayoutViewProps> = ({
  north, south, east, west, center,
  northClassName, southClassName, eastClassName, westClassName, centerClassName,
  className,
  style,
  forwardedRef,
}) => (
  <JPanel ref={forwardedRef} variant="ghost" padding="none" radius="none" style={style} className={cn('flex min-h-screen w-full max-w-full min-w-0 flex-col overflow-hidden bg-neutral-50', className)}>
    {north && (
      <JPanel as="header" variant="ghost" padding="none" radius="none" className={cn('flex-none w-full', northClassName)}>
        {north}
      </JPanel>
    )}
    <JPanel variant="ghost" padding="none" radius="none" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
      {west && (
        <JPanel as="aside" variant="ghost" padding="none" radius="none" className={cn('flex-none', westClassName)}>
          {west}
        </JPanel>
      )}
      <JPanel as="main" variant="ghost" padding="none" radius="none" className={cn('flex-1 min-w-0 overflow-auto', centerClassName)}>
        {center ?? <JPanel variant="ghost" padding="none" radius="none" className="text-neutral-300 text-sm">No content</JPanel>}
      </JPanel>
      {east && (
        <JPanel as="aside" variant="ghost" padding="none" radius="none" className={cn('flex-none', eastClassName)}>
          {east}
        </JPanel>
      )}
    </JPanel>
    {south && (
      <JPanel as="footer" variant="ghost" padding="none" radius="none" className={cn('flex-none w-full', southClassName)}>
        {south}
      </JPanel>
    )}
  </JPanel>
);
