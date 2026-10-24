import type { CatalogDef } from '../../mock-server/registry/schema.js';
import type { PermissionFlag } from '../domain/permissions';
import type { LookupDialogConfig } from '../shared/ui/LookupDialog/InterLookupDialog';

/** Toolbar actions a catalog can expose; each maps to the permission flag of the same name. */
export type CrudAction = 'add' | 'modify' | 'eliminate' | 'clone' | 'details' | 'search' | 'refresh' | 'export';

/** The five register modes; a catalog may support a subset (R-REG-10). */
export type CrudMode = 'INSERT' | 'UPDATE' | 'DELETE' | 'CLONE' | 'DETAIL';

/** A condition over another field's value (`{ field, in }`), evaluated by the shared predicate on the client and the server. */
export interface FieldCondition {
  field: string;
  in: string[];
}

/** Overrides a company parameter applies to a field (R-MST-11): while `param` holds a listed value (the gate test), `set` replaces `required` and the cascade `filter`. */
export interface ParamOverride {
  param: string;
  in?: unknown[];
  set: { required?: boolean; filter?: Record<string, string> };
}

/** G8 conditional behavior (R-CRUD-13): visibility, editability and requiredness by another field's value; `clearsOnChange` empties fields when this one changes. */
export interface ConditionalProps {
  /** The company parameter that gives the field (R-REG-17): with it off the field is absent from the register, validation and payload. */
  gate?: { param: string; in?: unknown[] };
  byParam?: ParamOverride;
  visibleWhen?: FieldCondition;
  enabledWhen?: FieldCondition;
  requiredWhen?: FieldCondition;
  clearsOnChange?: string[];
  /** State a named rule (`docIdentidad`) gives the field for the current values, on top of the conditions (D9); set by the registry adapter. */
  ruleState?: (values: Record<string, string>) => { hidden?: boolean; disabled?: boolean; required?: boolean } | undefined;
}

