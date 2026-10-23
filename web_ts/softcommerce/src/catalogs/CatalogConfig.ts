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
  | { kind: 'select'; name: string; label: string; required?: boolean; lookup: 'empresas' }
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
  columns: { key: keyof T & string; header: string; sortable?: boolean }[];
  fields: FieldConfig[];
  /** Toolbar order; defaults to every action but `export`. */
  actions?: CrudAction[];
  /** Supported modes; absent means all five. Unsupported toolbar actions are not rendered (R-CRUD-16). */
  modes?: readonly CrudMode[];
  /** The registry entry this config derives from; it drives the declared validation order and messages. */
  entry?: CatalogDef;
}
