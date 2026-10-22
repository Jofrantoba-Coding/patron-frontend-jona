/** One option of a lookup: an id and the name shown for it. */
export interface LookupItem {
  id: string;
  name: string;
}

/**
 * Option lists for the register forms. Failures reject with `ApiError`;
 * the tenant comes from the session.
 */
export interface InterLookupService {
  empresas(): Promise<LookupItem[]>;
  /** Children of an ubigeo node; no parent means departamentos, an unknown parent means none. */
  ubigeoChildren(parent?: string): Promise<LookupItem[]>;
}
