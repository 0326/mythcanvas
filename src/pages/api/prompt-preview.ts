import type { APIRoute } from 'astro';
import {
  composeGenerationPrompt,
  composeGenerationPromptLayers,
  resolveGenerationContext,
} from '../../lib/generation/prompt';
import { GenerationValidationError, parseGenerationRequest } from '../../lib/generation/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json().catch(() => null);
    const generationRequest = parseGenerationRequest(payload);
    const context = await resolveGenerationContext(locals.runtime.env.DB, generationRequest);
    const layers = composeGenerationPromptLayers(context);
    const prompt = composeGenerationPrompt(context);

    return json({
      prompt,
      layers,
      context: {
        entityType: context.entityType,
        entityName: context.entityName,
        mythologyName: context.mythologyName,
        interpretationName: context.interpretation?.name,
        variantName: context.variant?.name,
        styleName: context.styleName,
        scene: context.scene,
        composition: context.composition,
        output: {
          id: context.outputSpec.id,
          name: context.outputSpec.name,
          deviceType: context.outputSpec.deviceType,
          ratio: context.outputSpec.ratio,
          width: context.dimensions.width,
          height: context.dimensions.height,
        },
        description: context.description,
      },
    });
  } catch (error) {
    if (error instanceof GenerationValidationError) {
      return json({
        error: { code: error.code, message: error.message },
      }, error.status);
    }

    console.error('Unexpected prompt preview API error', error);
    return json({
      error: { code: 'INTERNAL_ERROR', message: '提示词暂时无法解析，请稍后再试。' },
    }, 500);
  }
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
