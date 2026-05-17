import React from 'react';
import { InterJTextArea, JTEXTAREA_DEFAULTS } from './InterJTextArea';
import { JTextAreaView } from './JTextAreaView';

type JTextAreaImplProps = InterJTextArea &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    | 'onChange' | 'onFocus' | 'onBlur' | 'onKeyDown'
  >;

export const JTextAreaImpl = React.forwardRef<HTMLTextAreaElement, JTextAreaImplProps>(
  (props, ref) => <JTextAreaView {...JTEXTAREA_DEFAULTS} {...props} forwardedRef={ref} />
);

JTextAreaImpl.displayName = 'JTextArea';
