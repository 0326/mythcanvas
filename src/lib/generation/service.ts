import { completeGenerationJob, failGenerationJob, insertGenerationJob, markGenerationGenerating } from '../cloudflare/generation-repository';
import { persistGeneratedAsset } from '../cloudflare/assets';
import { moderateGenerationInput } from '../moderation/moderation';
import { composeGenerationPrompt, composeGenerationPromptLayers, resolveGenerationContext } from './prompt';
import { createImageGenerationProvider, ImageProviderError } from './provider';
import { loadGenerationReferenceImages } from './reference-assets';
import type { GenerationJob, GenerationQuality, GenerationRequest, GenerationResponse } from './types';

export type GenerationServiceEnv = {
  DB?: D1Database;
  ARTWORKS?: R2Bucket;
  AI_GENERATION_MODE?: 'mock' | 'http' | 'openai';
  AI_PROVIDER_ENDPOINT?: string;
  AI_PROVIDER_API_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENAI_IMAGE_MODEL?: string;
  OPENAI_IMAGE_QUALITY?: GenerationQuality;
};

/** 不可重试错误：重试同样会失败（审核、参数错误） */
export const NON_RETRYABLE_CODES = new Set([
  'MODERATED',
  'INVALID_REQUEST',
  'STYLE_NOT_FOUND',
  'ENTITY_NOT_FOUND',
  'MYTHOLOGY_NOT_FOUND',
  'INTERPRETATION_NOT_FOUND',
  'INVALID_INTERPRETATION',
  'VARIANT_NOT_FOUND',
  'INVALID_VARIANT',
  'INVALID_OUTPUT_SPEC',
  'OUTPUT_SPEC_RATIO_MISMATCH',
  'OPENAI_MODERATION_BLOCKED',
]);

// GPT Image 2 complex generations may legitimately approach two minutes.
// Keep a little transport headroom instead of cutting valid requests off at 120s.
const GENERATION_TIMEOUT_MS = 180_000;

