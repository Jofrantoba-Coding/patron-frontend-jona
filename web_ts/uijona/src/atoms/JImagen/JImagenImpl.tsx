import React from 'react';
import { InterJImagen, JIMAGEN_DEFAULTS } from './InterJImagen';
import { JImagenView } from './JImagenView';

type JImagenImplProps = InterJImagen &
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, keyof InterJImagen | 'onError'>;

export const JImagenImpl = React.forwardRef<HTMLImageElement, JImagenImplProps>(
  (props, ref) => <JImagenView {...JIMAGEN_DEFAULTS} {...props} forwardedRef={ref} />
);
JImagenImpl.displayName = 'JImagen';
