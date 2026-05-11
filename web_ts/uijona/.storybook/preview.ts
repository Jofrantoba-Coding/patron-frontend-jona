import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

const splitJsxProps = (props: string): string[] => {
  const chunks: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let braceDepth = 0;
  let bracketDepth = 0;
  let parenDepth = 0;

  for (const char of props.trim()) {
    if (quote) {
      current += char;
      if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }

    if (char === '{') braceDepth += 1;
    if (char === '}') braceDepth -= 1;
    if (char === '[') bracketDepth += 1;
    if (char === ']') bracketDepth -= 1;
    if (char === '(') parenDepth += 1;
    if (char === ')') parenDepth -= 1;

    if (char === ' ' && braceDepth === 0 && bracketDepth === 0 && parenDepth === 0) {
      if (current.trim()) chunks.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
};

const formatJsxSource = (source: string): string => {
  const sourceWithoutExtraSpaces = source.includes('\n') ? source.trim() : source.replace(/\s+/g, ' ').trim();
  const jsxTagPattern = /<([A-Z][\w.]*)((?:\s+[^<>]*?)?)(\s*\/?)>/g;

  return sourceWithoutExtraSpaces.replace(jsxTagPattern, (match, componentName: string, props: string, closing: string) => {
    const propList = splitJsxProps(props);

    if (propList.length < 2 || match.includes('\n')) {
      return match;
    }

    const closingMarker = closing.includes('/') ? '\n/>' : '\n>';
    return `<${componentName}\n  ${propList.join('\n  ')}${closingMarker}`;
  });
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',  value: '#ffffff' },
        { name: 'gray',   value: '#f5f5f5' },
        { name: 'dark',   value: '#1e1e1e' },
      ],
    },
    docs: {
      source: {
        format: 'tsx',
        language: 'tsx',
        transform: formatJsxSource,
      },
    },
  },
};

export default preview;
