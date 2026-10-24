/** Which row an action targets (R-MOCK-22): an entry row (`id`), a child row (`id`, `child`, `childId`) or, without `childId`, the collection of a child. */
export interface ActionTarget {
  id: string;
  child?: string;
  childId?: string;
}

/** What an action answers: the updated row, the parent state (for a child action) and the message of the rule. */
export interface ActionResult<R = Record<string, any>> {
  row?: R;
  parent?: R;
  message?: string;
}

/**
 * The immediate row actions of one catalog, `POST /v1/{catalog}/{id}[/{child}[/{childId}]]/actions/{action}` (R-MOCK-22). Kept apart from
 * `InterCatalogService`, whose method set the W1 contract pins (S-LOC-17).
 */
export interface InterActionService {
  run<R = Record<string, any>>(target: ActionTarget, action: string, input?: Record<string, unknown>): Promise<ActionResult<R>>;
}
