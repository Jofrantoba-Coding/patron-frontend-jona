import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/services/ApiError';
import type { InterCatalogService } from '../../src/services/InterCatalogService';
import type { InterLookupService } from '../../src/services/InterLookupService';
import type { RequestContext } from '../../src/services/httpClient';
import { CASES, type CatalogCase, type Outcome, type Step } from './cases';

/** The services of one source for a catalog, acting with the given session context. */
export type RegistryServiceFactory = (
  slug: string,
  ctx: RequestContext,
) => { catalog: InterCatalogService<Record<string, any>>; lookup: InterLookupService };

async function run(
  { catalog: service, lookup }: ReturnType<RegistryServiceFactory>,
  slug: string,
  step: Step,
): Promise<any> {
  switch (step.op) {
    case 'options': return lookup.options(slug, step.filters);
    case 'list': return service.list({ filters: step.filters });
    case 'get': return service.get(step.id!);
    case 'create': return service.create(step.body ?? {});
    case 'update': return service.update(step.id!, step.body ?? {});
    case 'remove': return service.remove(step.id!);
  }
}

/** Runs every step; the last one is checked against the expected outcome. */
async function check(make: RegistryServiceFactory, { slug, steps, ctx = {}, expect: outcome }: CatalogCase): Promise<void> {
  const service = make(slug, ctx);
  let result: unknown;
  let error: unknown;
  for (const step of steps) {
    try {
      result = await run(service, slug, step);
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
    if (outcome.items) expect(result).toEqual(outcome.items);
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
