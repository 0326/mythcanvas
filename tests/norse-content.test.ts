import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { norseAssetProvenance, norseCharacters, norseClaims, norseInterpretations, norseKnownIssues, norseMythicObjects, norseNames, norseRelations, norseSourceCoverage, norseSources, norseStories, norseStoryCycles, norseStoryDependencyPlan, norseStoryManifest, norseVariantNotes, norseVisualTiers } from '../src/content/norse';
import { buildNorseCollectionDiscoveryInput } from '../src/content/norse/collection-handoff';
import { norseCompletionSnapshotApproval, norseIdentityAudit, norseProductSignoff } from '../src/content/norse/collection-signoff';
import { getStoryIllustrationById } from '../src/data/story-illustrations';
import { storyIllustrations } from '../src/data/story-illustrations';
import { publishedArtworks } from '../src/data/published-artworks';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';
import { validateMythStories } from '../src/lib/content/story-validation';
import { getIndexableStoryPaths, getPublicStoryPaths, getPublicStoryRedirectPaths, getStoryRedirectForMythology, isStoryEditoriallyIndexable } from '../src/lib/content/stories';
import { GET as getSitemap } from '../src/pages/sitemap-pages.xml';

const localAssetPath = (assetPath: string): string => {
  const normalized = assetPath.replace(/^\/+/, '');
  const norseDelivery = normalized.match(/^media\/content\/norse\/(?:stories|worlds)\/(.+)\.webp$/i);
  const norseSource = normalized.match(/^(?:art|source\/norse)\/(.+\.(?:png|jpe?g))$/i);
  return norseDelivery
    ? resolve(process.cwd(), 'content-assets', 'norse', `${norseDelivery[1]}.png`)
    : norseSource
      ? resolve(process.cwd(), 'content-assets', 'norse', norseSource[1])
      : resolve(process.cwd(), 'public', normalized);
};

