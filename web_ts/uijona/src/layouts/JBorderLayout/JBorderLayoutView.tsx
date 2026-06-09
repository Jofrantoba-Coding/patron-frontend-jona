// JBorderLayoutView.tsx — JONA View (render puro, sin lógica)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJBorderLayout } from './InterJBorderLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';

type JBorderLayoutViewProps = InterJBorderLayout & {
  forwardedRef?: React.Ref<HTMLDivElement>;
};

export const JBorderLayoutView: React.FC<JBorderLayoutViewProps> = ({
  north, south, east, west, center,
  northClassName, southClassName, eastClassName, westClassName, centerClassName,
  className,
  style,
  forwardedRef,
}) => (
  <JPanel
    ref={forwardedRef}
    layout="border"
    variant="ghost"
    padding="none"
    radius="none"
    style={style}
    className={cn('bg-neutral-50', className)}
  >
    {north && (
      <JPanel as="header" area="top" variant="ghost" padding="none" radius="none" className={northClassName}>
        {north}
      </JPanel>
    )}
    {west && (
      <JPanel as="aside" area="left" variant="ghost" padding="none" radius="none" className={westClassName}>
        {west}
      </JPanel>
    )}
    <JPanel as="main" area="center" variant="ghost" padding="none" radius="none" className={cn('overflow-auto', centerClassName)}>
      {center}
    </JPanel>
    {east && (
      <JPanel as="aside" area="right" variant="ghost" padding="none" radius="none" className={eastClassName}>
        {east}
      </JPanel>
    )}
    {south && (
      <JPanel as="footer" area="bottom" variant="ghost" padding="none" radius="none" className={southClassName}>
        {south}
      </JPanel>
    )}
  </JPanel>
);
