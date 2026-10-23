import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/services/ApiError';
import type { InterCatalogService } from '../../src/services/InterCatalogService';
import { CASES, type CatalogCase, type Outcome, type Step } from './cases';

export type RegistryServiceFactory = (slug: string) => InterCatalogService<Record<string, any>>;

async function run(service: InterCatalogService<Record<string, any>>, step: Step): Promise<any> {
  switch (step.op) {
    case 'list': return service.list({ filters: step.filters });
    case 'get': return service.get(step.id!);
    case 'create': return service.create(step.body ?? {});
    case 'update': return service.update(step.id!, step.body ?? {});
    case 'remove': return service.remove(step.id!);
  }
}

/** Runs every step; the last one is checked against the expected outcome. */
async function check(make: RegistryServiceFactory, { slug, steps, expect: outcome }: CatalogCase): Promise<void> {
  const service = make(slug);
  let result: unknown;
  let error: unknown;
  for (const step of steps) {
    try {
      result = await run(service, step);
      error = undefined;
    } catch (e) {
      error = e;
    }
  }
  assertOutcome(outcome, result, error);
}

function assertOutcome(outcome: Outcome, result: any, error: unknown): void {
  if ('ok' in outcome) {
    expect(error).toBeUndefined();
    if (outcome.match) expect(result).toMatchObject(outcome.match);
    if (outcome.total !== undefined) expect(result.pagination.total).toBe(outcome.total);
    return;
  }
  expect(error).toBeInstanceOf(ApiError);
  const api = error as ApiError;
  expect([api.status, api.code]).toEqual([outcome.status, outcome.code]);
  if (outcome.fields) expect(api.details.map((d) => d.field)).toEqual(outcome.fields);
  if (outcome.messages) expect(api.details.map((d) => d.message)).toEqual(outcome.messages);
}

/** The shared case table against one source: both sources must meet the same outcomes (R-MOCK-18). */
export function describeRegistryContract(label: string, make: RegistryServiceFactory): void {
  describe(`registry cases: ${label}`, () => {
    it.each(CASES.map((c) => [c.name, c] as const))('%s', async (_name, testCase) => {
      await check(make, testCase);
    });
  });
}
