// Reglas de arquitectura sobre los imports de src/, con la API del compilador de TypeScript.
// FSD gobierna las relaciones entre unidades (reglas 1 a 3); JONA, los roles dentro de cada unidad (reglas 4 y 5).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';

export type RuleId = 1 | 2 | 3 | 4 | 5;

export interface Violation {
  rule: RuleId;
  /** Ruta relativa a src/, con '/'. */
  file: string;
  message: string;
}

/** Capas de FSD de abajo arriba: un módulo solo importa capas con un índice menor que el suyo. */
const LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'app'];
/** Capas divididas en slices. `app` y `shared` no tienen slices. */
const SLICED = new Set(['entities', 'features', 'widgets', 'pages']);

/** Dónde está un módulo: capa, unidad (slice, o componente de shared/ui), segmento y nombre. */
interface Location {
  /** Ruta relativa a src/, con '/' y sin extensión (`features/auth-login/ui/UiLogin`). */
  path: string;
  layer: string;
  /** `features/auth-login`, `shared/ui/jbutton`, `shared/api`; undefined en `app`. */
  unit?: string;
  /** `model`, `ui` o `api` dentro de un slice; undefined en el index.ts y en unidades sin segmentos. */
  segment?: string;
  /** Nombre del archivo sin extensión (`UiLoginView`). */
  name: string;
}

interface ImportRef {
  /** Destino resuelto, relativo a src/. */
  target: Location;
  /** Nombres exportados que se importan o reexportan ('*' para un namespace o `export *`). */
  names: string[];
  /** true para `export ... from`. */
  reexport: boolean;
}

interface Module {
  file: string;
  at: Location;
  source: ts.SourceFile;
  imports: ImportRef[];
}

function locate(path: string): Location {
  const parts = path.split('/');
  const layer = parts[0];
  // Profundidad de la unidad: features/auth-login (2), shared/api (2), shared/ui/jbutton (3).
  const depth = SLICED.has(layer) ? 2 : layer === 'shared' ? (parts[1] === 'ui' ? 3 : 2) : 0;
  const unit = depth > 0 && parts.length > depth ? parts.slice(0, depth).join('/') : undefined;
  const segment = unit !== undefined && parts.length > depth + 1 ? parts[depth] : undefined;
  return { path, layer, unit, segment, name: parts[parts.length - 1] };
}

/** Archivos analizados, relativos a src/. Las pruebas quedan fuera: son raíces de composición propias. */
export function sourceFiles(srcDir: string): string[] {
  return readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
    .map((file) => file.split(sep).join('/'))
    .filter((file) => /\.tsx?$/.test(file) && !/\.d\.ts$/.test(file) && !/\.test\.tsx?$/.test(file))
    .sort();
}

/** Resuelve un import relativo a una ruta de src/ sin extensión; un directorio con index.ts resuelve a su index. */
function resolveImport(srcDir: string, file: string, specifier: string): string | undefined {
  if (!specifier.startsWith('.')) return undefined; // paquetes de npm: fuera del análisis
  const absolute = resolve(dirname(join(srcDir, file)), specifier);
  const path = relative(srcDir, absolute).split(sep).join('/');
  if (path === '' || path.startsWith('..')) return undefined;
  if (existsSync(join(absolute, 'index.ts')) || existsSync(join(absolute, 'index.tsx'))) return `${path}/index`;
  return path.replace(/\.(tsx?|jsx?)$/, '');
}

function importedNames(statement: ts.ImportDeclaration | ts.ExportDeclaration): string[] {
  if (ts.isExportDeclaration(statement)) {
    const clause = statement.exportClause;
    if (clause === undefined || ts.isNamespaceExport(clause)) return ['*'];
    return clause.elements.map((e) => (e.propertyName ?? e.name).text);
  }
  const clause = statement.importClause;
  if (clause === undefined) return [];
  const names = clause.name ? ['default'] : [];
  const bindings = clause.namedBindings;
  if (bindings && ts.isNamespaceImport(bindings)) names.push('*');
  if (bindings && ts.isNamedImports(bindings)) names.push(...bindings.elements.map((e) => (e.propertyName ?? e.name).text));
  return names;
}