type PlainField =
  /** The server-generated code: read-only, never part of a payload (R-CRUD-14). */
  | { kind: 'code'; name: string; label: string }
  | {
      kind: 'text';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      /** A length the value must reach, plain or chosen by another field's value (`minLenWhen`, first match wins; R-REG-4). */
      minLen?: number;
      minLenWhen?: { when: { field: string; in: string[] }; len: number }[];
      /** A maximum length chosen by another field's value (first match wins), else `maxLength` (R-REG-2). */
      maxWhen?: { when: { field: string; in: string[] }; len: number }[];
      uppercase?: boolean;
      /** Registry `normalize` steps, applied (after a trim) to the payload; absent for the W1 configs. */
      normalize?: string[];
      /** The sentence of a blank required value when no entry gives one (an action dialog: `Ingrese Motivo`). */
      message?: string;
      /** A `textarea` field (R-CRUD-18): the register shows a multi-line input of `rows` lines (default 4); every check is the text's. */
      multiline?: boolean;
      rows?: number;
    }
  | {
      /**
       * A password (R-CRUD-17): masked, `maxLength` characters, with a companion `<name>_confirmacion` while `confirm` is on. It is required on INSERT and CLONE, a
       * blank pair on UPDATE means "keep the stored one" and sends neither key, and it never renders on DETAIL or DELETE.
       */
      kind: 'password';
      name: string;
      label: string;
      maxLength: number;
      confirm: boolean;
      /** The sentence of a confirmation that differs; the shared default when absent. */
      confirmMessage?: string;
    }
  | {
      /** A checkbox; the form state is 'true' | 'false' and the payload a boolean (codec, D7). */
      kind: 'boolean';
      name: string;
      label: string;
      /** A value for INSERT, or per mode; a per-mode entry also overrides a cloned value (R-CRUD-15). */
      default?: boolean | Partial<Record<CrudMode, boolean>>;
      /** Modes in which the value is shown but not editable. */
      readOnlyOn?: readonly CrudMode[];
    }
  | {
      /** A static list: the form state and the payload carry the option code; the label is shown (G7). */
      kind: 'options';
      name: string;
      label: string;
      required?: boolean;
      options: readonly { value: string; label: string }[];
      display: 'select' | 'radio';
      default?: string | Partial<Record<CrudMode, string>>;
      readOnlyOn?: readonly CrudMode[];
    }
  | {
      /**
       * An integer (scale 0, G4): digits only, `maxLength` digits; `range` bounds the value on submit (R-MOCK-10). A decimal
       * (scale > 0) takes the pattern `-?[0-9]*(\.[0-9]*)?` with no precision limit; `min` / `exclusiveMin` reject on submit.
       */
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      scale: number;
      maxLength?: number;
      range?: { min?: number; max?: number };
      min?: number;
      exclusiveMin?: number;
      /** The text a decimal starts with on INSERT (or per mode) and the one `blankToDefault` restores on blur (S-CRUD-26). */
      default?: string | Partial<Record<CrudMode, string>>;
      blankToDefault?: boolean;
      readOnlyOn?: readonly CrudMode[];
      /** Registry `normalize` steps (`digits`, `padLeft:n`); `padLeft` is applied on blur and on submit. */
      normalize?: string[];
    }
  | {
      /**
       * A calendar date (G5): the form state is the masked `dd/MM/yyyy` text and the payload the ISO `yyyy-MM-dd` (codec, D7).
       * `default` is `today` or an ISO date, for INSERT or per mode; `notFuture`, `min` (ISO) and `afterField` are available
       * but no Wave 2 catalog enables them.
       */
      kind: 'date';
      name: string;
      label: string;
      required?: boolean;
      default?: string | Partial<Record<CrudMode, string>>;
      readOnlyOn?: readonly CrudMode[];
      notFuture?: boolean;
      min?: string;
      afterField?: string;
    }
  | {
      /** W1 selects name a fixed `lookup`; registry selects (G1) name the `source` catalog, its static `where` forwarded as filters. */
      kind: 'select';
      name: string;
      label: string;
      required?: boolean;
      lookup?: 'empresas';
      source?: { catalog: string; where?: Record<string, string> };
      /** The id a select starts with on INSERT (or per mode) and the modes where it is shown but not editable (G6). */
      default?: string | Partial<Record<CrudMode, string>>;
      readOnlyOn?: readonly CrudMode[];
      /** Parent fields (G2): the options are asked with their values as `filterKey` and the select clears when one changes. */
      dependsOn?: { field: string; filterKey: string }[];
      /** `first` selects the first option after each load or parent change (S-CRUD-41). */
      defaultOption?: 'first';
      /** The sentence of a blank required value when no entry gives one (an action dialog: `Seleccione Padron`). */
      message?: string;
      /** Choosing an option copies its name into `target` (empty for the ids in `unless`, which are typed, R-MST-11); client side like a lookup `fill`. */
      fillLabel?: { target: string; unless?: string[] };
    }
  | {
      /** A code box over a search dialog (R-CRUD-19): the form state and the payload carry the id; `display` is the record key that holds its description. */
      kind: 'lookup';
      name: string;
      label: string;
      required?: boolean;
      source: { catalog: string; where?: Record<string, string> };
      display: string;
      /** The source's id key, code width (typed-code padding, R-LKP-6) and the key of the description of a row. */
      idKey: string;
      codeWidth: number;
      optionLabel: string;
      picker: LookupDialogConfig;
      /** What a pick copies into the register's own fields (`{ field: source key }`) and which of those the register then shows read-only (R-REG-13). */
      fill?: Record<string, string>;
      fillReadOnly?: string[];
      /** Modes where the picker is disabled (Vendedor UPDATE). */
      readOnlyOn?: readonly CrudMode[];
    }
  | {
      kind: 'cascade';
      name: string;
      lookup: 'ubigeo';
      /** `article` (un / una) words the MS style message of the level ("debes Seleccionar una Provincia"). */
      levels: { name: string; label: string; article?: 'un' | 'una' }[];
      /** Ids from the root to the leaf's parent, used to prefill the levels. */
      ancestorsOf: (leafId: string) => string[];
      required?: boolean;
      /** The levels are form-only (ZonaDistancia): none of them is sent, the leaf included; another select may depend on the leaf (R-CRUD-12). */
      transient?: boolean;
      /** Where the stored leaf comes from: the record key that holds a ubigeo code, cut to its first `prefixLen` characters (the distrito). */
      restoreFrom?: { field: string; prefixLen: number };
      /** Sent with every level request (`{ has: 'zonas' }` keeps the ubigeos that hold an active zona). */
      filter?: Record<string, string>;
      /** What a company parameter changes in the cascade (the zona filter of the Cliente direcciones, R-MST-11). */
      byParam?: ParamOverride;
    };

