// Layer: Implementation. Perfil list and filters, the menu tree edits and the notices of the Seguridad - Perfil screen.
import { useEffect, useMemo, useState } from 'react';
import { buildMenuTree } from '../../domain/menuTree';
import type { MenuChange, PerfilMenuNode } from '../../services/InterPerfilGrantsService';
import { useServices } from '../../services/ServicesContext';
import { toFailure } from '../../shared/toFailure';
import type { InterUiSeguridadPerfil, PerfilNotice, PerfilRow, SelectOption } from './InterUiSeguridadPerfil';

interface TipoRow {
  id_tipo_trabajador: string;
  descripcion: string;
  estado?: boolean;
}

const FETCH_ALL = { page: 1, pageSize: 1000 };
const DESCRIPTION_MAX = 255;
/** The desktop `JOptionPane.showMessageDialog(this, msg)` has no title: the Swing default is `Mensaje`. */
const MESSAGE_TITLE = 'Mensaje';
export const SAVED = 'Permisos actualizados correctamente';

type Load = { status: 'loading' } | { status: 'ready'; perfiles: PerfilRow[]; tipos: TipoRow[] } | { status: 'failed'; message: string };

/** `Desc.` contains (the desktop regex `.*text.*`) and `T Trabajador` is the perfil tipo; both together. */
const filterRows = (perfiles: PerfilRow[], descripcion: string, tipo: string) =>
  perfiles.filter((row) => (descripcion === '' || row.descripcion.includes(descripcion)) && (tipo === '' || row.id_tipo_trabajador === tipo));

const checksOf = (nodes: PerfilMenuNode[]) => Object.fromEntries(nodes.map((node) => [node.id_menu, node.visible]));

/** The nodes whose checkbox differs from the stored menu, in menu order: the only thing `Guardar` sends. */
const menuChanges = (stored: PerfilMenuNode[], checked: Record<number, boolean>): MenuChange[] =>
  stored.filter((node) => checked[node.id_menu] !== node.visible).map((node) => ({ id: node.id_menu, visible: checked[node.id_menu] }));

export function useUiSeguridadPerfilImpl(): InterUiSeguridadPerfil {
  const { catalog, perfilGrants } = useServices();
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [descripcion, setDescripcion] = useState('');
  const [tipoTrabajador, setTipoTrabajador] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loaded, setLoaded] = useState<PerfilRow | undefined>();
  const [stored, setStored] = useState<PerfilMenuNode[]>([]);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<PerfilNotice | undefined>();

  useEffect(() => {
    let live = true;
    Promise.all([catalog<PerfilRow & { activo?: boolean }>('tipos-trabajador-perfil').list(FETCH_ALL), catalog<TipoRow>('tipos-trabajador').list(FETCH_ALL)]).then(
      ([perfiles, tipos]) => live && setLoad({ status: 'ready', perfiles: perfiles.items.filter((row) => row.activo !== false), tipos: tipos.items.filter((row) => row.estado !== false) }),
      (error) => live && setLoad({ status: 'failed', message: toFailure(error).message }),
    );
    return () => {
      live = false;
    };
  }, [catalog]);

  const perfiles = useMemo(() => (load.status === 'ready' ? load.perfiles : []), [load]);
  const rows = useMemo(() => filterRows(perfiles, descripcion, tipoTrabajador), [perfiles, descripcion, tipoTrabajador]);
  const nodes = useMemo(() => buildMenuTree(stored), [stored]);
  const tipoOptions = useMemo<SelectOption[]>(() => (load.status === 'ready' ? load.tipos.map((t) => ({ value: t.id_tipo_trabajador, label: t.descripcion })) : []), [load]);
  const notify = (title: string, message: string) => setNotice({ title, message });
  const fail = (error: unknown) => notify(MESSAGE_TITLE, toFailure(error).message);

  /** Each filter change re-applies both filters and selects the first row that remains (desktop `filtrar`). */
  const refilter = (nextDescripcion: string, nextTipo: string) => {
    setDescripcion(nextDescripcion);
    setTipoTrabajador(nextTipo);
    setSelectedId(filterRows(perfiles, nextDescripcion, nextTipo)[0]?.id_tipo_perfil);
  };

  const selectedRow = rows.find((row) => row.id_tipo_perfil === selectedId);

  const onLoadTree = async () => {
    if (rows.length === 0) return; // the desktop returns silently on an empty table
    if (!selectedRow) return notify('Perfiles', 'Seleccione Fila');
    try {
      const menu = await perfilGrants.menu(selectedRow.id_tipo_perfil);
      setLoaded(selectedRow);
      setStored(menu);
      setChecked(checksOf(menu));
      setSelectedNode(undefined);
    } catch (error) {
      fail(error);
    }
  };

  const onSave = async () => {
    if (!loaded) return;
    setSaving(true);
    try {
      const menu = await perfilGrants.saveMenu(loaded.id_tipo_perfil, menuChanges(stored, checked));
      setStored(menu);
      setChecked(checksOf(menu));
      notify(MESSAGE_TITLE, SAVED);
    } catch (error) {
      fail(error); // the edits stay on screen
    } finally {
      setSaving(false);
    }
  };

  return {
    rows,
    selectedId,
    descripcion,
    tipoTrabajador,
    tipoOptions,
    status: load.status,
    loadError: load.status === 'failed' ? load.message : undefined,
    treeTitle: loaded?.descripcion ?? '',
    nodes,
    checked,
    selectedNode,
    treeLoaded: loaded !== undefined,
    saving,
    notice,
    onDescripcionChange: (value) => refilter(value.slice(0, DESCRIPTION_MAX).toUpperCase(), tipoTrabajador),
    onTipoChange: (value) => refilter(descripcion, value),
    onSelectRow: setSelectedId,
    onLoadTree,
    onToggleNode: (id, value) => setChecked((current) => ({ ...current, [id]: value })),
    onSelectNode: setSelectedNode,
    onSave,
    onCloseNotice: () => setNotice(undefined),
  };
}
