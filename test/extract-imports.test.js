import assert from 'node:assert/strict';
import test from 'node:test';

import { extractImports } from '../index.js';

test('extracts side-effect imports with either quote style', () => {
  const source = `
import '@fontsource/inter';
  import "@fontsource/lora"
`;

  assert.deepEqual(extractImports(source), [
    '@fontsource/inter',
    '@fontsource/lora',
  ]);
});

test('ignores other import-like syntax', () => {
  const source = `
// import '@fontsource/commented';
import value from '@fontsource/named';
const font = import('@fontsource/dynamic');
`;

  assert.deepEqual(extractImports(source), []);
});