function parse(srcDir: string, file: string): Module {
  const source = ts.createSourceFile(file, readFileSync(join(srcDir, file), 'utf8'), ts.ScriptTarget.Latest, true);
  const imports: ImportRef[] = [];
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
    const specifier = statement.moduleSpecifier;
    if (specifier === undefined || !ts.isStringLiteral(specifier)) continue;
    const target = resolveImport(srcDir, file, specifier.text);
    if (target === undefined) continue;
    imports.push({ target: locate(target), names: importedNames(statement), reexport: ts.isExportDeclaration(statement) });
  }
  return { file, at: locate(file.replace(/\.tsx?$/, '')), source, imports };
}

const isPublicApi = (at: Location) => at.unit !== undefined && at.path === `${at.unit}/index`;

// ---------------------------------------------------------------------------------------------
// Reglas 1 a 3 (FSD): dirección de capas, aislamiento entre slices y API pública (N4).
// ---------------------------------------------------------------------------------------------

function layerDirection(from: Location, to: Location): string | undefined {
  if (LAYERS.indexOf(to.layer) > LAYERS.indexOf(from.layer)) {
    return `la capa ${from.layer} importa ${to.path}, de la capa superior ${to.layer}`;
  }
  return undefined;
}

function sliceIsolation(from: Location, to: Location): string | undefined {
  if (SLICED.has(from.layer) && from.layer === to.layer && from.unit !== to.unit) {
    return `el slice ${from.unit} importa ${to.path}, de otro slice de la misma capa`;
  }
  return undefined;
}

function publicApi(from: Location, to: Location): string | undefined {
  if (to.unit !== undefined && to.unit !== from.unit && !isPublicApi(to)) {
    return `importa ${to.path} sin pasar por la API pública ${to.unit}/index.ts`;
  }
  return undefined;
}

/** La API pública de una aplicación no expone la vista ni la Implementación de la unidad. */
function narrowPublicApi(module: Module): string[] {
  if (!isPublicApi(module.at)) return [];
  return module.imports
    .filter((ref) => ref.reexport && /(View|Impl)$/.test(ref.target.name))
    .map((ref) => `la API pública reexporta ${ref.target.path}; solo exporta la entrada, el puerto y los adaptadores`);
}

// ---------------------------------------------------------------------------------------------
// Regla 4 (JONA y hexagonal): roles dentro de la unidad; solo app elige un adaptador.
// ---------------------------------------------------------------------------------------------

/** Segmentos que cada segmento NO puede importar dentro de su propia unidad. */
const FORBIDDEN_SEGMENTS: Record<string, string[]> = {
  model: ['ui', 'api'], // la Implementación depende del puerto, no del adaptador ni de la vista
  api: ['ui'],
  ui: ['api'], // la entrada recibe el servicio; no crea su adaptador
};

function unitRoles(from: Location, to: Location): string | undefined {
  if (from.unit === undefined || from.unit !== to.unit) return undefined;
  if (from.segment && to.segment && FORBIDDEN_SEGMENTS[from.segment]?.includes(to.segment)) {
    return `el segmento ${from.segment}/ importa ${to.path}, del segmento ${to.segment}/`;
  }
  // La vista solo conoce el contrato de UI (Inter*) y otras vistas; nunca la Implementación ni la entrada.
  if (from.name.endsWith('View') && !to.name.startsWith('Inter') && !to.name.endsWith('View')) {
    return `la vista ${from.name} importa ${to.path}; solo puede importar contratos (Inter*)`;
  }
  return undefined;
}

/** Nombres que la API pública de cada unidad reexporta desde su segmento api/ (las fábricas de adaptadores). */
function adapterExports(modules: Module[]): Map<string, Set<string>> {
  const adapters = new Map<string, Set<string>>();
  for (const module of modules.filter((m) => isPublicApi(m.at))) {
    const names = module.imports
      .filter((ref) => ref.reexport && ref.target.unit === module.at.unit && ref.target.segment === 'api')
      .flatMap((ref) => ref.names);
    adapters.set(module.at.path, new Set(names));
  }
  return adapters;
}

