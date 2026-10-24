// Layer: View. Pure render of the Seguridad - Perfil screen over props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JCheckBox, JSelectField } from 'jona-ui';
import type { MenuNode } from '../../domain/menuTree';
import { UppercaseTextField } from '../../shared/ui/UppercaseTextField';
import { GuardedOptionPane } from '../uishell/DialogStackProvider';
import { UISEGURIDADPERFIL_DEFAULTS, type InterUiSeguridadPerfil } from './InterUiSeguridadPerfil';
import { PermisosDialog } from './permisos';

type ViewProps = InterUiSeguridadPerfil & typeof UISEGURIDADPERFIL_DEFAULTS;

/** Floors, not fixed heights: 44px touch target on mobile, compact from `sm`. */
const TOUCH = 'min-h-11 sm:min-h-9';

export function UiSeguridadPerfilView(props: ViewProps) {
  const { rows, selectedId, nodes, checked, selectedNode, notice, treeLoaded, saving } = props;
  const renderNodes = (level: MenuNode[]) => (
    <ul className="m-0 list-none pl-4">
      {level.map((node) => (
        <li key={node.id_menu}>
          <div
            aria-current={selectedNode === node.id_menu ? 'true' : undefined}
            className={`flex items-center ${TOUCH} rounded px-2 ${selectedNode === node.id_menu ? 'bg-neutral-100' : ''}`}
            onClick={() => props.onSelectNode(node.id_menu)}
          >
            {/* The label names the checkbox for assistive tech only: clicking the visible text selects the node, it never toggles it (desktop JTree). */}
            <JCheckBox label={node.descripcion} labelClassName="sr-only" checked={checked[node.id_menu] ?? false} onCheckedChange={(value) => props.onToggleNode(node.id_menu, value)} />
            <button type="button" className={`${TOUCH} flex-1 bg-transparent text-left`} onClick={() => props.onSelectNode(node.id_menu)}>
              {node.descripcion}
            </button>
          </div>
          {renderNodes(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={props.title} className="grid min-w-0 gap-4 lg:grid-cols-2">
      <div className="grid min-w-0 content-start gap-3">
        {props.status === 'failed' && <JAlert variant="danger" role="alert">{props.loadError}</JAlert>}
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span>{props.descriptionLabel}</span>
            <UppercaseTextField value={props.descripcion} maxLength={255} uppercase onChange={props.onDescripcionChange} />
          </label>
          <JSelectField id="perfil-tipo" label={props.tipoLabel} placeholder={props.tipoPlaceholder} options={props.tipoOptions} value={props.tipoTrabajador} onChange={props.onTipoChange} />
        </div>
        <ul role="listbox" aria-label="Perfiles" className="m-0 max-h-80 list-none overflow-auto p-0">
          {rows.map((row) => (
            <li
              key={row.id_tipo_perfil}
              role="option"
              aria-selected={row.id_tipo_perfil === selectedId}
              onClick={() => props.onSelectRow(row.id_tipo_perfil)}
              className={`flex ${TOUCH} cursor-pointer items-center justify-between gap-2 px-2 ${row.id_tipo_perfil === selectedId ? 'bg-neutral-100' : ''}`}
            >
              <span>{row.descripcion}</span>
              <span className="text-neutral-500">{row.tipo_trabajador}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <JButton className={TOUCH} onClick={props.onLoadTree}>{props.loadLabel}</JButton>
          <JButton className={TOUCH} onClick={props.onPermisosForm}>{props.permisosFormLabel}</JButton>
        </div>
      </div>
      <div className="grid min-w-0 content-start gap-3">
        <h2 className="m-0 text-base font-semibold">{props.treeTitle || props.treeHeader}</h2>
        <div className="max-h-96 max-w-full overflow-auto">{renderNodes(nodes)}</div>
        <div className="flex flex-wrap gap-2">
          <JButton className={TOUCH} disabled={!treeLoaded || saving} onClick={props.onSave}>{props.saveLabel}</JButton>
          <JButton className={TOUCH} disabled={!treeLoaded} onClick={props.onPermisos}>{props.permisosLabel}</JButton>
        </div>
      </div>
      {props.dialog && <PermisosDialog {...props.dialog} onClose={props.onCloseDialog} />}
      <GuardedOptionPane open={notice !== undefined} variant="info" title={notice?.title ?? ''} description={notice?.message} confirmLabel={props.closeLabel} cancelLabel="Cerrar" onConfirm={props.onCloseNotice} onClose={props.onCloseNotice} />
    </section>
  );
}
