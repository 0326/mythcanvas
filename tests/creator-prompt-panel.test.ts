import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const creatorSource = readFileSync(
  new URL('../src/pages/create/index.astro', import.meta.url),
  'utf8',
);
const previewApiSource = readFileSync(
  new URL('../src/pages/api/prompt-preview.ts', import.meta.url),
  'utf8',
);

describe('creator prompt panel', () => {
  it('exposes preview and prompt tabs plus a copy-prompt action', () => {
    expect(creatorSource).toContain('data-view-tab="preview"');
    expect(creatorSource).toContain('data-view-tab="prompt"');
    expect(creatorSource).toContain('data-copy-prompt');
    expect(creatorSource).toContain('data-prompt-layers');
    expect(creatorSource).toContain('data-prompt-final');
  });

  it('builds prompt previews with the same generation prompt composer', () => {
    expect(previewApiSource).toContain('parseGenerationRequest(payload)');
    expect(previewApiSource).toContain('resolveGenerationContext(locals.runtime.env.DB, generationRequest)');
    expect(previewApiSource).toContain('composeGenerationPromptLayers(context)');
    expect(previewApiSource).toContain('composeGenerationPrompt(context)');
  });
});
