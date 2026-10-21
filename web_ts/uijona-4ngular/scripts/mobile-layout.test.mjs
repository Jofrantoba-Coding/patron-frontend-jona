import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('dialog uses the mobile viewport and keeps close reachable', () => {
  const view = read('projects/uijona/src/lib/molecules/JDialog/JDialogView.html');
  const impl = read('projects/uijona/src/lib/molecules/JDialog/JDialogImpl.ts');
  assert.match(view, /p-2 sm:p-4/);
  assert.match(view, /h-11 w-11 sm:h-8 sm:w-8/);
  assert.match(view, /min-h-0 min-w-0 overflow-auto/);
  assert.match(view, /flex shrink-0 flex-row/);
  assert.match(view, /jdialog-footer flex shrink-0 flex-wrap/);
  assert.match(impl, /max-h-\[calc\(100dvh-1rem\)\]/);
});

test('data tables make horizontal evidence discoverable and keyboard reachable', () => {
  const view = read('projects/uijona/src/lib/molecules/JDataTable/JDataTableView.html');
  assert.ok(view.includes("[attr.tabindex]=\"responsiveMode() === 'scroll' ? 0 : null\""));
  assert.ok(view.includes("[attr.aria-label]=\"responsiveMode() === 'scroll' ? 'Tabla de datos desplazable horizontalmente' : null\""));
  assert.match(view, /Deslice horizontalmente/);
});

test('composable tables expose scroll instructions only in scroll mode', () => {
  const view = read('projects/uijona/src/lib/molecules/JTable/JTableView.html');
  const styles = read('projects/uijona/src/lib/molecules/JTable/JTableStyles.ts');
  assert.match(view, /responsiveMode\(\) === 'scroll'/);
  assert.match(view, /Deslice horizontalmente/);
  assert.match(view, /tabindex/);
  assert.match(styles, /focus-visible:ring-2/);
});

test('pagination controls have 44px mobile touch targets', () => {
  const impl = read('projects/uijona/src/lib/molecules/JPagination/JPaginationImpl.ts');
  assert.match(impl, /h-11 min-w-\[2\.75rem\]/);
});