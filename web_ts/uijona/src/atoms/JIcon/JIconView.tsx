import React from 'react';
import { JButton } from '../JButton';
import { JICON_DEFAULTS, InterJIcon } from './InterJIcon';

type JIconViewProps = InterJIcon &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'> & {
    forwardedRef?: React.Ref<HTMLButtonElement>;
  };

export const JIconView: React.FC<JIconViewProps> = ({
  icon,
  label,
  variant = JICON_DEFAULTS.variant,
  loading = JICON_DEFAULTS.loading,
  disabled = JICON_DEFAULTS.disabled,
  type = JICON_DEFAULTS.type,
  className,
  style,
  forwardedRef,
  ...htmlProps
}) => (
  <JButton
    ref={forwardedRef}
    type={type}
    size="icon"
    variant={variant}
    loading={loading}
    disabled={disabled}
    aria-label={label}
    className={className}
    style={style}
    {...htmlProps}
  >
    {!loading && icon}
  </JButton>
);

JIconView.displayName = 'JIconView';
