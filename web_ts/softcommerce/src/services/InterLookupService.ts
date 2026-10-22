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
  /**
   * Active options of a registry catalog (`GET /v1/lookups/{slug}`); every filter is an
   * exact match, and an unknown value gives an empty list.
   */
  options(slug: string, filters?: Record<string, string>): Promise<LookupItem[]>;
}
