import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readSource = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('collection filter sticky layout', () => {
  it('stacks the shared filter below the sticky site header', () => {
    const header = readSource('src/components/Header.astro');
    const globalCss = readSource('src/styles/global.css');

    expect(header).toMatch(
      /\.site-header\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0;[^}]*z-index:\s*var\(--z-header\)/s,
    );
    expect(globalCss).toMatch(
      /\.collection-filter-section\s*\{[^}]*position:\s*sticky;[^}]*top:\s*var\(--header-height\);[^}]*z-index:\s*calc\(var\(--z-header\) - 1\)/s,
    );
  });

  it.each([
    'src/pages/explore/index.astro',
    'src/pages/character/index.astro',
    'src/pages/world/index.astro',
  ])('%s uses the shared sticky filter section', (path) => {
    expect(readSource(path)).toContain('collection-filter-section');
  });

  it('does not let the character page override the shared sticky positioning', () => {
    const characterPage = readSource('src/pages/character/index.astro');
    expect(characterPage).not.toMatch(/\.filter-section\s*\{[^}]*position:\s*sticky/s);
  });
});
