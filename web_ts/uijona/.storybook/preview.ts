import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

// ─── helpers ─────────────────────────────────────────────────────────────────

const escapeJsxText = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const isReactElementLike = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && '$$typeof' in value;

const getElementName = (value: unknown): string => {
  const elementType = (value as { type?: string | { displayName?: string; name?: string } }).type;
  return typeof elementType === 'string'
    ? elementType
    : (elementType?.displayName || elementType?.name || 'Component');
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

// ─── React element serializer ─────────────────────────────────────────────────

const serializeChildren = (children: unknown): string => {
  if (children === undefined || children === null || children === false) return '';
  if (typeof children === 'string') return escapeJsxText(children);
  if (typeof children === 'number') return String(children);
  if (isReactElementLike(children)) return serializeReactElement(children);
  if (Array.isArray(children)) return children.map(serializeChildren).filter(Boolean).join('');
  return '';
};

const serializeReactElement = (element: unknown): string => {
  if (!isReactElementLike(element)) return '';
  const name = getElementName(element);
  const el = element as { props?: Record<string, unknown> };
  const { children, ...restProps } = el.props ?? {};

  const propParts: string[] = [];
  for (const [key, val] of Object.entries(restProps)) {
    if (val === undefined || typeof val === 'function') continue;
    if (typeof val === 'boolean') {
      if (val) propParts.push(key); else propParts.push(`${key}={false}`);
    } else if (typeof val === 'string') {
      propParts.push(`${key}="${val}"`);
    } else if (typeof val === 'number') {
      propParts.push(`${key}={${val}}`);
    } else if (isReactElementLike(val)) {
      propParts.push(`${key}={${serializeReactElement(val)}}`);
    } else {
      const obj = formatObjectLiteral(val);
      if (obj) propParts.push(`${key}={${obj}}`);
    }
  }

  const propsStr = propParts.length ? ' ' + propParts.join(' ') : '';
  const childStr = serializeChildren(children);
  if (!childStr) return `<${name}${propsStr} />`;
  return `<${name}${propsStr}>${childStr}</${name}>`;
};

// ─── arg formatters ───────────────────────────────────────────────────────────

const formatArgValue = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'function') return undefined;
  if (typeof value === 'boolean') return `{${value}}`;
  if (typeof value === 'number') return `{${value}}`;
  if (typeof value === 'string') return JSON.stringify(value);
  if (isReactElementLike(value)) return `{${serializeReactElement(value)}}`;
  const objectLiteral = formatObjectLiteral(value);
  return objectLiteral ? `{${objectLiteral}}` : undefined;
};

const formatChildren = (children: unknown): string | undefined => {
  const result = serializeChildren(children);
  return result || undefined;
};

// ─── source extraction from render functions ──────────────────────────────────

/** Find balanced closing char starting from index 0 of `str` (which must start with open). */
const extractBalancedContent = (str: string, open: string, close: string): string | null => {
  if (!str.startsWith(open)) return null;
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === open) depth++;
    else if (str[i] === close) { depth--; if (depth === 0) return str.slice(1, i).trim(); }
  }
  return null;
};

/**
 * For render-function stories, try to extract just the JSX from the render body.
 * Handles:  `() => (<JSX>)`, `(args) => (<JSX>)`, and bodies with `return (<JSX>)`.
 */
