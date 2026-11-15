// @vitest-environment node
/**
 * Superficie pública: lo que una aplicación puede importar. Entradas, contratos y DEFAULTS;
 * ni vistas, ni Implementaciones, ni clasesToken, ni subrutas profundas.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as ds from '../src/index';

describe('superficie pública del sistema de diseño', () => {
  it('exporta en tiempo de ejecución solo entradas y DEFAULTS', () => {
    expect(Object.keys(ds).sort()).toEqual([
      'JBUTTON_DEFAULTS', 'JButton',
      'JCONFIRMDIALOG_DEFAULTS', 'JConfirmDialog',
      'JFIELD_DEFAULTS', 'JField',
      'JINPUT_DEFAULTS', 'JInput',
      'JPAGELAYOUT_DEFAULTS', 'JPageLayout',
      'JSEARCHBOX_DEFAULTS', 'JSearchBox',
      'JTABLE_DEFAULTS', 'JTEXT_DEFAULTS', 'JTable', 'JText',
    ]);
  });

  it('el mapa exports de package.json publica la raíz y los tokens, nada más', () => {
    const paquete = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

    expect(Object.keys(paquete.exports)).toEqual(['.', './tokens.css']);
  });

  it('los tipos de las vistas tampoco se publican: el índice no reexporta ningún Inter*Vista', () => {
    const indices = ['atomos/jbutton', 'atomos/jinput', 'atomos/jtext', 'moleculas/jfield', 'moleculas/jsearchbox',
      'organismos/jtable', 'organismos/jconfirmdialog', 'disposiciones/jpagelayout']
      .map((unidad) => readFileSync(new URL(`../src/${unidad}/index.ts`, import.meta.url), 'utf8'));

    expect(indices.filter((texto) => /Vista\b|View\b|Impl\b/.test(texto))).toEqual([]);
  });
});
