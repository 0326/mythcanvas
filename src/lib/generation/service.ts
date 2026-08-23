import { completeGenerationJob, failGenerationJob, insertGenerationJob, markGenerationGenerating } from '../cloudflare/generation-repository';
import { persistGeneratedAsset } from '../cloudflare/assets';
import { moderateGenerationInput } from '../moderation/moderation';
import { composeGenerationPrompt, resolveGenerationContext } from './prompt';
import { createImageGenerationProvider } from './provider';
import type { GenerationJob, GenerationRequest, GenerationResponse } from './types';

export type GenerationServiceEnv = {
  DB?: D1Database;
  ARTWORKS?: R2Bucket;
  AI_GENERATION_MODE?: 'mock' | 'http';
  AI_PROVIDER_ENDPOINT?: string;
  AI_PROVIDER_API_KEY?: string;
};

/** 不可重试错误：重试同样会失败（审核、参数错误） */
export const NON_RETRYABLE_CODES = new Set([
  'MODERATED',
  'INVALID_REQUEST',
  'STYLE_NOT_FOUND',
  'ENTITY_NOT_FOUND',
  'MYTHOLOGY_NOT_FOUND',
]);

const GENERATION_TIMEOUT_MS = 120_000;

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

  const prompt = composeGenerationPrompt(context);
  const provider = createImageGenerationProvider(env);

  const job: GenerationJob = {
    id,
    status: 'queued',
    entityType: context.entityType,
    entityId: context.entityId,
    mythologyId: context.mythologyId,
    styleId: context.styleId,
    scene: context.scene,
    composition: context.composition,
    ratio: context.ratio,
    description: context.description,
    prompt,
    provider: provider.name,
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
        metadata: {
          entityType: context.entityType,
          entityId: context.entityId,
          entityName: context.entityName,
          mythologyId: context.mythologyId,
          mythologyName: context.mythologyName,
          styleId: context.styleId,
          styleName: context.styleName,
          scene: context.scene,
          composition: context.composition,
          ratio: context.ratio,
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
    const message = error instanceof Error ? error.message : 'Unknown generation error';
    const code = isTimeout ? 'GENERATION_TIMEOUT' : 'GENERATION_FAILED';
    await failGenerationJob(env.DB, id, code, isTimeout ? '生成超时，请稍后重试。' : message).catch(() => undefined);
    return {
      id,
      status: 'failed',
      persisted: persistedJob,
      provider: provider.name,
      promptPreview: summarizePrompt(prompt),
      error: {
        code,
        message: isTimeout ? '这次神迹用时太久，请稍后重试。' : '这次神迹没有完成，请稍后再试。',
      },
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
