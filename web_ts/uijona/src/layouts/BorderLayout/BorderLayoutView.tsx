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
  <JPanel
    ref={forwardedRef}
    layout="none"
    variant="ghost"
    padding="none"
    radius="none"
    style={style}
    className={cn('jborderlayout bg-neutral-50', className)}
  >
    {north && (
      <JPanel as="header" variant="ghost" padding="none" radius="none" data-slot="north" className={northClassName}>
        {north}
      </JPanel>
    )}
    {west && (
      <JPanel as="aside" variant="ghost" padding="none" radius="none" data-slot="west" className={westClassName}>
        {west}
      </JPanel>
    )}
    <JPanel as="main" variant="ghost" padding="none" radius="none" data-slot="center" className={cn('overflow-auto', centerClassName)}>
      {center}
    </JPanel>
    {east && (
      <JPanel as="aside" variant="ghost" padding="none" radius="none" data-slot="east" className={eastClassName}>
        {east}
      </JPanel>
    )}
    {south && (
      <JPanel as="footer" variant="ghost" padding="none" radius="none" data-slot="south" className={southClassName}>
        {south}
      </JPanel>
    )}
  </JPanel>
);
