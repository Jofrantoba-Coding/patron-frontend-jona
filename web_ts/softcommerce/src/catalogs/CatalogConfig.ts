import type { CatalogDef } from '../../mock-server/registry/schema.js';

/** Toolbar actions a catalog can expose; each maps to the permission flag of the same name. */
export type CrudAction = 'add' | 'modify' | 'eliminate' | 'clone' | 'details' | 'search' | 'refresh' | 'export';

/** The five register modes; a catalog may support a subset (R-REG-10). */
export type CrudMode = 'INSERT' | 'UPDATE' | 'DELETE' | 'CLONE' | 'DETAIL';

export type FieldConfig =
  /** The server-generated code: read-only, never part of a payload (R-CRUD-14). */
  | { kind: 'code'; name: string; label: string }
  | {
      kind: 'text';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      uppercase?: boolean;
      /** Registry `normalize` steps, applied (after a trim) to the payload; absent for the W1 configs. */
      normalize?: string[];
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
      /** W1 selects name a fixed `lookup`; registry selects (G1) name the `source` catalog, its static `where` forwarded as filters. */
      kind: 'select';
      name: string;
      label: string;
      required?: boolean;
      lookup?: 'empresas';
      source?: { catalog: string; where?: Record<string, string> };
      /** Parent fields (G2): the options are asked with their values as `filterKey` and the select clears when one changes. */
      dependsOn?: { field: string; filterKey: string }[];
    }
  | {
      kind: 'cascade';
      name: string;
      lookup: 'ubigeo';
      levels: { name: string; label: string }[];
      /** Ids from the root to the leaf's parent, used to prefill the levels. */
      ancestorsOf: (leafId: string) => string[];
      required?: boolean;
    };

/** Everything the generic list and register units need to serve one catalog. */
export interface CatalogConfig<T> {
  formId: string;
  title: string;
  /** Catalog name in `/v1/{catalog}`. */
  catalog: string;
  idKey: keyof T & string;
  columns: { key: keyof T & string; header: string; sortable?: boolean; /** `bool` renders Sí / No, `dec` the stored number as text (R-CRUD-1). */ format?: 'bool' | 'dec' }[];
  fields: FieldConfig[];
  /** Toolbar order; defaults to every action but `export`. */
  actions?: CrudAction[];
  /** Supported modes; absent means all five. Unsupported toolbar actions are not rendered (R-CRUD-16). */
  modes?: readonly CrudMode[];
  /** The registry entry this config derives from; it drives the declared validation order and messages. */
  entry?: CatalogDef;
}
