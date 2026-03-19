import type { ElementType, HTMLAttributes, PropsWithChildren } from 'react';

type TextTone = 'default' | 'muted' | 'strong' | 'danger';

export interface TextAtomProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: TextTone;
}

export function TextAtom({
  as: Component = 'p',
  tone = 'default',
  className = '',
  children,
  ...props
}: PropsWithChildren<TextAtomProps>) {
  const classes = ['text-atom', `text-atom--${tone}`, className].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
