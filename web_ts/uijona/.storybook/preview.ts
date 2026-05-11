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

const getComponentName = (storyContext: { title?: string; component?: { displayName?: string; name?: string } }): string => {
  const titleName = storyContext.title?.split('/').filter(Boolean).at(-1);
  return titleName || storyContext.component?.displayName || storyContext.component?.name || 'Component';
};

const shouldGenerateJsxSource = (source: string | undefined): boolean => {
  if (!source) return true;
  const normalized = source.trim();
  return (
    !normalized ||
    normalized === '{}' ||
    /^\{\s*args\s*:/.test(normalized) ||
    // render function captured as string — not useful as JSX
    /^(\(args\)|args|\(\))\s*=>/.test(normalized) ||
    normalized.startsWith('function ') ||
    // dynamic capture returned an HTML element (lowercase) — not a React component
    /^<[a-z]/.test(normalized)
  );
};

const formatArgValue = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'function') return '{fn()}';
  if (typeof value === 'boolean') return `{${value}}`;
  if (typeof value === 'number') return `{${value}}`;
  if (typeof value === 'string') return JSON.stringify(value);

  if (typeof value === 'object' && value && '$$typeof' in value) {
    const elementType = (value as { type?: string | { displayName?: string; name?: string } }).type;
    const elementName = typeof elementType === 'string'
      ? elementType
      : elementType?.displayName || elementType?.name || 'Component';

    return `{<${elementName} />}`;
  }

  try {
    return `{${JSON.stringify(value)}}`;
  } catch {
    return undefined;
  }
};

const buildJsxSourceFromArgs = (
  storyContext: { title?: string; component?: { displayName?: string; name?: string }; args?: Record<string, unknown> }
): string => {
  const componentName = getComponentName(storyContext);
  const args = storyContext.args ?? {};
  const props = Object.entries(args)
    .map(([key, value]) => {
      const formatted = formatArgValue(value);
      if (formatted === undefined) return undefined;
      return `${key}=${formatted}`;
    })
    .filter(Boolean);

  if (props.length === 0) return `<${componentName} />`;

  return `<${componentName}\n  ${props.join('\n  ')}\n/>`;
};

const formatJsxSource = (
  source: string,
  storyContext: { title?: string; component?: { displayName?: string; name?: string }; args?: Record<string, unknown> } = {}
): string => {
  if (shouldGenerateJsxSource(source)) {
    return buildJsxSourceFromArgs(storyContext);
  }

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
        language: 'tsx',
        type: 'dynamic',
        transform: formatJsxSource,
      },
    },
  },
};

export default preview;
