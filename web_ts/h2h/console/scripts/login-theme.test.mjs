import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const stylesheet = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('login context background references a defined H2H token', () => {
  const contextRule = stylesheet.match(/\.h2h-login__context\s*\{([\s\S]*?)\}/);
  assert.ok(contextRule, 'Expected the .h2h-login__context rule in src/styles.css');

  const background = contextRule[1].match(/background:\s*var\((--h2h-[\w-]+)\)\s*;/);
  assert.ok(background, 'Expected the login context background to use an H2H token');

  const token = background[1];
  const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(
    stylesheet,
    new RegExp(`${escapedToken}\\s*:`),
    `Login background references undefined token ${token}`,
  );
});