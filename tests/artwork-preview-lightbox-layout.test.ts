import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  new URL('../src/components/artwork/ArtworkPreviewLightbox.astro', import.meta.url),
  'utf8',
);

describe('artwork preview lightbox layout', () => {
  it('portals the modal to body so page stacking contexts cannot sit above it', () => {
    expect(source).toContain('document.body.append(lightbox)');
    expect(source).toMatch(/\.wallpaper-lightbox\s*\{[^}]*position:\s*fixed;[^}]*z-index:\s*1000/s);
  });

  it('uses a near-full-height phone preview on desktop mobile-wallpaper previews', () => {
    expect(source).toMatch(
      /\.phone-device\s*\{[^}]*width:\s*min\(100%,43vh,430px\);[^}]*aspect-ratio:\s*322\s*\/\s*662/s,
    );
    expect(source).toMatch(
      /grid-template-columns:\s*minmax\(260px,\.86fr\)\s+minmax\(260px,1\.18fr\)\s+minmax\(250px,290px\)/,
    );
  });
});
