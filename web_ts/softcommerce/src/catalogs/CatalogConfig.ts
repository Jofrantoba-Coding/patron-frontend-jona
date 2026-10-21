/** Toolbar actions a catalog can expose; each maps to the permission flag of the same name. */
export type CrudAction = 'add' | 'modify' | 'eliminate' | 'clone' | 'details' | 'search' | 'refresh' | 'export';

export type FieldConfig =
  | { kind: 'text'; name: string; label: string; required?: boolean; maxLength?: number; uppercase?: boolean }
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
}
