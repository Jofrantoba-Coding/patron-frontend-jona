// Superficie pública del paquete, calculada con el compilador de TypeScript desde src/index.ts.
// Por cada exportación: su clase (kind) y, en los contratos, cada propiedad con su opcionalidad y su tipo como texto.
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

/**
 * @typedef {{ optional: boolean, type: string }} Propiedad
 * @typedef {{ kind: 'contract' | 'type' | 'component' | 'function' | 'class' | 'constant',
 *             props?: Record<string, Propiedad>, definition?: string }} Exportacion
 * @typedef {{ version?: string, exports: Record<string, Exportacion> }} Superficie
 */

const ENTRADA = fileURLToPath(new URL('../src/index.ts', import.meta.url));

const OPCIONES = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
  types: [],
};

const texto = (nodo) => nodo.getText().replace(/\s+/g, ' ').trim();
// Orden por código de carácter, no por configuración regional: el JSON debe ser idéntico en cualquier máquina.
const ordenar = (objeto) => Object.fromEntries(Object.entries(objeto).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));

/**
 * @param {string} [entrada] archivo índice del paquete
 * @returns {Superficie}
 */
export function calcularSuperficie(entrada = ENTRADA) {
  const programa = ts.createProgram([entrada], OPCIONES);
  const checker = programa.getTypeChecker();
  const fuente = programa.getSourceFile(entrada.replaceAll('\\', '/'));
  if (!fuente) throw new Error(`no se encontró ${entrada}`);

  const tipoComoTexto = (tipo) => checker.typeToString(tipo, undefined, ts.TypeFormatFlags.NoTruncation);

  /** @returns {Exportacion} */
  const describir = (nombre, simbolo) => {
    const declaracion = simbolo.declarations?.[0];
    if (simbolo.flags & ts.SymbolFlags.Interface) {
      const props = {};
      for (const prop of checker.getPropertiesOfType(checker.getDeclaredTypeOfSymbol(simbolo))) {
        const decl = prop.valueDeclaration ?? prop.declarations?.[0];
        props[prop.name] = {
          optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
          type: decl && ts.isPropertySignature(decl) && decl.type
            ? texto(decl.type)
            : tipoComoTexto(checker.getTypeOfSymbolAtLocation(prop, decl ?? fuente)),
        };
      }
      return { kind: 'contract', props: ordenar(props) };
    }
    if (simbolo.flags & ts.SymbolFlags.TypeAlias && declaracion && ts.isTypeAliasDeclaration(declaracion)) {
      return { kind: 'type', definition: texto(declaracion.type) };
    }
    if (simbolo.flags & ts.SymbolFlags.Class) return { kind: 'class' };
    const firmas = checker.getTypeOfSymbol(simbolo).getCallSignatures();
    if (firmas.length > 0) return { kind: /^[A-Z]/.test(nombre) ? 'component' : 'function' };
    return { kind: 'constant' };
  };

  const exportaciones = {};
  for (const exportado of checker.getExportsOfModule(checker.getSymbolAtLocation(fuente))) {
    const simbolo = exportado.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exportado) : exportado;
    exportaciones[exportado.name] = describir(exportado.name, simbolo);
  }
  return { exports: ordenar(exportaciones) };
}