const extractRenderJsx = (source: string): string | null => {
  const trimmed = source.trim();

  // Locate `=>` (arrow function render)
  const arrowIdx = trimmed.indexOf('=>');
  if (arrowIdx !== -1) {
    const afterArrow = trimmed.slice(arrowIdx + 2).trimStart();

    // Arrow returning parens: `=> ( <JSX> )`
    if (afterArrow.startsWith('(')) {
      const inner = extractBalancedContent(afterArrow, '(', ')');
      if (inner && inner.trimStart().startsWith('<')) return inner.trim();
    }

    // Arrow returning block: `=> { ... return (<JSX>); }`
    if (afterArrow.startsWith('{')) {
      const body = extractBalancedContent(afterArrow, '{', '}') ?? '';
      const returnMatch = body.match(/return\s*\(/);
      if (returnMatch) {
        const afterReturn = body.slice((returnMatch.index ?? 0) + returnMatch[0].length - 1).trimStart();
        const inner = extractBalancedContent(afterReturn, '(', ')');
        if (inner && inner.trimStart().startsWith('<')) return inner.trim();
      }
    }

    // Arrow returning JSX directly (no parens): `=> <JSX>`
    if (afterArrow.startsWith('<')) return afterArrow.trim();
  }

  return null;
};

// ─── JSX tag reformatter (multi-prop → one prop per line) ────────────────────

const splitJsxProps = (props: string): string[] => {
  const chunks: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let braceDepth = 0;
  let bracketDepth = 0;
  let parenDepth = 0;

  for (const char of props.trim()) {
    if (quote) { current += char; if (char === quote) quote = null; continue; }
    if (char === '"' || char === "'") { quote = char; current += char; continue; }
    if (char === '{') braceDepth++;
    if (char === '}') braceDepth--;
    if (char === '[') bracketDepth++;
    if (char === ']') bracketDepth--;
    if (char === '(') parenDepth++;
    if (char === ')') parenDepth--;
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

const reformatJsxTags = (jsx: string): string => {
  const multiline = jsx.includes('\n');
  const source = multiline ? jsx.trim() : jsx.replace(/\s+/g, ' ').trim();
  const jsxTagPattern = /<([A-Z][\w.]*)((?:\s+[^<>]*?)?)(\s*\/?)>/g;
  return source.replace(jsxTagPattern, (match, componentName: string, props: string, closing: string) => {
    const propList = splitJsxProps(props);
    if (propList.length < 2 || match.includes('\n')) return match;
    const closingMarker = closing.includes('/') ? '\n/>' : '\n>';
    return `<${componentName}\n  ${propList.join('\n  ')}${closingMarker}`;
  });
};

// ─── story context builder ────────────────────────────────────────────────────

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

const buildJsxSourceFromArgs = (storyContext: DocsStoryContext): string => {
  const componentName = getComponentName(storyContext);
  const args = storyContext.args ?? {};
  const children = formatChildren(args.children);
  const props = Object.entries(args)
    .filter(([key]) => key !== 'children')
    .map(([key, value]) => {
      const formatted = formatArgValue(value);
      return formatted !== undefined ? `${key}=${formatted}` : undefined;
    })
    .filter((p): p is string => p !== undefined);

  const propsSource = props.length > 0 ? `\n  ${props.join('\n  ')}` : '';

  if (!children) return propsSource ? `<${componentName}${propsSource}\n/>` : `<${componentName} />`;
  return propsSource
    ? `<${componentName}${propsSource}\n>\n  ${children.replace(/\n/g, '\n  ')}\n</${componentName}>`
    : `<${componentName}>${children}</${componentName}>`;
};

// ─── main transform ───────────────────────────────────────────────────────────

/** Returns true when the Storybook-extracted source should be replaced by args-generated JSX. */
const isArgsBasedSource = (source: string): boolean =>
  !source ||
  source === '{}' ||
  source === '<Story />' ||
  /^\{\s*args\s*:/.test(source) ||
  /\{\s*\.\.\.args\s*\}/.test(source) ||
  /^args$/i.test(source);

const formatJsxSource = (
  source: string | undefined,
  storyContext: DocsStoryContext = {},
): string => {
  const normalized = source?.trim() ?? '';

  // 1. Args-based story (default case) → generate from storyContext.args
  if (isArgsBasedSource(normalized)) {
    return buildJsxSourceFromArgs(storyContext);
  }

  // 2. Story object with render: function  →  extract the render JSX, else fall back to args
  if (/^\{[\s\S]*render\s*:/.test(normalized)) {
    // If it also has args key, use args (Interactive pattern)
    if (/^\{\s*args\s*:/.test(normalized) || /args\s*:[\s\S]*render\s*:/.test(normalized)) {
      return buildJsxSourceFromArgs(storyContext);
    }
    // Render-only story → extract JSX from render function
    const jsx = extractRenderJsx(normalized.replace(/^\{\s*render\s*:\s*/, '').replace(/\s*,?\s*\}$/, ''));
    if (jsx) return reformatJsxTags(jsx);
    return buildJsxSourceFromArgs(storyContext);
  }

  // 3. Bare render function: `(args) => (...)` or `() => (...)`
  if (/^\(/.test(normalized)) {
    const jsx = extractRenderJsx(normalized);
    if (jsx) return reformatJsxTags(jsx);
    return buildJsxSourceFromArgs(storyContext);
  }

  // 4. Already clean JSX → just reformat tags
  return reformatJsxTags(normalized);
};

// ─── preview config ───────────────────────────────────────────────────────────

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
        { name: 'light', value: '#ffffff' },
        { name: 'gray',  value: '#f5f5f5' },
        { name: 'dark',  value: '#1e1e1e' },
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
