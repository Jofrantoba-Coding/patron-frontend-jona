import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * softcommerce has no Tailwind build of its own: the only utilities it gets are the ones `jona-ui/index.css` was
 * compiled with (the lib's own sources), plus `src/styles/app.css`. These checks keep the two in step with the classes
 * the app writes.
 */
const srcDir = fileURLToPath(new URL('..', import.meta.url));
const libCss = readFileSync(fileURLToPath(new URL('../../node_modules/jona-ui/dist/index.css', import.meta.url)), 'utf8');
const appCssSource = readFileSync(fileURLToPath(new URL('./app.css', import.meta.url)), 'utf8');
/** The rules only: a comment that closes early (a stray `*` + `/` inside it) leaves its tail here as garbage. */
const appCss = appCssSource.replace(/\/\*[\s\S]*?\*\//g, '');
const mainTsx = readFileSync(join(srcDir, 'main.tsx'), 'utf8');

const BACKSLASH = String.fromCharCode(92);
const selectorOf = (cls: string) => '.' + cls.replace(/[:/.[\]%#()!,]/g, (char) => BACKSLASH + char);
const defines = (css: string, cls: string) => ['{', ',', ':', ' ', '>', '[', '.'].some((next) => css.includes(selectorOf(cls) + next));

// A Tailwind utility (optionally behind responsive / state variants) as the app writes them.
const UTILITY =
  /^-?((sm|md|lg|xl|2xl|hover|focus|focus-visible|disabled|max-md):)*(flex|grid|block|inline|inline-flex|inline-block|hidden|contents|static|fixed|absolute|relative|sticky|truncate|uppercase|lowercase|underline|sr-only|shrink(-0)?|grow(-0)?|border(-[a-z0-9-]+)?|rounded(-[a-z0-9-]+)?|shadow(-[a-z0-9-]+)?|transition(-[a-z]+)?|(m|p)[trblxy]?-[a-z0-9.[\]_]+|(w|h|min-w|min-h|max-w|max-h|gap|gap-x|gap-y|z|inset|inset-x|inset-y|top|left|right|bottom|opacity|basis|order|duration|translate-x|translate-y)-[a-z0-9./[\]_-]+|(grid-cols|grid-rows|col-span|row-span)-[a-z0-9[\]_]+|(items|justify|justify-self|content|self|place-items|place-content)-[a-z]+|(text|font|bg|leading|tracking|whitespace|overflow|overflow-x|overflow-y|cursor|list|break|select|pointer-events|object|aspect|ease|ring|outline)-[a-z0-9/[\]_.-]+)$/;
const NOT_UTILITY = new Set(['list-toolbar']);

function sources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) sources(path, out);
    else if (/\.tsx?$/.test(entry.name) && !/\.spec\./.test(entry.name)) out.push(path);
  }
  return out;
}

/** Every utility-looking token of every string or template literal whose tokens all look like class names. */
function usedUtilities(): Map<string, Set<string>> {
  const used = new Map<string, Set<string>>();
  for (const file of sources(srcDir)) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)) {
      const tokens = (match[1] ?? match[2] ?? match[3]).replace(/\$\{[^}]*\}/g, ' ').split(/\s+/).filter(Boolean);
      if (!tokens.length || !tokens.every((token) => /^[a-z0-9:\-[\]_/.%]+$/.test(token))) continue;
      for (const token of tokens.filter((t) => UTILITY.test(t) && !NOT_UTILITY.has(t))) {
        const files = used.get(token) ?? new Set<string>();
        files.add(relative(srcDir, file).split(sep).join('/'));
        used.set(token, files);
      }
    }
  }
  return used;
}

describe('app styles over jona-ui/index.css', () => {
  it('every utility class the app writes is defined by the lib CSS or by src/styles/app.css', () => {
    const used = usedUtilities();
    const undefinedClasses = [...used]
      .filter(([cls]) => !defines(libCss, cls) && !defines(appCss, cls))
      .map(([cls, files]) => `${cls} (${[...files].join(', ')})`);

    expect(used.size).toBeGreaterThan(30);
    expect(undefinedClasses).toEqual([]);
  });

  it('app.css comments are well formed, so no rule is swallowed by one', () => {
    expect(appCss).not.toContain('*/');
    expect(appCss.split('{').length).toBe(appCss.split('}').length);
  });

  it('main.tsx loads app.css after the lib CSS, so its rules win the ties', () => {
    const lib = mainTsx.indexOf("import 'jona-ui/index.css';");
    const app = mainTsx.indexOf("import './styles/app.css';");

    expect(lib).toBeGreaterThanOrEqual(0);
    expect(app).toBeGreaterThan(lib);
  });

  it('a [hidden] element stays hidden even when a display utility (grid, flex) is on it', () => {
    // The lib preflight hides [hidden] at the specificity of one class, so `.grid` on an inactive tab panel showed it.
    expect(appCss).toMatch(/\[hidden\]:not\(\[hidden=['"]until-found['"]\]\)\s*\{\s*display:\s*none\s*!important;?\s*\}/);
  });

  it('lg:hidden hides a JPanel from lg up (the sidebar drawer bar), over the panel own display rule', () => {
    // `.jpanel[data-jpanel-desktop-layout=box]{display:flex}` outranks the lib `.lg\:hidden`.
    const lgBlock = /@media\s*\(min-width:\s*1024px\)\s*\{([\s\S]*?)\n\}/.exec(appCss)?.[1] ?? '';
    expect(lgBlock).toContain(`.jpanel${selectorOf('lg:hidden')}`);
    expect(lgBlock).toMatch(/display:\s*none\s*!important/);
  });
});
