import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { listStructuredMythologyBundles } from '../src/content/registry';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';
import { storyIllustrations } from '../src/data/story-illustrations';

describe('structured mythology content contract', () => {
  it('validates every registered bundle with the same contract', () => {
    for (const bundle of listStructuredMythologyBundles()) {
      const mythology = mythologies.find((item) => item.id === bundle.mythologyId);
      expect(mythology, bundle.mythologyId).toBeDefined();
      expect(validateStructuredContent({ bundle, mythology: mythology!, illustrations: storyIllustrations }), bundle.mythologyId).toEqual([]);
    }
  });
});
