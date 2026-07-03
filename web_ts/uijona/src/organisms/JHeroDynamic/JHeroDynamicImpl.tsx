// JHeroDynamicImpl.tsx — JONA Implementation (estado: rotación del titular)
import React, { useEffect, useState } from 'react';
import { InterJHeroDynamic, JHERO_DYNAMIC_DEFAULTS } from './InterJHeroDynamic';
import { JHeroDynamicView } from './JHeroDynamicView';

export const JHeroDynamicImpl: React.FC<InterJHeroDynamic> = (props) => {
  const { rotatingWords, intervalMs = JHERO_DYNAMIC_DEFAULTS.intervalMs, ...rest } = props;
  const words = rotatingWords.length > 0 ? rotatingWords : [''];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    // Respeta la preferencia de movimiento reducido: no rota.
    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  return <JHeroDynamicView {...rest} word={words[index % words.length]} />;
};

JHeroDynamicImpl.displayName = 'JHeroDynamic';
