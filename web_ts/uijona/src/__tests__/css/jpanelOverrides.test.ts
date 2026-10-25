/**
 * Visible corrections of the cascade fix (D1a; R-FND-2, S-FND-24).
 *
 * 1.5.1 engine rules (`.jpanel[data-jpanel-*]`, 0,2,0) silently beat the
 * utilities a View put on a JPanel. From 1.5.2 those utilities apply. This test
 * pins the reviewed list of every JPanel `className` token that sets an engine
 * property (display, gap, width, flex direction/wrap, align, justify, grid
 * template), per View, in `jpanelOverrides.golden.json` (`kept`).
 *
 * The engine still sets `flex-direction` (default column) and Tailwind's `flex`
 * sets none, so a View whose `flex` meant a row says so with `flex-row`; the
 * audit added those tokens and lists them under `added`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import ts from 'typescript';
import golden from './jpanelOverrides.golden.json';

const SRC = resolve(process.cwd(), 'src');
const CLASS_FUNCTIONS = new Set(['cn', 'clsx', 'twMerge']);
const ENGINE_PROPERTY_UTILITY = new RegExp(
  [
    '^(flex|inline-flex|grid|inline-grid|block|inline-block|inline|hidden|contents|table|flow-root)$',
    '^gap(-[xy])?-',
    '^(w|min-w|max-w)-',
    '^flex-(row|col|row-reverse|col-reverse|wrap|wrap-reverse|nowrap)$',
    '^items-',
    '^justify-(?!self-)',
    '^(grid-cols|grid-rows|grid-flow|auto-rows|auto-cols)-',
    '^\\[grid-template',
  ].join('|'),
);

/** `sm:hover:!gap-2` -> `gap-2` */
const utilityOf = (token: string): string => {
  const parts = token.split(/:(?![^[]*\])/);
  return parts[parts.length - 1].replace(/^!/, '');
};

interface JPanelUse {
  line: number;
  /** Every class token the `className` can receive (all branches). */
  tokens: string[];
  /** Static `layout` and `direction` props, when present. */
  layout?: string;
  direction?: string;
}

/** The JPanel elements of a source file and their class tokens, following same-file constants. */
function jpanelUses(file: string, text: string): JPanelUse[] {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const constants = new Map<string, ts.Expression>();
  const indexConstants = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && node.initializer) {
      if (ts.isIdentifier(node.name)) constants.set(node.name.text, node.initializer);
      if (ts.isObjectBindingPattern(node.name)) {
        node.name.elements.forEach((element) => {
          if (ts.isIdentifier(element.name)) constants.set(element.name.text, node.initializer!);
        });
      }
    }
    ts.forEachChild(node, indexConstants);
  };
  indexConstants(source);

  const tokensOf = (root: ts.Node): string[] => {
    const tokens: string[] = [];
    const seen = new Set<ts.Node>();
    const collect = (node: ts.Node): void => {
      if (seen.has(node)) return;
      seen.add(node);
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        tokens.push(...node.text.split(/\s+/).filter(Boolean));
      } else if (ts.isTemplateExpression(node)) {
        [node.head, ...node.templateSpans.map((span) => span.literal)].forEach((part) =>
          tokens.push(...part.text.split(/\s+/).filter(Boolean)),
        );
        node.templateSpans.forEach((span) => collect(span.expression));
      } else if (ts.isConditionalExpression(node)) {
        collect(node.whenTrue);
        collect(node.whenFalse);
      } else if (ts.isBinaryExpression(node)) {
        const operator = node.operatorToken.kind;
        const either = operator === ts.SyntaxKind.BarBarToken || operator === ts.SyntaxKind.QuestionQuestionToken;
        if (either) collect(node.left);
        if (either || operator === ts.SyntaxKind.AmpersandAmpersandToken) collect(node.right);
      } else if (ts.isParenthesizedExpression(node) || ts.isJsxExpression(node) || ts.isAsExpression(node)) {
        if (node.expression) collect(node.expression);
      } else if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && CLASS_FUNCTIONS.has(node.expression.text)) {
        node.arguments.forEach(collect);
      } else if (ts.isElementAccessExpression(node)) {
        collect(node.expression);
      } else if (ts.isObjectLiteralExpression(node)) {
        node.properties.forEach((property) => ts.isPropertyAssignment(property) && collect(property.initializer));
      } else if (ts.isIdentifier(node) && constants.has(node.text)) {
        collect(constants.get(node.text)!);
      }
    };
    collect(root);
    return tokens;
  };

  const uses: JPanelUse[] = [];
  const visit = (node: ts.Node) => {
    const element = ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : undefined;
    if (element && element.tagName.getText(source) === 'JPanel') {
      const use: JPanelUse = { line: source.getLineAndCharacterOfPosition(element.getStart(source)).line + 1, tokens: [] };
      element.attributes.properties.forEach((attribute) => {
        if (!ts.isJsxAttribute(attribute) || !attribute.initializer) return;
        const name = attribute.name.getText(source);
        if (name === 'className') use.tokens = tokensOf(attribute.initializer);
        if ((name === 'layout' || name === 'direction') && ts.isStringLiteral(attribute.initializer)) {
          use[name] = attribute.initializer.text;
        }
      });
      uses.push(use);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return uses;
}

/**
 * A JPanel whose className turns on flex (`flex`, `inline-flex`, `md:flex`...) means a row in Tailwind
 * terms; the engine would render a column unless the View states a direction.
 */
const missesRowDirection = (use: JPanelUse): boolean => {
  const utilities = use.tokens.map(utilityOf);
  const turnsOnFlex = utilities.some((utility) => utility === 'flex' || utility === 'inline-flex');
  const statesDirection = utilities.some((utility) => /^flex-(row|col)(-reverse)?$/.test(utility));
  const layoutIsRow = use.layout === 'flow' || use.layout === 'none';
  return turnsOnFlex && !statesDirection && !layoutIsRow && use.direction === undefined;
};

function viewFiles(dir: string = SRC): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' || name === 'test' ? [] : viewFiles(path);
    return /\.tsx$/.test(name) && !/\.(test|stories)\.tsx$/.test(name) ? [path] : [];
  });
}