/** Every kind but the code and the cascade can be conditional. */
export type FieldConfig = PlainField extends infer F ? (F extends { kind: 'code' | 'cascade' } ? F : F & ConditionalProps) : never;

/** When a row action is enabled (R-ACT-2): the register modes, a selected row, a condition on it and a condition no row of the grid may meet. */
export interface ActionCondition {
  modes?: CrudMode[];
  selection?: boolean;
  row?: FieldCondition;
  noRow?: FieldCondition;
}

/**
 * A declared row action (R-ACT-1). `immediate` calls the action endpoint `/actions/{id}` at once (the server runs `server`); `deferred` changes a pending
 * child row through the client `rule` and is saved with the parent. `dialog` collects the input of the action.
 */
export interface ActionConfig {
  id: string;
  label: string;
  placement: 'list-toolbar' | 'register' | 'child';
  /** The permission flag of the form that grants it (default `modify`). */
  flag: PermissionFlag;
  kind: 'deferred' | 'immediate';
  enabledWhen?: ActionCondition;
  confirm?: string;
  dialog?: { title: string; fields: FieldConfig[] };
  server?: string;
  rule?: string;
  /** Constants the named rule reads (the entity word of the anexo messages). */
  params?: Record<string, unknown>;
}

/** Everything the generic list and register units need to serve one catalog. */
export interface CatalogConfig<T> {
  formId: string;
  title: string;
  /** Catalog name in `/v1/{catalog}`. */
  catalog: string;
  idKey: keyof T & string;
  columns: { key: keyof T & string; header: string; sortable?: boolean; /** `bool` renders Sí / No, `dec` the stored number as text, `date` dd/MM/yyyy (R-CRUD-1). */ format?: 'bool' | 'dec' | 'date'; /** The company parameter that shows the column (R-REG-17); absent means always. */ gate?: { param: string; in?: unknown[] } }[];
  fields: FieldConfig[];
  /** Toolbar order; defaults to every action but `export`. */
  actions?: CrudAction[];
  /** Supported modes; absent means all five. Unsupported toolbar actions are not rendered (R-CRUD-16). */
  modes?: readonly CrudMode[];
  /** The registry entry this config derives from; it drives the declared validation order and messages. */
  entry?: CatalogDef;
  /** The child grids of a master register (R-REG-14), in declared order; one tab each. */
  children?: ChildConfig[];
  /** Register tabs of parent fields after `General`, which holds every field no tab lists (R-MD-1); the child tabs follow. */
  layout?: { title: string; fields: string[] }[];
  /** Child resources with no register tab (`tab: false`, R-MD-10): reached only from a panel such as Autorizar Series, never from the register. */
  resources?: ChildConfig[];
  /** The row actions the entry declares (R-REG-15); `actions` above is the toolbar order. A child's own are on its `ChildConfig`. */
  rowActions?: ActionConfig[];
}

/** One child of a master register: its own config drives the child dialog (R-MD-3). */
export interface ChildConfig {
  /** The nested route segment. */
  name: string;
  /** The register tab title. */
  title: string;
  removal: 'deactivate' | 'delete' | 'none';
  /** `dialog` opens the child register; `inline` puts the entry above the grid (R-MD-3); `none` has no Agregar: the rows come from the actions; `picker` opens a named picker and a pick adds the row. */
  entryMode: 'dialog' | 'inline' | 'none' | 'picker';
  /** The picker of a `picker` child (R-MST-12): its name, the row column that takes the picked id, the veto sentence and the columns copied from the picked row for the grid. */
  pick?: { picker: string; field: string; message: string; copy?: Record<string, string> };
  /** The grid messages of Quitar (R-MD-4): no selected row, the desktop question (absent when it did not ask) and a row that is already deactivated. */
  quitar: { none: string; confirm?: string; already: string };
  /** The company parameter that shows the tab; absent means always (R-REG-17). */
  gate?: { param: string; in?: unknown[] };
  /** The actions of the child grid toolbar (R-ACT-1). */
  actions?: ActionConfig[];
  config: CatalogConfig<Record<string, string>>;
}
