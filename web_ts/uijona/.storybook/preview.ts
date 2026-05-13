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

interface DocsStoryContext {
  title?: string;
  component?: { displayName?: string; name?: string };
  args?: Record<string, unknown>;
}

const getComponentName = (storyContext: DocsStoryContext): string => {
  const componentName = storyContext.component?.displayName || storyContext.component?.name;
  const titleName = storyContext.title?.split('/').filter(Boolean).at(-1);
  return componentName || titleName || 'Component';
};

const shouldGenerateJsxSource = (source: string | undefined): boolean => {
  const normalized = source?.trim() ?? '';
  return (
    !normalized ||
    normalized === '{}' ||
    normalized === '<Story />' ||
    /^\{\s*args\s*:/.test(normalized) ||
    /\{\s*\.\.\.args\s*\}/.test(normalized) ||
    /^args$/i.test(normalized)
  );
};

const escapeJsxText = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const isReactElementLike = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && '$$typeof' in value;

const getElementName = (value: unknown): string => {
  const elementType = (value as { type?: string | { displayName?: string; name?: string } }).type;
  return typeof elementType === 'string'
    ? elementType
    : elementType?.displayName || elementType?.name || 'Component';
};

const formatObjectLiteral = (value: unknown): string | undefined => {
  try {
    return JSON.stringify(value, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/\n/g, '\n  ');
  } catch {
    return undefined;
  }
};

const formatArgValue = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'function') return undefined;
  if (typeof value === 'boolean') return `{${value}}`;
  if (typeof value === 'number') return `{${value}}`;
  if (typeof value === 'string') return JSON.stringify(value);

  if (isReactElementLike(value)) {
    return `{<${getElementName(value)} />}`;
  }

  const objectLiteral = formatObjectLiteral(value);
  return objectLiteral ? `{${objectLiteral}}` : undefined;
};

const formatChildren = (children: unknown): string | undefined => {
  if (children === undefined || children === null || children === false) return undefined;
  if (typeof children === 'string') return escapeJsxText(children);
  if (typeof children === 'number') return `{${children}}`;
  if (isReactElementLike(children)) return `<${getElementName(children)} />`;
  if (Array.isArray(children)) {
    const rendered = children.map(formatChildren).filter(Boolean).join('\n');
    return rendered || undefined;
  }

  const objectLiteral = formatObjectLiteral(children);
  return objectLiteral ? `{${objectLiteral}}` : undefined;
};

const buildJsxSourceFromArgs = (storyContext: DocsStoryContext): string => {
  const componentName = getComponentName(storyContext);
  const args = storyContext.args ?? {};
  const children = formatChildren(args.children);
  const props = Object.entries(args)
    .filter(([key]) => key !== 'children')
    .map(([key, value]) => {
      const formatted = formatArgValue(value);
      if (formatted === undefined) return undefined;
      return `${key}=${formatted}`;
    })
    .filter(Boolean);

  const propsSource = props.length > 0 ? `\n  ${props.join('\n  ')}` : '';

  if (!children) {
    return propsSource ? `<${componentName}${propsSource}\n/>` : `<${componentName} />`;
  }

  return propsSource
    ? `<${componentName}${propsSource}\n>\n  ${children.replace(/\n/g, '\n  ')}\n</${componentName}>`
    : `<${componentName}>${children}</${componentName}>`;
};

const formatJsxSource = (
  source: string | undefined,
  storyContext: DocsStoryContext = {}
): string => {
  if (shouldGenerateJsxSource(source)) {
    return buildJsxSourceFromArgs(storyContext);
  }

  const resolvedSource = source ?? '';
  const sourceWithoutExtraSpaces = resolvedSource.includes('\n')
    ? resolvedSource.trim()
    : resolvedSource.replace(/\s+/g, ' ').trim();
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
        format: false,
        language: 'tsx',
        type: 'code',
        transform: formatJsxSource,
      },
    },
  },
};

export default preview;
