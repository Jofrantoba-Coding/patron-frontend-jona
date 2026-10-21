// JDrawerImpl.tsx — JONA Implementation
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { InterJDrawer, JDRAWER_DEFAULTS } from './InterJDrawer';
import { JDrawerView } from './JDrawerView';
import { useFocusTrap } from '../../lib/focus';

export const JDrawerImpl: React.FC<InterJDrawer> = (props) => {
  const merged = { ...JDRAWER_DEFAULTS, ...props };
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const onPanelKeyDown = useFocusTrap(panelRef, merged.open);

  // Unlike JDialog, the drawer panel is ALWAYS in the DOM (it slides with a
  // transform), so while closed it must also leave the tab order. Set
  // imperatively: React 18 and 19 serialize the `inert` prop differently.
  useLayoutEffect(() => {
    panelRef.current?.toggleAttribute('inert', !merged.open);
  }, [merged.open]);

  useEffect(() => {
    if (!merged.open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') props.onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [merged.open, props.onClose]);

  return (
    <JDrawerView
      open={merged.open}
      side={merged.side}
      size={merged.size}
      showCloseButton={merged.showCloseButton}
      title={props.title}
      description={props.description}
      className={props.className}
      footer={props.footer}
      onClose={props.onClose}
      onOverlayClick={props.onClose}
      panelRef={panelRef}
      onPanelKeyDown={onPanelKeyDown}
    >
      {props.children}
    </JDrawerView>
  );
};

JDrawerImpl.displayName = 'JDrawer';
