import { completeGenerationJob, failGenerationJob, insertGenerationJob, markGenerationGenerating } from '../cloudflare/generation-repository';
import { persistGeneratedAsset } from '../cloudflare/assets';
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

export async function generateArtwork(
  request: GenerationRequest,
  env: GenerationServiceEnv,
): Promise<GenerationResponse> {
  const context = resolveGenerationContext(request);
  const prompt = composeGenerationPrompt(context);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
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
    createdAt,
    updatedAt: createdAt,
  };

  const persistedJob = await safeInsert(env.DB, job);

  try {
    await markGenerationGenerating(env.DB, id, provider.name);

    const result = await provider.generate({
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
    });

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
    const message = error instanceof Error ? error.message : 'Unknown generation error';
    await failGenerationJob(env.DB, id, 'GENERATION_FAILED', message).catch(() => undefined);
    return {
      id,
      status: 'failed',
      persisted: persistedJob,
      provider: provider.name,
      promptPreview: summarizePrompt(prompt),
      error: {
        code: 'GENERATION_FAILED',
        message: '这次神迹没有完成，请稍后再试。',
      },
    };
  }
}

async function safeInsert(db: D1Database | undefined, job: GenerationJob): Promise<boolean> {
  try {
    return await insertGenerationJob(db, job);
  } catch (error) {
    console.warn('Generation job persistence unavailable; continuing without D1.', error);
    return false;
  }
}

function summarizePrompt(prompt: string): string {
  return prompt.replace(/\s+/g, ' ').trim().slice(0, 280);
}