const libUses = (): Array<{ file: string; use: JPanelUse }> =>
  viewFiles().flatMap((path) =>
    jpanelUses(path, readFileSync(path, 'utf8')).map((use) => ({ file: relative(SRC, path).split('\\').join('/'), use })),
  );

/** `{ 'molecules/JCard/JCardView.tsx': ['flex', 'gap-1.5', ...] }`, sorted and unique per file. */
function engineOverridesBySource(): Record<string, string[]> {
  const result: Record<string, Set<string>> = {};
  libUses().forEach(({ file, use }) => {
    use.tokens
      .filter((token) => ENGINE_PROPERTY_UTILITY.test(utilityOf(token)))
      .forEach((token) => (result[file] ??= new Set()).add(token));
  });
  return Object.fromEntries(
    Object.keys(result)
      .sort()
      .map((file) => [file, Array.from(result[file]).sort()]),
  );
}

describe('JPanel className tokens honored by the cascade fix (S-FND-24)', () => {
  it('matches the reviewed list, per View', () => {
    const current = engineOverridesBySource();

    expect(Object.keys(current).length).toBeGreaterThan(20);
    expect(current).toEqual(golden.kept);
  });

  it('states the row direction wherever a View turns flex on (D1a)', () => {
    const missing = libUses()
      .filter(({ use }) => missesRowDirection(use))
      .map(({ file, use }) => `${file}:${use.line}`);

    expect(libUses().length).toBeGreaterThan(100);
    expect(missing).toEqual([]);
  });

  it('lists every added direction token in the reviewed list', () => {
    expect(golden.added.length).toBeGreaterThan(0);
    const absent = golden.added.filter(({ file, token }) => !golden.kept[file as keyof typeof golden.kept]?.includes(token));
    expect(absent).toEqual([]);
  });

  it('collects variant-prefixed engine utilities and finds a missing row direction', () => {
    const [panel, row, column] = jpanelUses(
      'Fixture.tsx',
      [
        "const TONES = { a: 'w-10 rounded-md' };",
        'export const F = ({ open, tone }) => (',
        "  <JPanel className={cn('lg:hidden md:flex p-4', open && 'gap-2', TONES[tone])}>",
        '    <JPanel className="flex flex-row items-center" />',
        '    <JPanel layout="box" className="flex flex-col" />',
        '  </JPanel>',
        ');',
      ].join('\n'),
    );

    expect(panel.tokens.filter((token) => ENGINE_PROPERTY_UTILITY.test(utilityOf(token))).sort()).toEqual([
      'gap-2',
      'lg:hidden',
      'md:flex',
      'w-10',
    ]);
    expect([panel, row, column].map(missesRowDirection)).toEqual([true, false, false]);
  });
});
