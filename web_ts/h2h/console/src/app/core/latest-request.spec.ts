import { Subject } from 'rxjs';
import { LatestRequest } from './latest-request';

describe('LatestRequest', () => {
  it('cancela la solicitud anterior y solo publica la respuesta mas reciente', () => {
    const first = new Subject<string>();
    const second = new Subject<string>();
    const values: string[] = [];
    const settled: string[] = [];
    const latest = new LatestRequest();

    latest.run(first, {
      next: (value) => values.push(value),
      settled: () => settled.push('first'),
    });
    latest.run(second, {
      next: (value) => values.push(value),
      settled: () => settled.push('second'),
    });

    expect(first.observed).toBe(false);
    first.next('stale');
    second.next('fresh');
    second.complete();

    expect(values).toEqual(['fresh']);
    expect(settled).toEqual(['second']);
  });

  it('cancela la solicitud activa al destruir el propietario', () => {
    const source = new Subject<string>();
    const latest = new LatestRequest();

    latest.run(source, { next: () => undefined });
    latest.cancel();

    expect(source.observed).toBe(false);
  });
});
