import { ReactNode } from 'react';

export interface InterComponentPreview {
  children: ReactNode;
  onFullscreen?: () => void;
}