function adapterOutsideApp(from: Location, ref: ImportRef, adapters: Map<string, Set<string>>): string | undefined {
  if (from.layer === 'app') return undefined; // la raíz de composición es el único lugar que elige un adaptador
  const exported = adapters.get(ref.target.path);
  const chosen = ref.names.filter((name) => exported?.has(name) || (name === '*' && (exported?.size ?? 0) > 0));
  if (chosen.length > 0) return `importa el adaptador ${chosen.join(', ')} de ${ref.target.path}; solo app elige un adaptador`;
  return undefined;
}

// ---------------------------------------------------------------------------------------------
// Regla 5 (N2): un archivo Inter*.ts solo exporta tipos y objetos *_DEFAULTS con valores planos.
// ---------------------------------------------------------------------------------------------

function unwrap(node: ts.Expression): ts.Expression {
  let current = node;
  while (ts.isAsExpression(current) || ts.isSatisfiesExpression(current) || ts.isParenthesizedExpression(current)) {
    current = current.expression;
  }
  return current;
}

/** Literal de texto, número, booleano o null, o un objeto o arreglo hecho solo de ellos. */
function isPlainValue(node: ts.Expression): boolean {
  const value = unwrap(node);
  if (ts.isStringLiteral(value) || ts.isNumericLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) return true;
  if ([ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NullKeyword].includes(value.kind)) return true;
  if (ts.isPrefixUnaryExpression(value)) return ts.isNumericLiteral(value.operand);
  if (ts.isArrayLiteralExpression(value)) return value.elements.every(isPlainValue);
  if (ts.isObjectLiteralExpression(value)) {
    return value.properties.every((p) => ts.isPropertyAssignment(p) && isPlainValue(p.initializer));
  }
  return false;
}

function isAllowedInContract(statement: ts.Statement): boolean {
  if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) return true;
  if (ts.isImportDeclaration(statement)) {
    const clause = statement.importClause;
    const bindings = clause?.namedBindings;
    return clause !== undefined && (clause.isTypeOnly
      || (!clause.name && bindings !== undefined && ts.isNamedImports(bindings) && bindings.elements.every((e) => e.isTypeOnly)));
  }
  if (ts.isExportDeclaration(statement)) return statement.isTypeOnly;
  if (ts.isVariableStatement(statement)) {
    const isConst = (statement.declarationList.flags & ts.NodeFlags.Const) !== 0;
    return isConst && statement.declarationList.declarations.every((d) =>
      ts.isIdentifier(d.name) && d.name.text.endsWith('_DEFAULTS') && d.initializer !== undefined
      && ts.isObjectLiteralExpression(unwrap(d.initializer)) && isPlainValue(d.initializer));
  }
  return false;
}

function contractWithoutBehavior(module: Module): string[] {
  if (!/^Inter[A-Z]\w*$/.test(module.at.name) || !module.file.endsWith('.ts')) return [];
  return module.source.statements
    .filter((statement) => !isAllowedInContract(statement))
    .map((statement) => `el contrato contiene comportamiento: ${statement.getText(module.source).split('\n')[0]}`);
}

// ---------------------------------------------------------------------------------------------

export function checkArchitecture(srcDir: string): Violation[] {
  const modules = sourceFiles(srcDir).map((file) => parse(srcDir, file));
  const adapters = adapterExports(modules);
  const violations: Violation[] = [];
  const report = (rule: RuleId, file: string, message: string | undefined) => {
    if (message !== undefined) violations.push({ rule, file, message });
  };

  for (const module of modules) {
    for (const ref of module.imports) {
      report(1, module.file, layerDirection(module.at, ref.target));
      report(2, module.file, sliceIsolation(module.at, ref.target));
      report(3, module.file, publicApi(module.at, ref.target));
      report(4, module.file, unitRoles(module.at, ref.target));
      report(4, module.file, adapterOutsideApp(module.at, ref, adapters));
    }
    narrowPublicApi(module).forEach((message) => report(3, module.file, message));
    contractWithoutBehavior(module).forEach((message) => report(5, module.file, message));
  }
  return violations;
}
