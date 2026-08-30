import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readSource = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('artwork engagement ranking', () => {
  it('ranks recommended by downloads and popular by views', () => {
    const repository = readSource('src/lib/content/repositories/artwork.ts');

    expect(repository).toContain(
      "'a.download_count DESC, a.view_count DESC, COALESCE(a.published_at, a.created_at) DESC, a.id'",
    );
    expect(repository).toContain(
      "'a.view_count DESC, a.download_count DESC, COALESCE(a.published_at, a.created_at) DESC, a.id'",
    );
  });

  it('persists and backfills artwork views while normalizing real downloads', () => {
    const migration = readSource('migrations/0031_artwork_view_count.sql');

    expect(migration).toContain('ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0');
    expect(migration).toContain("e.event_name = 'artwork_click'");
    expect(migration).toContain("d.variant = 'original'");
  });

  it('shows download count in the preview only when positive and records preview downloads', () => {
    const card = readSource('src/components/artwork/ExploreArtworkCard.astro');
    const lightbox = readSource('src/components/artwork/ArtworkPreviewLightbox.astro');

    expect(card).toContain('data-artwork-download-count={artwork.downloadCount ?? 0}');
    expect(lightbox).toContain('data-lightbox-download-count hidden');
    expect(lightbox).toContain('downloadCountEl.hidden = currentDownloadCount <= 0');
    expect(lightbox).toContain("fetch('/api/download'");
    expect(lightbox).toContain("name: 'artwork_view'");
  });

  it('counts only real original downloads until derived assets exist', () => {
    const downloadApi = readSource('src/pages/api/download.ts');
    expect(downloadApi).toContain("if (db && variant === 'original')");
  });
});
