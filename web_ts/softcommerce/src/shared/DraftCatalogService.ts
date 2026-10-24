// Layer: service. The catalog service of a child dialog: it checks the row against the active siblings and hands it to the parent form; it never
// sends a request (R-MD-3, S-MD-4). The parent sends the pending rows with its own save.
import { findConflict, isActiveSibling } from '../../mock-server/core/unique.js';
import { ApiError } from '../services/ApiError';
import type { InterCatalogService } from '../services/InterCatalogService';

/** A child `unique` key as the registry resolves it (R-REG-14, R-MD-6). */
export interface DraftUniqueKey {
  fields: string[];
  errorField: string;
  message: string;
}

export interface DraftOptions<T> {
  unique: DraftUniqueKey[];
  /** The active rows of the grid, persisted and pending, read at the moment of the confirm. */
  siblings: () => T[];
  /** Receives the one new row once it passed. */
  onRow: (row: T) => void;
}

const refuse = (what: string) => () => Promise.reject(new Error(`A draft catalog service only collects rows (${what}).`));

export function createDraftCatalogService<T extends Record<string, any>>({ unique, siblings, onRow }: DraftOptions<T>): InterCatalogService<T> {
  return {
    create: async (values) => {
      const row = values as T;
      for (const key of unique) {
        if (!findConflict(siblings(), key.fields, row, { active: isActiveSibling })) continue;
        throw new ApiError(409, { code: 'DUPLICATE', message: key.message, details: [{ field: key.errorField, message: key.message }], traceId: 'draft' });
      }
      onRow(row);
      return row;
    },
    list: refuse('list'),
    get: refuse('get'),
    update: refuse('update'),
    remove: refuse('remove'),
  };
}
