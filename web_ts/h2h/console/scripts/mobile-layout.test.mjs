import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('login prioritizes the form at 320px', () => {
  const mobile = css.slice(css.indexOf('@media (max-width: 480px)'));
  assert.match(mobile, /\.h2h-login__lead[\s\S]*display:\s*none/);
  assert.match(mobile, /\.h2h-login__main[\s\S]*padding:\s*1rem/);
  assert.match(mobile, /\.h2h-login__card[\s\S]*padding:\s*1rem/);
});

test('async states and filter actions stack with mobile touch targets', () => {
  const mobile = css.slice(css.indexOf('@media (max-width: 640px)'));
  assert.match(mobile, /\.h2h-async-state[\s\S]*flex-direction:\s*column/);
  assert.match(mobile, /\.h2h-filter-panel[\s\S]*min-height:\s*2\.75rem/);
});

test('mobile navigation controls expose a 44px touch target', () => {
  const mobile = css.slice(css.indexOf('@media (max-width: 640px)'));
  assert.match(mobile, /\.h2h-mobile-bar \.h2h-icon-button[\s\S]*height:\s*2\.75rem/);
});
test('mobile form controls prevent iOS zoom and expose 44px touch targets', () => {
  const mobile = css.slice(css.indexOf('@media (max-width: 640px)'));
  assert.match(mobile, /input:not\(\[type='checkbox'\]\):not\(\[type='radio'\]\):not\(\[type='hidden'\]\)/);
  assert.match(mobile, /select[\s\S]*min-height:\s*2\.75rem/);
  assert.match(mobile, /select[\s\S]*font-size:\s*1rem/);
  assert.match(mobile, /:is\(\.h2h-main,\s*\.h2h-login,\s*j-dialog\) button[\s\S]*min-height:\s*2\.75rem/);
});

test('mobile shell keeps header in one row and hides desktop collapse control', () => {
  assert.match(css, /@media \(max-width: 1023px\)[\s\S]*\.h2h-mobile-bar\s*\{[\s\S]*display:\s*flex/);
  assert.match(css, /@media \(max-width: 1023px\)[\s\S]*\.h2h-collapse\s*\{[\s\S]*display:\s*none/);
  assert.match(css, /@media \(max-width: 1023px\)[\s\S]*\.h2h-nav-item,[\s\S]*\.h2h-logout\s*\{[\s\S]*min-height:\s*2\.75rem/);
});
test('mobile actions and tabs expose 44px touch targets', () => {
  const mobile = css.slice(css.indexOf('@media (max-width: 640px)'));
  assert.match(mobile, /:is\(\.h2h-main,\s*\.h2h-login,\s*j-dialog\) button[\s\S]*min-width:\s*2\.75rem[\s\S]*min-height:\s*2\.75rem/);
  assert.match(mobile, /\.h2h-main \[role='tab'\][\s\S]*min-width:\s*2\.75rem[\s\S]*min-height:\s*2\.75rem/);
});

test('mobile dashboard navigation links expose 44px touch targets', () => {
  const mobile = css.slice(css.indexOf('@media (max-width: 640px)'));
  assert.match(mobile, /\.h2h-main nav a\s*\{[^}]*min-height:\s*2\.75rem/);
});