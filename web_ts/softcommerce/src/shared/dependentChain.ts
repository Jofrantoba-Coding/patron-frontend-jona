// Dependent-select engine (R-CRUD-12, D8): framework-free, so the cascade, the dependent select and the register share it.
// A node loads its options from its parents' values, a response is applied only if it is the node's latest request, and a
// node whose parents are not all set stays empty and blocked.

export interface ChainOption {
  id: string;
  name: string;
}

/** A parent field and the query key its value travels under. */
export interface ChainParent {
  field: string;
  filterKey: string;
}

export interface ChainNode {
  name: string;
  /** Empty for a top-level node. */
  parents: ChainParent[];
  /** Plain fields (not selects) that are emptied when this one changes. */
  clearsOnChange?: string[];
  /** `first`: after each load the first option is reported through `onDefault` (S-CRUD-41). */
  defaultOption?: 'first';
}

export type ChainLoader = (name: string, filters: Record<string, string>) => Promise<ChainOption[]>;
type Values = Record<string, string | undefined>;

export interface DependentChain {
  /** Loads every node whose parent values changed since the last call (all of them on the first). */
  sync: (values: Values) => void;
  /** Starts the node's load again with the current parent values. */
  retry: (name: string, values: Values) => void;
  options: (name: string) => ChainOption[];
  /** True while the last load of the node failed. */
  failed: (name: string) => boolean;
  /** True while some parent of the node has no value. */
  blocked: (name: string, values: Values) => boolean;
}

/** Every field emptied when `name` changes: the levels below it, transitively, and the `clearsOnChange` of each. */
export function fieldsToClear(nodes: ChainNode[], name: string): string[] {
  const cleared: string[] = [];
  const add = (field: string) => cleared.includes(field) || cleared.push(field);
  const visit = (field: string) => {
    for (const extra of nodes.find((node) => node.name === field)?.clearsOnChange ?? []) add(extra);
    for (const node of nodes) {
      if (!node.parents.some((parent) => parent.field === field) || cleared.includes(node.name)) continue;
      add(node.name);
      visit(node.name);
    }
  };
  visit(name);
  return cleared;
}

/** Reports the option a `defaultOption` node should hold after a load: its first id, or '' when the load returned none. */
export type ChainDefault = (name: string, id: string) => void;

export function createDependentChain(nodes: ChainNode[], load: ChainLoader, onUpdate: () => void, onDefault?: ChainDefault): DependentChain {
  type State = { options: ChainOption[]; failed: boolean; parents?: string; token: number };
  const states = new Map<string, State>(nodes.map((node) => [node.name, { options: [], failed: false, token: 0 }]));
  const nodeOf = (name: string) => nodes.find((node) => node.name === name)!;
  const filtersOf = (node: ChainNode, values: Values) => Object.fromEntries(node.parents.map((p) => [p.filterKey, values[p.field] ?? '']));
  const blocked = (name: string, values: Values) => nodeOf(name).parents.some((p) => !values[p.field]);

  /** Starts a request (or empties a blocked node); only the outcome of the latest request of the node is applied. */
  const start = (name: string, values: Values) => {
    const state = states.get(name)!;
    const token = ++state.token;
    // A retry or a new parent value clears the failure at once, not when the response arrives.
    if (state.failed) {
      state.failed = false;
      onUpdate();
    }
    const apply = (options: ChainOption[], failed: boolean) => {
      if (state.token !== token) return;
      state.options = options;
      state.failed = failed;
      onUpdate();
    };
    // Only a successful load picks a default: a blocked or failed node holds no options and its value is already cleared.
    const loaded = (options: ChainOption[]) => {
      if (state.token !== token) return;
      apply(options, false);
      if (nodeOf(name).defaultOption === 'first') onDefault?.(name, options[0]?.id ?? '');
    };
    if (blocked(name, values)) apply([], false);
    else load(name, filtersOf(nodeOf(name), values)).then(loaded, () => apply([], true));
  };

  return {
    sync: (values) => {
      for (const node of nodes) {
        const parents = JSON.stringify(node.parents.map((p) => values[p.field] ?? ''));
        const state = states.get(node.name)!;
        if (state.parents === parents) continue;
        state.parents = parents;
        start(node.name, values);
      }
    },
    retry: (name, values) => start(name, values),
    options: (name) => states.get(name)!.options,
    failed: (name) => states.get(name)!.failed,
    blocked,
  };
}
