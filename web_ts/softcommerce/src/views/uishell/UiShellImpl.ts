// Layer: Implementation. Menu loading, tab workspace and the unknown-leaf notice of the shell.
import { useCallback, useEffect, useReducer, useState } from 'react';
import type { MenuItem } from '../../domain/menuTree';
import { EMPTY_WORKSPACE, workspaceReducer } from '../../domain/workspace';
import type { InterShellService } from '../../services/InterShellService';
import { toFailure } from '../../shared/toFailure';
import { findForm, type FormRegistry } from './formRegistry';
import type { InterUiShell, ShellNotice } from './InterUiShell';

type MenuState = Pick<InterUiShell, 'menuStatus' | 'menuItems' | 'menuError' | 'menuErrorTraceId'>;
const LOADING: MenuState = { menuStatus: 'loading', menuItems: [] };

export function useUiShellImpl(service: InterShellService, registry: FormRegistry): Omit<InterUiShell, 'renderForm'> {
  const [menu, setMenu] = useState<MenuState>(LOADING);
  const [attempt, setAttempt] = useState(0);
  const [workspace, dispatch] = useReducer(workspaceReducer, EMPTY_WORKSPACE);
  const [notice, setNotice] = useState<ShellNotice | undefined>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    service
      .menu()
      .then((items) => active && setMenu({ menuStatus: 'ready', menuItems: items }))
      .catch((error: unknown) => {
        if (!active) return;
        const { message, traceId } = toFailure(error);
        setMenu({ menuStatus: 'error', menuItems: [], menuError: message, menuErrorTraceId: traceId });
      });
    return () => {
      active = false;
    };
  }, [service, attempt]);

  const onLeafSelect = useCallback(
    (item: MenuItem) => {
      setIsMenuOpen(false);
      if (findForm(registry, item.nombre)) dispatch({ type: 'open', formId: item.nombre, title: item.descripcion });
      else setNotice({ title: item.descripcion, description: 'Esta opción aún no está disponible.' });
    },
    [registry],
  );

  return {
    ...menu,
    isMenuOpen,
    tabs: workspace.tabs,
    activeId: workspace.activeId,
    notice,
    onLeafSelect,
    onTabSelect: (formId) => dispatch({ type: 'select', formId }),
    onTabClose: (formId) => dispatch({ type: 'close', formId }),
    onMenuRetry() {
      setMenu(LOADING);
      setAttempt((current) => current + 1);
    },
    onMenuToggle: () => setIsMenuOpen((open) => !open),
    onNoticeClose: () => setNotice(undefined),
  };
}
