import type { Seed } from '../seed';

/** A scenario either serves data from a seed or fails every call. */
export type ScenarioFixture =
  | { kind: 'data'; seed: Seed }
  | { kind: 'error'; status: number; code: string; message: string };
