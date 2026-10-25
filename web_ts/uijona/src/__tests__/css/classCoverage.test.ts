/**
 * Class coverage of the shipped stylesheet (R-FND-1, D3, D4; S-FND-2).
 *
 * Every class token the lib source writes must exist in the compiled CSS, and
 * no class token may be built by interpolation. Class tokens are the string
 * values that reach a class position: a `className`-like JSX attribute, a
 * `cn`/`clsx`/`twMerge` argument, and the constants, maps and helpers those
 * positions reference (followed through identifiers, member access and
 * relative imports). Comparison operands, map keys and lookup indexes are not
 * class positions.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import postcss, { type Root } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import ts from 'typescript';
import tailwindConfig from '../../../tailwind.config.js';

const SRC = resolve(process.cwd(), 'src');
const CLASS_FUNCTIONS = new Set(['cn', 'clsx', 'twMerge']);
const CLASS_ATTRIBUTE = /^class(Name)?$|ClassName$/;

interface SourceFile {
  path: string;
  text: string;
}

interface ClassScan {
  /** class token -> files that write it */
  tokens: Map<string, Set<string>>;
  /** `file: fragment` for every class token built by interpolation */
  fragments: string[];
}

/* ── source scan ───────────────────────────────────────────────────────────── */

function scanClassTokens(files: SourceFile[]): ClassScan {
  const parsed = new Map(
    files.map((file) => [
      file.path,
      ts.createSourceFile(file.path, file.text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX),
    ]),
  );
  const tokens = new Map<string, Set<string>>();
  const fragments: string[] = [];
  const visited = new Set<ts.Node>();

  const addTokens = (text: string, file: string) => {
    text.split(/\s+/).filter(Boolean).forEach((token) => {
      if (!tokens.has(token)) tokens.set(token, new Set());
      tokens.get(token)!.add(relative(SRC, file));
    });
  };

  const declarationsIn = (source: ts.SourceFile, name: string): ts.Node[] => {
    const found: ts.Node[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name && node.initializer) {
        found.push(node.initializer);
      } else if (ts.isFunctionDeclaration(node) && node.name?.text === name) {
        found.push(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    return found;
  };

  const resolveIdentifier = (source: ts.SourceFile, name: string): { nodes: ts.Node[]; source: ts.SourceFile } => {
    const local = declarationsIn(source, name);
    if (local.length > 0) return { nodes: local, source };
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const bindings = statement.importClause?.namedBindings;
      if (!bindings || !ts.isNamedImports(bindings)) continue;
      const element = bindings.elements.find((binding) => binding.name.text === name);
      if (!element || !statement.moduleSpecifier.text.startsWith('.')) continue;
      const base = resolve(dirname(source.fileName), statement.moduleSpecifier.text);
      const target = [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts')].map((path) => parsed.get(path)).find(Boolean);
      if (target) return { nodes: declarationsIn(target, (element.propertyName ?? element.name).text), source: target };
    }
    return { nodes: [], source };
  };

  const collectTemplate = (node: ts.TemplateExpression, source: ts.SourceFile) => {
    const statics = [node.head.text, ...node.templateSpans.map((span) => span.literal.text)];
    statics.forEach((text, index) => {
      const leading = index > 0 ? /^\S+/.exec(text)?.[0] : undefined;
      const trailing = index < statics.length - 1 ? /\S+$/.exec(text)?.[0] : undefined;
      if (leading) fragments.push(`${relative(SRC, source.fileName)}: \${…}${leading}`);
      if (trailing) fragments.push(`${relative(SRC, source.fileName)}: ${trailing}\${…}`);
      let whole = text;
      if (leading) whole = whole.slice(leading.length);
      if (trailing) whole = whole.slice(0, whole.length - trailing.length);
      addTokens(whole, source.fileName);
    });
    node.templateSpans.forEach((span) => collect(span.expression, source));
  };

  const collectReturns = (body: ts.Node, source: ts.SourceFile) => {
    if (!ts.isBlock(body)) {
      collect(body, source);
      return;
    }
    const visit = (node: ts.Node) => {
      if (ts.isReturnStatement(node) && node.expression) collect(node.expression, source);
      if (!ts.isFunctionLike(node)) ts.forEachChild(node, visit);
    };
    ts.forEachChild(body, visit);
  };

  /** Follows an expression in class position and records every class string it can produce. */
  function collect(node: ts.Node, source: ts.SourceFile): void {
    if (visited.has(node)) return;
    visited.add(node);

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      addTokens(node.text, source.fileName);
    } else if (ts.isTemplateExpression(node)) {
      collectTemplate(node, source);
    } else if (ts.isConditionalExpression(node)) {
      collect(node.whenTrue, source);
      collect(node.whenFalse, source);
    } else if (ts.isBinaryExpression(node)) {
      const operator = node.operatorToken.kind;
      if (operator === ts.SyntaxKind.AmpersandAmpersandToken) {
        collect(node.right, source);
      } else if (
        operator === ts.SyntaxKind.BarBarToken ||
        operator === ts.SyntaxKind.QuestionQuestionToken ||
        operator === ts.SyntaxKind.PlusToken
      ) {
        collect(node.left, source);
        collect(node.right, source);
      }
    } else if (
      ts.isParenthesizedExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isNonNullExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isJsxExpression(node)
    ) {
      if (node.expression) collect(node.expression, source);
    } else if (ts.isArrayLiteralExpression(node)) {
      node.elements.forEach((element) => collect(element, source));
    } else if (ts.isObjectLiteralExpression(node)) {
      node.properties.forEach((property) => {
        if (ts.isPropertyAssignment(property)) collect(property.initializer, source);
      });
    } else if (ts.isCallExpression(node)) {
      if (ts.isIdentifier(node.expression) && CLASS_FUNCTIONS.has(node.expression.text)) {
        node.arguments.forEach((argument) => collect(argument, source));
      } else {
        collect(node.expression, source);
      }
    } else if (ts.isElementAccessExpression(node)) {
      collect(node.expression, source);
    } else if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
      const { nodes, source: owner } = resolveIdentifier(source, node.expression.text);
      nodes.filter(ts.isObjectLiteralExpression).forEach((object) => {
        object.properties.forEach((property) => {
          if (ts.isPropertyAssignment(property) && property.name.getText(owner) === node.name.text) {
            collect(property.initializer, owner);
          }
        });
      });
    } else if (ts.isIdentifier(node)) {
      const { nodes, source: owner } = resolveIdentifier(source, node.text);
      nodes.forEach((declaration) => collect(declaration, owner));
    } else if (ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isFunctionDeclaration(node)) {
      if (node.body) collectReturns(node.body, source);
    }
  }

  parsed.forEach((source) => {
    const visit = (node: ts.Node) => {
      if (ts.isJsxAttribute(node) && CLASS_ATTRIBUTE.test(node.name.getText(source)) && node.initializer) {
        collect(node.initializer, source);
      } else if (
        ts.isPropertyAssignment(node) &&
        !ts.isObjectLiteralExpression(node.initializer) &&
        CLASS_ATTRIBUTE.test(node.name.getText(source).replace(/['"]/g, ''))
      ) {
        collect(node.initializer, source);
      } else if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        CLASS_FUNCTIONS.has(node.expression.text)
      ) {
        node.arguments.forEach((argument) => collect(argument, source));
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  });

  return { tokens, fragments };
}

/* ── compiled CSS ──────────────────────────────────────────────────────────── */

async function compileStylesheet(): Promise<Root> {
  const from = resolve(SRC, 'styles/index.css');
  const result = await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(
    readFileSync(from, 'utf8'),
    { from },
  );
  return result.root;
}

/** CSS identifier unescape: hex escapes (`\2c `) and single-character escapes (`\:`). */
const unescapeCss = (ident: string): string =>
  ident.replace(/\\([0-9a-fA-F]{1,6} ?|.)/g, (_, escape: string) =>
    /^[0-9a-fA-F]{1,6} ?$/.test(escape) ? String.fromCodePoint(parseInt(escape, 16)) : escape,
  );

function classesIn(root: Root): Set<string> {
  const classes = new Set<string>();
  root.walkRules((rule) => {
    for (const [, escaped] of rule.selector.matchAll(/\.((?:\\[0-9a-fA-F]{1,6} ?|\\.|[\w-])+)/g)) {
      classes.add(unescapeCss(escaped));
    }
  });
  return classes;
}

const missingTokens = (scan: ClassScan, classes: Set<string>): string[] =>
  Array.from(scan.tokens.keys())
    .filter((token) => !classes.has(token))
    .map((token) => `${token} (${Array.from(scan.tokens.get(token)!).join(', ')})`)
    .sort();

/** The lib source: everything under src/ except tests and test helpers. */
function libSourceFiles(dir: string = SRC): SourceFile[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' || name === 'test' ? [] : libSourceFiles(path);
    if (!/\.tsx?$/.test(name) || /\.test\.tsx?$/.test(name)) return [];
    return [{ path, text: readFileSync(path, 'utf8') }];
  });
}

/* ── tests ─────────────────────────────────────────────────────────────────── */

describe('class coverage (S-FND-2)', () => {
  let classes: Set<string>;

  beforeAll(async () => {
    classes = classesIn(await compileStylesheet());
  }, 60_000);

  it('every class token of the lib source is in the compiled CSS', () => {
    const scan = scanClassTokens(libSourceFiles());

    expect(scan.tokens.size).toBeGreaterThan(500);
    expect(scan.tokens.has('jpanel')).toBe(true);
    expect(missingTokens(scan, classes)).toEqual([]);
  });

  it('no lib class token is built by interpolation (D4)', () => {
    expect(scanClassTokens(libSourceFiles()).fragments).toEqual([]);
  });

  it('names a token that only a template literal writes and the CSS lacks', () => {
    const fixture: SourceFile = {
      path: join(SRC, 'fixture/Fixture.tsx'),
      text: [
        "const TONES = { info: 'bg-primary-50 text-primary-700' };",
        'export const Fixture = ({ tone, base }) => (',
        '  <div className={cn(`${base} jona-fixture-only-in-template`, TONES[tone], tone === \'info\' && \'px-3\')} />',
        ');',
      ].join('\n'),
    };
    const scan = scanClassTokens([fixture]);

    expect(Array.from(scan.tokens.keys()).sort()).toEqual(
      ['bg-primary-50', 'jona-fixture-only-in-template', 'px-3', 'text-primary-700'],
    );
    expect(missingTokens(scan, classes)).toEqual([`jona-fixture-only-in-template (${join('fixture', 'Fixture.tsx')})`]);
  });

  it('names a class token built by interpolation', () => {
    const fixture: SourceFile = {
      path: join(SRC, 'fixture/Grid.tsx'),
      text: 'export const Grid = ({ n }) => <div className={`grid grid-cols-${n} gap-2`} />;',
    };
    const scan = scanClassTokens([fixture]);

    expect(scan.fragments).toEqual([`${join('fixture', 'Grid.tsx')}: grid-cols-\${…}`]);
    expect(Array.from(scan.tokens.keys()).sort()).toEqual(['gap-2', 'grid']);
  });
});
