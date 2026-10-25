/**
 * axe-core audit for component tests: serious and critical violations only.
 * `color-contrast` is off because jsdom does not compute colors.
 */
import axe from 'axe-core';

export interface AxeFinding {
  id: string;
  impact: string | null | undefined;
  targets: string[];
}

export async function seriousViolations(container: Element): Promise<AxeFinding[]> {
  const results = await axe.run(container, {
    resultTypes: ['violations'],
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      targets: violation.nodes.map((node) => node.target.join(' ')),
    }));
}
