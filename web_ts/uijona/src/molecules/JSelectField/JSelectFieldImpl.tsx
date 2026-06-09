// JSelectFieldImpl.tsx — JONA Implementation
import React from 'react';
import { InterJSelectField } from './InterJSelectField';
import { JSelectFieldView } from './JSelectFieldView';

type JSelectFieldImplProps = InterJSelectField &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur' | 'value'> & {
    value?: string;
  };

export const JSelectFieldImpl = React.forwardRef<HTMLSelectElement, JSelectFieldImplProps>(
  (props, ref) => <JSelectFieldView {...props} forwardedRef={ref} />
);

JSelectFieldImpl.displayName = 'JSelectField';