export async function generateArtwork(
  request: GenerationRequest,
  env: GenerationServiceEnv,
  userId?: string,
): Promise<GenerationResponse> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const moderation = moderateGenerationInput({
    scene: request.scene,
    composition: request.composition,
    description: request.description ?? '',
    entityName: request.entityType,
  });
  if (!moderation.passed) {
    const job: GenerationJob = {
      id,
      status: 'moderated',
      entityType: request.entityType,
      entityId: request.entityId,
      mythologyId: '',
      styleId: request.styleId,
      characterInterpretationId: request.interpretationId,
      characterVariantId: request.variantId,
      outputSpecId: request.outputSpecId,
      scene: request.scene,
      composition: request.composition,
      ratio: request.ratio,
      description: request.description ?? '',
      prompt: '',
      provider: 'none',
      sourceGenerationId: request.sourceGenerationId,
      createdAt,
      updatedAt: createdAt,
    };
    await safeInsert(env.DB, job, userId);
    return {
      id,
      status: 'moderated',
      persisted: false,
      provider: 'none',
      promptPreview: '',
      error: {
        code: 'MODERATED',
        message: `生成内容未通过安全审核：${moderation.reasons.join('；')}`,
      },
    };
  }

  let context;
  try {
    context = await resolveGenerationContext(env.DB, request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const code = error instanceof Error && 'code' in error ? String((error as { code: string }).code) : 'INVALID_REQUEST';
    return {
      id,
      status: 'failed',
      persisted: false,
      provider: 'none',
      promptPreview: '',
      error: { code, message },
    };
  }

  const promptLayers = composeGenerationPromptLayers(context);
  const prompt = composeGenerationPrompt(context);

  let provider;
  try {
    provider = createImageGenerationProvider(env);
  } catch (error) {
    const code = error instanceof ImageProviderError ? error.code : 'PROVIDER_CONFIG_ERROR';
    const message = error instanceof Error ? error.message : 'Image provider configuration error';
    return {
      id,
      status: 'failed',
      persisted: false,
      provider: 'none',
      promptPreview: summarizePrompt(prompt),
      error: { code, message },
    };
  }

  const generationModel = env.AI_GENERATION_MODE === 'openai'
    ? (env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2')
    : undefined;
  const quality = context.outputSpec.quality;

  // Character generation opportunistically upgrades from text-only generation to
  // reference-image editing when an approved Canonical/Variant Reference Pack exists.
  // Missing D1/R2/reference assets must never make the Creator unusable.
  const references = context.entityType === 'character'
    ? await loadGenerationReferenceImages(
        env.DB,
        env.ARTWORKS,
        context.entityId,
        context.variant?.id,
        context.interpretation?.id,
      )
    : [];
  const referenceAssetIds = references.map((reference) => reference.id);

  const job: GenerationJob = {
    id,
    status: 'queued',
    entityType: context.entityType,
    entityId: context.entityId,
    mythologyId: context.mythologyId,
    styleId: context.styleId,
    characterInterpretationId: context.interpretation?.id,
    characterVariantId: context.variant?.id,
    outputSpecId: context.outputSpec.id,
    scene: context.scene,
    composition: context.composition,
    ratio: context.ratio,
    description: context.description,
    prompt,
    promptLayers,
    provider: provider.name,
    generationModel,
    generationQuality: quality,
    referenceAssetIds,
    sourceGenerationId: request.sourceGenerationId,
    createdAt,
    updatedAt: createdAt,
  };

  const persistedJob = await safeInsert(env.DB, job, userId);

  try {
    await markGenerationGenerating(env.DB, id, provider.name);

    const result = await withTimeout(
      provider.generate({
        id,
        prompt,
        width: context.dimensions.width,
        height: context.dimensions.height,
        quality,
        references,
        metadata: {
          entityType: context.entityType,
          entityId: context.entityId,
          entityName: context.entityName,
          mythologyId: context.mythologyId,
          mythologyName: context.mythologyName,
          interpretationId: context.interpretation?.id ?? '',
          interpretationName: context.interpretation?.name ?? '',
          variantId: context.variant?.id ?? '',
          variantName: context.variant?.name ?? '',
          styleId: context.styleId,
          styleName: context.styleName,
          scene: context.scene,
          composition: context.composition,
          outputSpecId: context.outputSpec.id,
          ratio: context.ratio,
          referenceCount: String(references.length),
        },
      }),
      GENERATION_TIMEOUT_MS,
    );

    const asset = await persistGeneratedAsset(env.ARTWORKS, {
      id,
      bytes: result.bytes,
      mimeType: result.mimeType,
      width: result.width,
      height: result.height,
    });

    await completeGenerationJob(env.DB, {
      id,
      provider: result.provider,
      providerRequestId: result.providerRequestId,
      generationModel: result.model ?? generationModel,
      assetKey: asset.key || undefined,
      mimeType: result.mimeType,
      width: result.width,
      height: result.height,
    });

    return {
      id,
      status: 'succeeded',
      imageUrl: asset.url,
      persisted: persistedJob && asset.persisted,
      provider: result.provider,
      promptPreview: summarizePrompt(prompt),
    };
  } catch (error) {
    const isTimeout = error instanceof GenerationTimeoutError;
    const isProviderError = error instanceof ImageProviderError;
    const message = error instanceof Error ? error.message : 'Unknown generation error';
    const code = isTimeout
      ? 'GENERATION_TIMEOUT'
      : isProviderError
        ? error.code
        : 'GENERATION_FAILED';
    const persistedMessage = isTimeout ? '生成超时，请稍后重试。' : message;
    await failGenerationJob(env.DB, id, code, persistedMessage).catch(() => undefined);

    const publicMessage = isTimeout
      ? '这次神迹用时太久，请稍后重试。'
      : code === 'OPENAI_MODERATION_BLOCKED'
        ? '这次生成请求未通过图片模型的安全检查，请调整描述后再试。'
        : '这次神迹没有完成，请稍后再试。';

    return {
      id,
      status: 'failed',
      persisted: persistedJob,
      provider: provider.name,
      promptPreview: summarizePrompt(prompt),
      error: { code, message: publicMessage },
    };
  }
}

class GenerationTimeoutError extends Error {
  constructor() {
    super('Generation timed out');
    this.name = 'GenerationTimeoutError';
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new GenerationTimeoutError()), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function safeInsert(db: D1Database | undefined, job: GenerationJob, userId?: string): Promise<boolean> {
  try {
    return await insertGenerationJob(db, job, userId);
  } catch (error) {
    console.warn('Generation job persistence unavailable; continuing without D1.', error);
    return false;
  }
}

function summarizePrompt(prompt: string): string {
  return prompt.replace(/\s+/g, ' ').trim().slice(0, 280);
}
