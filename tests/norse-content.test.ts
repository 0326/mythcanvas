import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { norseAssetProvenance, norseCharacters, norseKnownIssues, norseMythicObjects, norseRelations, norseSourceCoverage, norseSources, norseStories, norseStoryCycles, norseStoryDependencyPlan, norseStoryManifest, norseVariantNotes } from '../src/content/norse';
import { buildNorseCollectionDiscoveryInput } from '../src/content/norse/collection-handoff';
import { getStoryIllustrationById } from '../src/data/story-illustrations';
import { storyIllustrations } from '../src/data/story-illustrations';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';
import { validateMythStories } from '../src/lib/content/story-validation';
import { getIndexableStoryPaths, getPublicStoryPaths, getPublicStoryRedirectPaths, getStoryRedirectForMythology } from '../src/lib/content/stories';
import { GET as getSitemap } from '../src/pages/sitemap-pages.xml';

describe('Norse structured content', () => {
  const bundle = getStructuredMythologyBundle('myth-norse')!;

  it('keeps launch ids and legacy stories stable while closing the P0 story graph', () => {
    expect(norseCharacters.map((item) => item.slug)).toEqual(expect.arrayContaining(['odin', 'thor', 'loki', 'freyja', 'hel', 'fenrir', 'jormungandr']));
    expect(norseStories.length).toBeGreaterThanOrEqual(32);
    expect(norseStories.map((item) => item.id)).toEqual(expect.arrayContaining(['story-ymir-creation', 'story-odin-world-tree', 'story-ragnarok']));
    expect(norseRelations.length).toBeGreaterThan(30);
  });

  it('keeps canonical entity ids unique for graph and handoff consumers', () => {
    expect(new Set(norseCharacters.map((item) => item.id)).size).toBe(norseCharacters.length);
    expect(new Set(bundle.worlds.map((item) => item.id)).size).toBe(bundle.worlds.length);
    expect(new Set(bundle.scenes.map((item) => item.id)).size).toBe(bundle.scenes.length);
    expect(new Set(norseMythicObjects.map((item) => item.id)).size).toBe(norseMythicObjects.length);
  });

  it('has no unresolved dependencies or unscoped relation duplicates', () => {
    const mythology = mythologies.find((item) => item.id === 'myth-norse')!;
    expect(validateStructuredContent({ bundle, mythology })).toEqual([]);
  });

  it('projects every Manifest expected dependency into the Story required closure', () => {
    const storiesById = new Map(norseStories.map((story) => [story.id, story]));

    for (const manifestStory of norseStoryManifest) {
      const story = manifestStory.existingStoryId ? storiesById.get(manifestStory.existingStoryId) : undefined;
      if (!story) continue;
      expect(story.requiredCharacterIds).toEqual(expect.arrayContaining([...manifestStory.expectedDependencies.character]));
      expect(story.requiredWorldIds).toEqual(expect.arrayContaining([...manifestStory.expectedDependencies.world]));
      expect(story.requiredSceneIds).toEqual(expect.arrayContaining([...manifestStory.expectedDependencies.scene]));
      expect(story.requiredObjectIds).toEqual(expect.arrayContaining([...manifestStory.expectedDependencies['mythic-object']]));
    }

    expect(storiesById.get('story-aesir-vanir-war')?.requiredCharacterIds).toEqual(expect.arrayContaining([
      'character-gullveig',
      'character-odin',
      'character-njordr',
      'character-freyr',
      'character-freyja',
    ]));
  });

  it('keeps an explicit World/Scene dependency plan for every existing Manifest Story', () => {
    const existingManifestSlugs = norseStoryManifest
      .filter((story) => story.existingStoryId)
      .map((story) => story.proposedSlug);

    expect(Object.keys(norseStoryDependencyPlan).toSorted()).toEqual(existingManifestSlugs.toSorted());
    expect(Object.values(norseStoryDependencyPlan).every((plan) => plan.world.length > 0 && plan.scene.length > 0)).toBe(true);
  });

  it('keeps the Phase 0 factual corrections and legacy URL compatibility explicit', () => {
    const stolenHammer = norseStories.find((item) => item.id === 'story-thryms-stolen-hammer')!;
    const baldrFuneral = norseStories.find((item) => item.id === 'story-baldrs-funeral')!;
    const askAndEmbla = norseStories.find((item) => item.id === 'story-ask-and-embla')!;
    expect(stolenHammer.characterIds).toContain('character-thrymr');
    expect(stolenHammer.requiredObjectIds).toContain('object-norse-mjolnir');
    expect(baldrFuneral.requiredObjectIds).toContain('object-norse-hringhorni');
    expect(baldrFuneral.requiredObjectIds).not.toContain('object-norse-naglfar');
    expect(askAndEmbla.requiredCharacterIds).toEqual(expect.arrayContaining(['character-odin', 'character-honir', 'character-lodur']));
    expect(askAndEmbla.requiredCharacterIds).not.toEqual(expect.arrayContaining(['character-vili', 'character-ve']));
    expect(norseRelations.some((relation) => relation.id === 'norse-enemy-thor-fenrir')).toBe(false);
    expect(getStoryRedirectForMythology('myth-norse', 'freyja-and-gerdr')?.slug).toBe('freyr-and-gerdr');
    expect(norseCharacters.filter((item) => ['ymir', 'surtr', 'gerdr'].includes(item.slug)).every((item) => item.characterType === 'mythic-being')).toBe(true);
  });

  it('keeps the Phase 2 research baseline source-complete and auditable', () => {
    expect(norseSources).toHaveLength(45);
    expect(norseSourceCoverage).toHaveLength(norseSources.length);
    expect(norseSourceCoverage.filter((item) => item.priority === 'P0').every((item) => item.status !== 'unreviewed')).toBe(true);
    expect(norseStoryManifest).toHaveLength(74);
    expect(norseStories).toHaveLength(74);
    expect(norseStories.map((story) => story.id)).toEqual(expect.arrayContaining(['story-aesir-vanir-war', 'story-aesir-vanir-truce']));
    expect(norseStoryCycles).toHaveLength(9);
    expect(norseMythicObjects).toHaveLength(18);
    expect(norseKnownIssues.filter((item) => item.priority === 'P0').every((item) => item.status === 'resolved')).toBe(true);
    expect(norseVariantNotes.filter((item) => item.priority === 'P0').every((item) => item.status === 'scoped')).toBe(true);
    expect(norseSources.filter((item) => ['norse-src-voluspa', 'norse-src-prose-edda-gylfaginning', 'norse-src-haustlong', 'norse-src-volsunga-saga'].includes(item.sourceId)).every((item) => item.edition && item.licenseNote)).toBe(true);
  });

  it('promotes curated multi-section drafts to structured without implying source review', () => {
    const curatedDrafts = norseStories.filter((story) => story.blocks.filter((block) => block.type === 'heading').length >= 3);

    expect(curatedDrafts.length).toBeGreaterThan(0);
    expect(curatedDrafts.every((story) => story.editorialStatus === 'structured')).toBe(true);
    expect(curatedDrafts.every((story) => story.editorialStatus !== 'source-reviewed')).toBe(true);
  });

  it('does not let a prototype body masquerade as source-reviewed editorial content', () => {
    const mythology = mythologies.find((item) => item.id === 'myth-norse')!;
    const prototype = norseStories.find((story) => story.slug === 'grottasongr')!;
    const issues = validateMythStories({
      stories: [{ ...prototype, editorialStatus: 'source-reviewed' }],
      mythologies: [mythology],
      characters: norseCharacters,
      worlds: bundle.worlds,
      scenes: bundle.scenes,
      objects: norseMythicObjects,
      illustrations: [],
    });
    expect(issues.map((issue) => issue.field)).toContain('editorialReview');
  });

  it('keeps editorial drafts off the sitemap until a dated source review is recorded', () => {
    expect(norseStories.every((story) => !['source-reviewed', 'visual-ready'].includes(story.editorialStatus ?? ''))).toBe(true);
    expect(getPublicStoryPaths().filter((path) => path.mythologyId === 'myth-norse')).toHaveLength(norseStories.length);
    expect(getIndexableStoryPaths().some((path) => path.mythologyId === 'myth-norse')).toBe(false);
    expect(getPublicStoryRedirectPaths().some((path) => path.mythologyId === 'myth-norse')).toBe(true);
  });

  it('registers Ragnarök key-moment illustration drafts without approving the Stories', () => {
    const slugs = ['fimbulwinter', 'odin-and-fenrir', 'thor-and-jormungandr-final-battle', 'freyr-and-surtr', 'heimdall-and-loki', 'ragnarok'];
    const keyMomentStories = norseStories.filter((story) => slugs.includes(story.slug));

    expect(keyMomentStories).toHaveLength(slugs.length);
    expect(keyMomentStories.every((story) => story.heroAssetId?.startsWith('story-illustration-norse-'))).toBe(true);
    expect(keyMomentStories.every((story) => getStoryIllustrationById(story.heroAssetId!))).toBe(true);
    expect(keyMomentStories.every((story) => !['source-reviewed', 'visual-ready'].includes(story.editorialStatus ?? ''))).toBe(true);
  });

  it('registers Creation-cycle key-moment drafts with project-local image files', () => {
    const slugs = ['ymir-creation', 'audhumla-and-buri', 'odin-creates-world', 'ask-and-embla', 'yggdrasil-wells-norns', 'norns-at-urdarbrunnr', 'sun-and-moon-chase', 'nidhoggr-and-world-tree'];
    const creationStories = norseStories.filter((story) => slugs.includes(story.slug));

    expect(creationStories).toHaveLength(slugs.length);
    expect(creationStories.every((story) => {
      const asset = getStoryIllustrationById(story.heroAssetId!);
      return asset?.provenance.reviewStatus === 'draft' && existsSync(resolve(process.cwd(), 'public', asset.image.src.slice(1)));
    })).toBe(true);
  });

  it('keeps legacy source overrides consistent across page sources and narrative claims', () => {
    const legacyStory = norseStories.find((story) => story.id === 'story-aesir-vanir-war')!;
    const claimSource = legacyStory.claims?.[0].sourceRefs[0];

    expect(legacyStory.sources[0]).toMatchObject({ sourceId: 'norse-src-voluspa', locator: 'st. 21–24' });
    expect(claimSource).toMatchObject({ sourceId: 'norse-src-voluspa', locator: 'st. 21–24' });
    expect(legacyStory.requiredSourceIds).toContain('norse-src-voluspa');
    expect(legacyStory.blocks.some((block) => block.type === 'paragraph' && block.text.includes('st. 21–24'))).toBe(true);
  });

  it('keeps registered AI world assets present, unique and output-spec compatible', () => {
    const aiAssets = norseAssetProvenance.filter((asset) => asset.sourceType === 'ai');
    const assetKeys = aiAssets.map((asset) => `${asset.ownerId}|${asset.outputSpecId}`);

    expect(new Set(assetKeys).size).toBe(assetKeys.length);
    expect(aiAssets.every((asset) => existsSync(resolve(process.cwd(), 'public', asset.assetPath.slice(1))))).toBe(true);
    expect(aiAssets.filter((asset) => asset.outputSpecId === 'desktop-wallpaper').every((asset) => {
      const world = bundle.worlds.find((item) => item.id === asset.ownerId);
      return world?.heroImage.width !== undefined && world.heroImage.width > world.heroImage.height;
    })).toBe(true);
    expect(aiAssets.filter((asset) => asset.outputSpecId === 'mobile-wallpaper').every((asset) => {
      const world = bundle.worlds.find((item) => item.id === asset.ownerId);
      return world?.heroImageMobile?.height !== undefined && world.heroImageMobile.height > world.heroImageMobile.width;
    })).toBe(true);
  });

  it('keeps non-reviewed Norse Stories out of the rendered sitemap XML', async () => {
    const response = await getSitemap({
      site: new URL('https://mythcanvas.example'),
      url: new URL('https://mythcanvas.example/sitemap-pages.xml?part=entities'),
    } as Parameters<typeof getSitemap>[0]);
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(xml).not.toContain('/mythology/norse/ymir-creation/');
    expect(xml).not.toContain('/mythology/norse/ragnarok/');
  });

  it('creates a gated Collection Discovery input without inventing product specs', () => {
    const handoff = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: norseStories,
      series: bundle.series,
    });

    expect(handoff.status).toBe('blocked-until-completion');
    expect(handoff.cycles).toHaveLength(norseStoryCycles.length);
    expect(handoff.eligibleCycleIds).toEqual([]);
    expect(handoff.gates).toEqual({
      sourceReviewedP0: 'pending',
      visualApprovedWorlds: 'pending',
      visualApprovedStoryKeyMoments: 'pending',
      productSignoff: 'pending',
    });
    expect(handoff.cycles.every((cycle) => cycle.naturalCardCapacity.status === 'deferred-until-content-gate')).toBe(true);
  });

  it('does not make a Collection cycle eligible from draft visual assets', () => {
    const handoff = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: norseStories,
      series: bundle.series,
      worldAssets: norseAssetProvenance,
      illustrations: storyIllustrations,
    });

    expect(handoff.eligibleCycleIds).toEqual([]);
    expect(handoff.gates.visualApprovedWorlds).toBe('pending');
    expect(handoff.gates.visualApprovedStoryKeyMoments).toBe('pending');
    expect(handoff.cycles.every((cycle) => cycle.visualDiversity.status === 'blocked')).toBe(true);
  });
});