describe('Norse structured content', () => {
  const bundle = getStructuredMythologyBundle('myth-norse')!;

  it('publishes source-scoped names, interpretations and claims for identity-sensitive material', () => {
    expect(norseNames.length).toBeGreaterThanOrEqual(6);
    expect(norseInterpretations.some((item) => item.id === 'interpretation-norse-brynhildr-sigrdrifa')).toBe(true);
    expect(norseInterpretations.some((item) => item.id === 'interpretation-norse-rigr-rigsthula')).toBe(true);
    expect(norseClaims.some((item) => item.id === 'claim-norse-ask-embla-triad' && item.status === 'contested')).toBe(true);
    expect(norseClaims.some((item) => item.id === 'claim-norse-garmr-fenrir-boundary')).toBe(true);
    expect(bundle.claims).toHaveLength(norseClaims.length);
    expect(bundle.names).toHaveLength(norseNames.length);
    expect(bundle.interpretations).toHaveLength(norseInterpretations.length);
  });

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
    expect(norseSourceCoverage.every((item) => item.reviewKind === 'scope-mapped')).toBe(true);
    expect(norseSourceCoverage.every((item) => item.reviewerType === 'automated')).toBe(true);
    expect(norseStoryManifest).toHaveLength(74);
    expect(norseStories).toHaveLength(74);
    expect(norseStories.map((story) => story.id)).toEqual(expect.arrayContaining(['story-aesir-vanir-war', 'story-aesir-vanir-truce']));
    expect(norseStoryCycles).toHaveLength(9);
    expect(norseMythicObjects).toHaveLength(18);
    expect(norseStoryManifest.filter((item) => item.priority === 'P2')).toHaveLength(2);
    expect(norseStoryManifest.filter((item) => item.priority === 'P2').every((item) => item.collectionDisposition === 'deferred')).toBe(true);
    expect(norseKnownIssues.filter((item) => item.priority === 'P0').every((item) => item.status === 'resolved')).toBe(true);
    expect(norseVariantNotes.filter((item) => item.priority === 'P0').every((item) => item.status === 'scoped')).toBe(true);
    expect(norseSources.filter((item) => ['norse-src-voluspa', 'norse-src-prose-edda-gylfaginning', 'norse-src-haustlong', 'norse-src-volsunga-saga'].includes(item.sourceId)).every((item) => item.edition && item.licenseNote)).toBe(true);

    const directEddicTextSources = norseSources.filter((item) => ['eddic-mythological', 'eddic-heroic'].includes(item.sourceFamily ?? ''));
    expect(directEddicTextSources).not.toHaveLength(0);
    expect(directEddicTextSources.every((item) => item.url?.match(/(?:sacred-texts\.com\/neu\/poe\/poe\d+\.htm|voluspa\.org\/grottasongr\.htm)$/))).toBe(true);
    expect(norseSources.find((item) => item.sourceId === 'norse-src-prose-edda-gylfaginning')?.url).toBe('https://sacred-texts.com/neu/pre/pre04.htm');
    expect(norseSources.find((item) => item.sourceId === 'norse-src-prose-edda-skaldskaparmal')?.url).toBe('https://sacred-texts.com/neu/pre/pre05.htm');
    expect(norseSources.find((item) => item.sourceId === 'norse-src-ynglinga-saga')?.url).toBe('https://sacred-texts.com/neu/heim/02ynglga.htm');
  });

  it('does not leave broad placeholder locators in entity or relation evidence', () => {
    const refs = [
      ...bundle.stories.flatMap((item) => item.sources),
      ...bundle.characters.flatMap((item) => item.sourceRefs ?? []),
      ...(bundle.objects ?? []).flatMap((item) => item.sourceRefs ?? []),
      ...bundle.relations.flatMap((item) => item.sourceRefs),
      ...(bundle.contentRelations ?? []).flatMap((item) => item.sourceRefs),
      ...(bundle.names ?? []).flatMap((item) => item.sourceRefs),
      ...(bundle.interpretations ?? []).flatMap((item) => item.sourceRefs),
      ...(bundle.claims ?? []).flatMap((item) => item.sourceRefs),
      ...norseVariantNotes.flatMap((item) => item.sourceRefs),
    ];
    expect(refs.filter((ref) => /selected stanzas|locator required|Phase 3|按相关章节|按相关诗篇|按相关 stanza/i.test(ref.locator ?? '') )).toEqual([]);
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

  it('does not let an automated editorial reviewer satisfy the source gate', () => {
    const sourceReviewedStory = norseStories.find((story) => story.slug === 'ymir-creation')!;
    const issues = validateMythStories({
      stories: [{
        ...sourceReviewedStory,
        editorialStatus: 'source-reviewed' as const,
        editorialReview: {
          status: 'approved' as const,
          reviewerType: 'automated' as const,
          reviewer: 'content-ci',
          reviewedAt: '2026-09-07',
          sourceDecisionNotes: ['Automated structural check only.'],
          unresolvedIssueIds: [],
        },
      }],
      mythologies: [mythologies.find((item) => item.id === 'myth-norse')!],
      characters: norseCharacters,
      worlds: bundle.worlds,
      scenes: bundle.scenes,
      objects: norseMythicObjects,
      illustrations: storyIllustrations,
    });
    expect(issues.map((issue) => issue.field)).toContain('editorialReview');
  });

  it('does not let a visual-ready Story bypass human illustration approval', () => {
    const sourceReviewedStory = norseStories.find((story) => story.slug === 'ymir-creation')!;
    const visualReadyStory = {
      ...sourceReviewedStory,
      editorialStatus: 'visual-ready' as const,
      editorialReview: {
        status: 'approved' as const,
        reviewerType: 'human' as const,
        reviewer: 'content-editor',
        reviewedAt: '2026-09-07',
        sourceDecisionNotes: ['Reviewed for gate test.'],
        unresolvedIssueIds: [],
      },
    };
    const issues = validateMythStories({
      stories: [visualReadyStory],
      mythologies: [mythologies.find((item) => item.id === 'myth-norse')!],
      characters: norseCharacters,
      worlds: bundle.worlds,
      scenes: bundle.scenes,
      objects: norseMythicObjects,
      illustrations: storyIllustrations,
    });
    expect(issues.map((issue) => issue.field)).toContain('heroAssetId');
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
      return asset?.provenance.reviewStatus === 'draft' && existsSync(localAssetPath(asset.image.src));
    })).toBe(true);
  });

  it('closes every Norse Story key-moment slot without treating drafts as approved', () => {
    expect(norseStories.every((story) => {
      const asset = getStoryIllustrationById(story.heroAssetId ?? '');
      return Boolean(asset)
        && asset?.provenance.reviewStatus === 'draft'
        && existsSync(localAssetPath(asset.image.src));
    })).toBe(true);
    expect(storyIllustrations.filter((asset) => asset.provenance.reviewStatus === 'approved')).toHaveLength(0);
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
    expect(aiAssets.every((asset) => existsSync(localAssetPath(asset.assetPath)))).toBe(true);
    expect(aiAssets.filter((asset) => asset.outputSpecId === 'desktop-wallpaper').every((asset) => {
      const world = bundle.worlds.find((item) => item.id === asset.ownerId);
      return world?.heroImage.width === 2560 && world.heroImage.height === 1440;
    })).toBe(true);
    expect(aiAssets.filter((asset) => asset.outputSpecId === 'mobile-wallpaper').every((asset) => {
      const world = bundle.worlds.find((item) => item.id === asset.ownerId);
      return world?.heroImageMobile?.width === 1440 && world.heroImageMobile.height === 2560;
    })).toBe(true);
    expect(aiAssets.every((asset) => asset.deliveryTransform === 'resize-only' && asset.sourceAssetPath)).toBe(true);
  });

  it('keeps Tier S/A Character artwork coverage explicit and orthogonal to human visual approval', () => {
    const canonicalNorseArtworks = publishedArtworks.filter((artwork) =>
      artwork.mythologyId === 'myth-norse'
      && artwork.type === 'character'
      && artwork.styleId === 'canonical'
      && artwork.reviewStatus === 'approved',
    );
    const byCharacterId = new Map<string, typeof canonicalNorseArtworks>();
    for (const artwork of canonicalNorseArtworks) {
      for (const characterId of artwork.characterIds ?? []) {
        const current = byCharacterId.get(characterId) ?? [];
        current.push(artwork);
        byCharacterId.set(characterId, current);
      }
    }

    for (const slug of norseVisualTiers.S) {
      const assets = byCharacterId.get(`character-${slug}`) ?? [];
      expect(assets.some((asset) => asset.image.width > asset.image.height), `${slug} needs a desktop canonical asset`).toBe(true);
      expect(assets.some((asset) => asset.image.height > asset.image.width), `${slug} needs a mobile canonical asset`).toBe(true);
    }
    for (const slug of norseVisualTiers.A) {
      const assets = byCharacterId.get(`character-${slug}`) ?? [];
      expect(assets.some((asset) => asset.image.height > asset.image.width), `${slug} needs a portrait/reference asset`).toBe(true);
    }

    expect(canonicalNorseArtworks.every((artwork) => artwork.image.src.startsWith('/media/characters/'))).toBe(true);
    // D1 publication approval is not a substitute for the separate human
    // visual gate recorded in the Norse provenance/sign-off registries.
    expect(canonicalNorseArtworks.every((artwork) => artwork.reviewStatus === 'approved')).toBe(true);
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

  it('keeps a non-human editorial approval out of indexable Story paths', () => {
    const sourceReviewedStory = norseStories.find((story) => story.slug === 'ymir-creation')!;
    const automatedStory = {
      ...sourceReviewedStory,
      editorialStatus: 'source-reviewed' as const,
      editorialReview: {
        status: 'approved' as const,
        reviewerType: 'automated' as const,
        reviewer: 'content-ci',
        reviewedAt: '2026-09-07',
        sourceDecisionNotes: ['Automated structural check only.'],
        unresolvedIssueIds: [],
      },
    };

    expect(automatedStory.editorialReview.reviewerType).not.toBe('human');
    expect(isStoryEditoriallyIndexable(automatedStory)).toBe(false);
    expect(getIndexableStoryPaths()).not.toContainEqual({ mythologyId: 'myth-norse', slug: automatedStory.slug });
  });

  it('requires a non-empty human source decision before indexing a Story', () => {
    const sourceReviewedStory = norseStories.find((story) => story.slug === 'ymir-creation')!;
    const missingDecisionNotes = {
      ...sourceReviewedStory,
      editorialStatus: 'source-reviewed' as const,
      editorialReview: {
        status: 'approved' as const,
        reviewerType: 'human' as const,
        reviewer: 'content-editor',
        reviewedAt: '2026-09-07',
        sourceDecisionNotes: ['  '],
        unresolvedIssueIds: [],
      },
    };

    expect(isStoryEditoriallyIndexable(missingDecisionNotes)).toBe(false);
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
      identityAudit: 'pending',
      productSignoff: 'pending',
      snapshotApproval: 'pending',
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

  it('requires human provenance before an approved visual can unlock a Collection gate', () => {
    const approvedWorldAssets = norseAssetProvenance.map((asset) => ({ ...asset, reviewStatus: 'approved' as const }));
    const approvedIllustrations = storyIllustrations.map((asset) => ({
      ...asset,
      provenance: { ...asset.provenance, reviewStatus: 'approved' as const },
    }));
    const handoff = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: norseStories,
      series: bundle.series,
      worldAssets: approvedWorldAssets,
      illustrations: approvedIllustrations,
    });

    expect(handoff.gates.visualApprovedWorlds).toBe('pending');
    expect(handoff.gates.visualApprovedStoryKeyMoments).toBe('pending');
    expect(handoff.eligibleCycleIds).toEqual([]);
  });

  it('requires a dated product sign-off record instead of trusting a ready string', () => {
    expect(norseProductSignoff).toEqual({ status: 'pending' });
    expect(norseIdentityAudit).toEqual({ status: 'pending' });
    expect(norseCompletionSnapshotApproval).toEqual({ status: 'pending' });
    const readyString = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: norseStories,
      productSignoff: 'ready',
    });
    const readyRecord = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: norseStories,
      snapshotVersion: 'norse-completion-snapshot-v1-product-test',
      productSignoff: {
        status: 'ready',
        snapshotVersion: 'norse-completion-snapshot-v1-product-test',
        reviewerType: 'human',
        reviewer: 'product-owner',
        signedAt: '2026-09-07',
        decisionNotes: ['Approved only after all content and visual gates are green.'],
      },
    });

    expect(readyString.gates.productSignoff).toBe('pending');
    expect(readyRecord.gates.productSignoff).toBe('ready');
    expect(readyRecord.approvalRecords.productSignoff.reviewer).toBe('product-owner');
    expect(readyRecord.gates.identityAudit).toBe('pending');
    expect(readyRecord.gates.snapshotApproval).toBe('pending');

    const staleRecord = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: norseStories,
      snapshotVersion: 'norse-completion-snapshot-v1-product-test',
      productSignoff: {
        status: 'ready',
        snapshotVersion: 'norse-completion-snapshot-v1-old',
        reviewerType: 'human',
        reviewer: 'product-owner',
        signedAt: '2026-09-07',
        decisionNotes: ['This sign-off belongs to an older snapshot and must be rejected.'],
      },
    });
    expect(staleRecord.gates.productSignoff).toBe('pending');

    const nonIndependentSnapshot = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: norseStories,
      snapshotVersion: 'norse-completion-snapshot-v1-product-test',
      productSignoff: {
        status: 'ready',
        snapshotVersion: 'norse-completion-snapshot-v1-product-test',
        reviewerType: 'human',
        reviewer: 'same-reviewer',
        signedAt: '2026-09-07',
        decisionNotes: ['Product decision record.'],
      },
      snapshotApproval: {
        status: 'approved',
        snapshotVersion: 'norse-completion-snapshot-v1-product-test',
        reviewerType: 'human',
        reviewer: 'same-reviewer',
        reviewedAt: '2026-09-07',
        decisionNotes: ['This must be independently reviewed.'],
        unresolvedIssueIds: [],
      },
    });
    expect(nonIndependentSnapshot.gates.snapshotApproval).toBe('pending');

    const automatedRecord = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: norseStories,
      productSignoff: {
        status: 'ready',
        reviewerType: 'automated',
        reviewer: 'ci-check',
        signedAt: '2026-09-07',
        decisionNotes: ['This must remain a machine check, not a product approval.'],
      },
    });
    expect(automatedRecord.gates.productSignoff).toBe('pending');
  });

  it('requires a separate human approval for the generated Completion Snapshot', () => {
    const approval = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: norseStories,
      snapshotVersion: 'norse-completion-snapshot-v1-current',
      snapshotApproval: {
        status: 'approved',
        snapshotVersion: 'norse-completion-snapshot-v1-old',
        reviewerType: 'automated',
        reviewer: 'ci-check',
        reviewedAt: '2026-09-07',
        decisionNotes: ['Machine output only.'],
        unresolvedIssueIds: [],
      },
    });

    expect(approval.gates.snapshotApproval).toBe('pending');
    expect(approval.status).toBe('blocked-until-completion');
  });

  it('rejects impossible calendar dates in human approval records', () => {
    const approval = buildNorseCollectionDiscoveryInput({
      manifest: [],
      stories: [],
      snapshotVersion: 'norse-completion-snapshot-v1-date-check',
      snapshotApproval: {
        status: 'approved',
        snapshotVersion: 'norse-completion-snapshot-v1-date-check',
        reviewerType: 'human',
        reviewer: 'snapshot-reviewer',
        reviewedAt: '2026-02-31',
        decisionNotes: ['This date must be rejected rather than normalized.'],
        unresolvedIssueIds: [],
      },
    });

    expect(approval.gates.snapshotApproval).toBe('pending');
  });

  it('rejects blank decision notes in every human approval gate', () => {
    const snapshotVersion = 'norse-completion-snapshot-v1-notes-check';
    const base = { manifest: [], stories: [], snapshotVersion } as const;

    const product = buildNorseCollectionDiscoveryInput({
      ...base,
      productSignoff: {
        status: 'ready',
        snapshotVersion,
        reviewerType: 'human',
        reviewer: 'product-owner',
        signedAt: '2026-09-07',
        decisionNotes: ['   '],
      },
    });
    const identity = buildNorseCollectionDiscoveryInput({
      ...base,
      identityAudit: {
        status: 'approved',
        snapshotVersion,
        reviewerType: 'human',
        reviewer: 'identity-reviewer',
        reviewedAt: '2026-09-07',
        decisionNotes: [''],
        unresolvedIssueIds: [],
      },
    });
    const snapshot = buildNorseCollectionDiscoveryInput({
      ...base,
      snapshotApproval: {
        status: 'approved',
        snapshotVersion,
        reviewerType: 'human',
        reviewer: 'snapshot-reviewer',
        reviewedAt: '2026-09-07',
        decisionNotes: ['\t'],
        unresolvedIssueIds: [],
      },
    });

    expect(product.gates.productSignoff).toBe('pending');
    expect(identity.gates.identityAudit).toBe('pending');
    expect(snapshot.gates.snapshotApproval).toBe('pending');
  });

  it('does not let explicitly deferred P2 Stories block an otherwise complete Collection handoff', () => {
    const humanReviewedStories = norseStories.map((story) => ({
      ...story,
      editorialStatus: 'source-reviewed' as const,
      editorialReview: {
        status: 'approved' as const,
        reviewerType: 'human' as const,
        reviewer: 'editorial-reviewer',
        reviewedAt: '2026-09-07',
        sourceDecisionNotes: ['Reviewed against the registered source locator.'],
        unresolvedIssueIds: [],
      },
    }));
    const humanApprovedWorldAssets = norseAssetProvenance.map((asset) => ({
      ...asset,
      reviewStatus: 'approved' as const,
      reviewerType: 'human' as const,
      reviewer: 'visual-reviewer',
      reviewedAt: '2026-09-07',
      reviewNotes: ['Reviewed identity anchors, composition and desktop/mobile consistency.'],
    }));
    const humanApprovedIllustrations = storyIllustrations.map((asset) => ({
      ...asset,
      provenance: {
        ...asset.provenance,
        reviewStatus: 'approved' as const,
        reviewerType: 'human' as const,
        reviewer: 'visual-reviewer',
        reviewedAt: '2026-09-07',
        reviewNotes: ['Reviewed key-moment source boundary, identity and composition.'],
      },
    }));
    const handoff = buildNorseCollectionDiscoveryInput({
      manifest: norseStoryManifest,
      stories: humanReviewedStories,
      series: bundle.series,
      worldAssets: humanApprovedWorldAssets,
      illustrations: humanApprovedIllustrations,
      snapshotVersion: 'norse-completion-snapshot-v1-test',
      identityAudit: {
        status: 'approved',
        snapshotVersion: 'norse-completion-snapshot-v1-test',
        reviewerType: 'human',
        reviewer: 'identity-reviewer',
        reviewedAt: '2026-09-07',
        decisionNotes: ['Reviewed names, interpretations and claims against registered sources.'],
        unresolvedIssueIds: [],
      },
      productSignoff: {
        status: 'ready',
        snapshotVersion: 'norse-completion-snapshot-v1-test',
        reviewerType: 'human',
        reviewer: 'product-owner',
        signedAt: '2026-09-07',
        decisionNotes: ['Approved after content and visual review.'],
      },
      snapshotApproval: {
        status: 'approved',
        snapshotVersion: 'norse-completion-snapshot-v1-test',
        reviewerType: 'human',
        reviewer: 'snapshot-reviewer',
        reviewedAt: '2026-09-07',
        decisionNotes: ['Approved the generated evidence snapshot.'],
        unresolvedIssueIds: [],
      },
    });

    expect(handoff.status).toBe('ready-for-discovery');
    expect(handoff.gates).toEqual({
      sourceReviewedP0: 'ready',
      visualApprovedWorlds: 'ready',
      visualApprovedStoryKeyMoments: 'ready',
      identityAudit: 'ready',
      productSignoff: 'ready',
      snapshotApproval: 'ready',
    });
    expect(handoff.eligibleCycleIds).toHaveLength(norseStoryCycles.length);
    expect(handoff.deferredCycleIds).toEqual([]);
    expect(handoff.cycles.find((cycle) => cycle.cycleId === 'independent-eddic')?.deferredStoryManifestIds).toHaveLength(2);
    expect(handoff.exclusions).toEqual(expect.arrayContaining([
      expect.stringContaining('里格与社会秩序'),
      expect.stringContaining('格罗蒂之歌'),
    ]));
  });
});
