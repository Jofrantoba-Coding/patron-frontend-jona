// UseConfirmView.tsx — JONA View (pure render)
import React from 'react';
import { InterJOptionPane, JOptionPane } from '../../molecules/JOptionPane';
import { ConfirmProviderProps } from './InterUseConfirm';

export interface UseConfirmViewProps extends Pick<ConfirmProviderProps, 'renderPane'> {
  children: React.ReactNode;
  /** The pane of the first queued request, or null when none is pending. */
  pane: InterJOptionPane | null;
  /** Request id: each request mounts a fresh pane (focus entry and return). */
  paneKey: number | null;
}

export const UseConfirmView: React.FC<UseConfirmViewProps> = ({ children, pane, paneKey, renderPane }) => (
  <>
    {children}
    {pane && (
      <React.Fragment key={paneKey ?? undefined}>
        {renderPane ? renderPane(pane) : <JOptionPane {...pane} />}
      </React.Fragment>
    )}
  </>
);
