import React from 'react';
import { InterJImagen } from './InterJImagen';
interface JImagenViewProps extends InterJImagen {
    forwardedRef?: React.Ref<HTMLImageElement>;
}
export declare const JImagenView: React.FC<JImagenViewProps>;
export {};
